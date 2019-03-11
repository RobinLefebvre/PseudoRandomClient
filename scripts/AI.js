// Contains the AI static class which handles decision making for the Combat Encounters.
let aiData;
class AI
{
    /** Whenever the AI has done something (Start Turn or taken action), it calls this to effectively restart itself. 
     * We analyze the current situation of the playing Troop, then move the AI state towards "think()" */
    static startAI()
    {
        aiData = {};

        aiData.thinkingTime = 0;
        aiData.doneThinking = false;

        let t = game.initiativeOrder[game.currentIndex];
        aiData.troop = t;

        console.log(`${aiData.troop.name}'s AI starts.`)

        AI.getInfluenceArea();

        AI.lookAroundForOtherTroops();
        
        AI.getAvailableActions();

        aiData.currentAStar;
        aiData.paths = [];
    }

    /** Analyze all the other Troops of the game and organize them into various lists. (Ally, Enemy, Visible, Injured, ...) */
    static lookAroundForOtherTroops()
    {
        aiData.enemies = [];
        aiData.visibleEnemies = [];
        aiData.allies = [];
        aiData.visibleAllies = [];
        aiData.injuredAllies = [];
        aiData.unconciousAllies = [];

        game.initiativeOrder.forEach(troop =>
        {
            let isNotCurrentTroop = (aiData.troop.name !== troop.name || aiData.troop.position.x !== troop.position.x || aiData.troop.position.y !== troop.position.y )
            let isVisible = !camera.obstacleBetween(aiData.troop, troop, 100)
            let isAlly = troop.isPlayer == aiData.troop.isPlayer
            let d = dist(aiData.troop.position.x, aiData.troop.position.y, troop.position.x, troop.position.y);
            let tooFarEnemy = (d > AI.enemyInfluence);
            let tooFarAlly = (d > AI.allyInfluence);
            let injuredAlly = troop.hitPoints.current != troop.hitPoints.maximum;

            if( isNotCurrentTroop && !troop.hasCondition("name", "Unconcious") )
            {
                if(isAlly)
                {
                    aiData.allies.push(troop);
                    if(isVisible && !tooFarAlly)
                    {
                        aiData.visibleAllies.push(troop);
                        if(injuredAlly)
                        {
                            aiData.injuredAllies.push(troop);
                        }
                    }
                }
                else
                {
                    aiData.enemies.push(troop);
                    if(isVisible && !tooFarEnemy)
                    {
                        aiData.visibleEnemies.push(troop);
                    }
                }
            }
            if(isNotCurrentTroop && troop.hasCondition("name", "Unconcious") && isVisible && isAlly && aiData.troop.hasAction('targetsUnconcious') )
            {
                aiData.unconciousAllies.push(troop);
            }
        })
        console.log(`${aiData.troop.name} can see ${aiData.visibleAllies.length} Allies and ${aiData.visibleEnemies.length} Enemies. 
                    ${aiData.allies.length - aiData.visibleAllies.length} Unseen Allies, ${aiData.enemies.length - aiData.visibleEnemies.length} Unseen Enemies`)
    }
    
    /** This grabs the AI troop and records the maximum distance at which it can attack someone. */
    static getInfluenceArea()
    {
        let troop = aiData.troop;
        if(troop !== undefined)
        {
            let radius = 0;
            if(troop.dimension)
                radius += troop.dimension.x;
    
            if(troop.movement)
                radius += troop.movement;
    
            if(troop.actions)
            {
                let tempE = 150; let tempA = 150;
                for(let a = 0; a < troop.actions.length; a++)
                {
                    let act = troop.actions[a];
                    if(act.reach > tempE && act.target == "Enemy")
                    {
                        tempE = act.reach;
                    }
                    if(act.reach > tempA && act.target == "Ally")
                    {
                        tempA = act.reach;
                    }
                }
                console.log(`${troop.name} has actions that can reach an Enemy within ${tempE + radius} clicks and an Ally within ${tempA + radius} clicks. `)
                aiData.enemyInfluence = radius + tempE;
                aiData.allyInfluence = radius + tempA;
            }
        }
    }

    /** Build a list of acceptable actions for the AI to use.
     * Take the actions of the current Troop, determine a bunch of booleans about it. Filter out non-sensical actions. */
    static getAvailableActions()
    {
        let troop = aiData.troop;
        let log = `${troop.name} can use the following Actions (`

        if(troop !== undefined)
        {
            aiData.actions = [];

            let troopCanPlay = troop.actionsPerTurn - troop.actionsTaken > 0;
            let troopFullHealth = (troop.hitPoints.current == troop.hitPoints.maximum);
            let canSeeEnemy = aiData.visibleEnemies.length > 0;
            let canSeeAlly = aiData.visibleAllies.length > 0;
            let canSeeUnconcious = aiData.unconciousAllies.length > 0;
            let canSeeInjured = aiData.injuredAllies.length > 0;
    
            if(troopCanPlay && ( canSeeEnemy || canSeeUnconcious || canSeeInjured) )
            {
                for(let i = 0; i < troop.actions.length; i++)
                {
                    let action = troop.actions[i];
    
                    let actionNotUsed = !action.hasBeenUsed;
                    let actionHasUses = (action.uses !== 0);
                    // If the pool of the action is defined and not empty.
                    let actionHasPool = (!action.pool || (action.pool && troop.pools[action.pool] !== 0) );
                    // If the action is meant to recharge action pool, only display if said pool is empty.
                    let actionPoolRecharge = (!action.condition || !action.condition.recharge || (action.condition.recharge && troop.pools[action.condition.recharge.split(", ")[0]] == 0) );
                    // If the action has additional cost, make sure we have enough "action points" before we allow taking it.
                    let actionCost = (!action.useCost || (troop.actionsPerTurn - troop.actionsTaken - action.addCost >= 0) );
                    
        
                    // If the action heals self while we are at full health, remove.
                    let actionHealsSelf = (action.target == "Self" && action.damage && action.damage[0] == "-");
                    let avoidHealingWaste = (!actionHealsSelf || (actionHealsSelf && !troopFullHealth) );
                    // If the action gives a condition to Self that the Troop already has (Bonus Action being the obvious example)
                    let avoidConditionDuplicate =  (action.target != "Self" || !action.condition || (action.target == "Self" && !troop.hasCondition("name", action.condition.name)) )
    
                    // If the action targets an ally/enemy and we have one of those in sight.
                    let targetsAlly = action.target == "Ally";
                    let targetsEnemy = action.target == "Enemy" || action.target == "Point";
                    let actionIsHeal = action.damage && action.damage[0] == "-";
                    let actionHasVisibleTarget = action.target == "Self" || (canSeeAlly && targetsAlly) || (canSeeEnemy && targetsEnemy);
                    let canRevive = (!action.targetsUnconcious || canSeeUnconcious && action.targetsUnconcious) 
                    let canHeal = (!action.damage || !actionIsHeal || actionIsHeal && canSeeInjured)
                    let notEliminated = !action.priority || !action.priority == 0;
    
                    if(actionNotUsed && actionHasUses && actionHasPool && actionPoolRecharge && notEliminated && actionCost && actionHasVisibleTarget && avoidHealingWaste && canHeal && canRevive && avoidConditionDuplicate ) 
                    {
                        log += ` ${action.name} `
                        AI.setActionPriority(action);
                        aiData.actions.push(action);
                    }
                }
                console.log(`${log}) this turn.`)
            }
            else
            {
                // SPECIAL CASE : Make sure the troop ends its turn when it can't play anymore.
                console.log(`Troop cannot take any actions on this turn anymore.`);
                if(!troopCanPlay)
                    console.log(`Reason : Troop has used up all its actions.`)
                if((!canSeeEnemy && !canSeeUnconcious && !canSeeInjured) )
                    console.log(`Reason : Troop can't see another troop`)
                
                aiData.doneThinking = true;
                aiData.decision = "End Turn";
            }
        }
    }

    /** When we grab the available actions, we make sure the AI has some sense of priority to them. 
     * This is not done if the Troops have pre-made priorities to its Actions */
    static setActionPriority(action)
    {
        // Ok. I lied. We don't "just Dash"
        if(action.name == "Dash")
            action.priority = -1;

        if(!action.priority)
        {
            action.priority = 0;

            if(action.target == "Ally")
                action.priority += 1;
            
            if(action.target == "Self")
                action.priority += 1;
        
            if(action.target == "Ally" && action.damage && action.damage[0] == "-")
                action.priority += 15;
                
            if(action.target == "Ally" && action.targetsUnconcious)
                action.priority += 30;

            if(action.target == "Enemy")
                action.priority += 5;

            if(action.target == "Enemy" && action.reach > 300)
                action.priority += 10;
        }
    }

    /** After the AI has started, it starts "thinking". 
     * Right now, it starts computing the paths towards any interesting Troop for a couple seconds. 
     * It most likely will finish them all, then moves the AI state towards "makeDecision()" */
    static think()
    {
        if(!aiData.doneThinking && aiData.thinkingTime < 1800)
        {
            if(AI.computeInterestingPaths())
            {
                aiData.fakeThinking = 0;
                AI.attemptAction()
            }
            else
            {
                AI.displayCurrentAStar();
            }
            aiData.thinkingTime++;
        }
        else
        {

            aiData.doneThinking = true;
        }
    }

    static attemptAction()
    {
        let reach = aiData.pickedAction.reach + aiData.troop.dimension.x;

        let minDist = 900000;
        let index = 0;
        
        // Get shortest path
        for(let p = 0; p < aiData.paths.length; p++)
        {
            let path = aiData.paths[p];
            let target = path.target;
            let move = path.move;
            let targetPos = createVector(target.position.x, target.position.y);
            let currentPos = createVector(aiData.troop.position.x, aiData.troop.position.y);
            let tD = floor(targetPos.dist(currentPos));
            if(tD < minDist)
            {
                minDist = tD;
                index = p;
            }
        }
        console.log(`Picked ${aiData.paths[index].target.name} as Target.`)

        let pickedTarget = aiData.paths[index];
        reach += pickedTarget.target.dimension.x;
        let pos = createVector(pickedTarget.move[0].x, pickedTarget.move[0].y);
        let end = createVector(pickedTarget.move[pickedTarget.move.length-1].x, pickedTarget.move[pickedTarget.move.length-1].y);
        let t = createVector(pickedTarget.target.position.x, pickedTarget.target.position.y);

        if(floor(pos.dist(t)) < reach)
        {
            console.log(`${aiData.pickedAction.name} can reach ${aiData.paths[index].target.name}.`)
            aiData.decision = "Use";
            aiData.pickedTarget = pickedTarget.target;
        }
        else if(floor(end.dist(t)) < reach)
        {
            console.log(` ${aiData.troop.name} moves towards ${aiData.paths[index].target.name} to reach for ${aiData.pickedAction.name}.`)
            aiData.decision = "Move and Use";
            aiData.pickedTarget = pickedTarget.target;
            aiData.pickedDestination = createVector(end.x, end.y);
        }
        else
        {
            console.log(` ${aiData.troop.name} dashes towards ${aiData.paths[index].target.name} to reach for ${aiData.pickedAction.name}.`)

            let dashAct = aiData.troop.hasAction("name", "Dash")
            if(dashAct)
            {
                let dashed = AI.limitPathToMovement(pickedTarget.path, true);
                let endPos = createVector(dashed[dashed.length-1].x, dashed[dashed.length-1].y )
                aiData.pickedAction = dashAct;
                aiData.pickedTarget = aiData.troop;
                aiData.pickedDestination = createVector(endPos.x, endPos.y);
                aiData.decision = "Move and Use";
            }
        }
    }

    static pickTarget()
    {
        switch (aiData.pickedAction.target)
        {
            case "Self" :
                aiData.pickedTarget = aiData.troop;
                aiData.decision = "Use";
                console.log(`${aiData.pickedAction.name} targets Self, we can use it.`)
                break;
            
            case "Ally" : 
                if(aiData.pickedAction.targetsUnconcious)
                {
                    aiData.interestingTroops = aiData.unconciousAllies;
                    console.log(`${aiData.pickedAction.name} targets an Unconcious Ally. Picking target within visible ones.`)
                }
                else if(aiData.pickedAction.damage && aiData.pickedAction.damage[0] == "-")
                {
                    aiData.interestingTroops = aiData.injuredAllies;
                    console.log(`${aiData.pickedAction.name} targets an Injured Ally. Picking target within visible ones.`)
                }
                else
                {
                    aiData.interestingTroops = aiData.visibleAllies;
                    console.log(`${aiData.pickedAction.name} targets an Ally. Picking target within visible ones.`)
                }
                break;
            
            case "Enemy" || "Point" :
                aiData.interestingTroops = aiData.visibleEnemies;
                console.log(`${aiData.pickedAction.name} targets an Enemy. Picking target within visible ones.`)
                break;
        }
    }

    /** Grab path towards every troop that is part of an "Interesting" array. 
     * Return true when we are finished doing everything, otherwise return true. */
    static computeInterestingPaths()
    {
        if(aiData.paths.length < aiData.interestingTroops.length && aiData.paths.length < 5)
        {
            let i = aiData.paths.length; // Current index we don't have.
            let p = AI.getPathBetween(aiData.troop.position, aiData.interestingTroops[i]); // Computes part of the path, returning it when done.
            if(p)
            {
                aiData.paths[i] = p;
            }
        }
        else
        {
            return true;
        }
        return false;
    }

    /** Builds into aiData.currentAStar a few times per frame, working towards a path between Position and Target
     *  Returns undefined until aiData.currentAStar.path is done computing */
    static getPathBetween(position, target)
    {
        let iterations = 10;

        let aStar;
        if(aiData.currentAStar === undefined)
        {
            aiData.currentAStar = {};
            aiData.currentAStar.goal = new Spot(target.position);
            aiData.currentAStar.open = [ new Spot(position)];
            aiData.currentAStar.closed = [];
            aiData.currentAStar.path = [];
            aiData.currentAStar.stop = false;
            aiData.currentAStar.startTime = Date.now();
            aiData.currentAStar.stepSize = floor(aiData.troop.dimension.x)
        }
        aStar = aiData.currentAStar;
        let stepSize = aStar.stepSize;
        if(stepSize < dist(aStar.goal.x, aStar.goal.y, position.x, position.y) / 25)
        {
            stepSize = floor(dist(aStar.goal.x, aStar.goal.y, position.x, position.y) / 25);
        }

        // Returns the index of the smallest F value in aStar.open
        const getSmallestF = () =>{let ret = 0; for(let i = 0; i < aStar.open.length; i++) { if(aStar.open[i].f < aStar.open[ret].f) { ret = i;}} return ret; }
        // Returns whether of not the spot is within aStar.closed => Jee I need a new DataStructure.
        const hasBeenClosed = (spot) =>{for(let i = 0; i < aStar.closed.length; i++){if(aStar.closed[i].x == spot.x && aStar.closed[i].y == spot.y){return true;}}return false;}
        // Returnw whether or not that spot is in the open set
        const hasBeenSeen = (spot) =>{for(let i = 0; i < aStar.open.length; i++){if(aStar.open[i].x == spot.x && aStar.open[i].y == spot.y){return true;}}return false;}
        
        for(let i = 0; i < iterations; i++)
        {
            if(aStar.open.length > 0 && !aStar.stop)
            {
                let winner = getSmallestF(); // Pick smallest F value from Open array (index)
                let current = aStar.open[winner];  // (actual object)
                aStar.current = current;
    
                // If current is close enough to Goal, stop.
                if(dist(current.x, current.y, aStar.goal.x, aStar.goal.y) <= stepSize + target.dimension.x + 140  ) 
                {
                    aStar.stop = true;
                    aStar.path  = [];
                    let temp = current;
                    aStar.path.push(temp);
                    while(temp.parent)
                    {
                        aStar.path.unshift(temp.parent);
                        temp = temp.parent;
                    }
                }
    
                // If not, then switch current from Open to Closed
                aStar.open.splice(winner, 1);
                aStar.closed.push(current);
    
                // For each of the neighboring walkable spots (I call all the neighbors Neil)
                let potential = current.getNeighbors(stepSize, aiData.troop);
                for(let i = 0; i < potential.length; i++)
                {
                    let neil = potential[i];
                    if(!hasBeenClosed(neil)) // Check G score
                    {
                        let open = hasBeenSeen(neil);
                        let tG = floor(current.g + dist(neil.x, neil.y, current.x, current.y)); // Temporary G value
                        if(open && tG < neil.g )
                        {
                            neil.g = tG;
                        }
                        else if(!open)
                        { 
                            neil.g = tG;
                            aStar.open.push(neil)
                        }
                    }
                    // Reset the values of neighbor
                    neil.h = dist(neil.x, neil.y, aStar.goal.x, aStar.goal.y);
                    if(insersectsWithDifficultTerrain(neil))
                    {
                        neil.h *= 1.2;
                    }
                    let p = {position : {x: neil.x, y: neil.y},dimension : aiData.troop.dimension}
                    if(intersectsWithTroop(p,aiData.enemies) || intersectsWithTroop(p,aiData.allies))
                    {
                        neil.h *= 5;
                    }
                    neil.f = floor(neil.g + neil.h);
                    neil.parent = current;
                }
            }
            else
            {
                let p = clone(aStar.path);
                aiData.currentAStar = undefined;
                console.log(`Took ${(Date.now() - aStar.startTime) / 1000} seconds to compute path to ${target.name}.`);
                let p2 = AI.limitPathToMovement(p);
                let t = target;
                return {path : p, move : p2, target : t};
            }
        }
    }

    /** Returns a copy of the path that is cut before we move more than the Troop's movement */
    static limitPathToMovement(pathO, dashed)
    {
        let path = clone(pathO)
        let pathLength = 0; 
        for(let x = 0; x < path.length-1; x++)
        {
            let p1 = path[x];
            let p2 = path[x + 1];
            pathLength += floor(dist(p1.x, p1.y, p2.x,p2.y));
            if(pathLength > aiData.troop.movement && !dashed)
            {
                pathLength -= floor(dist(p1.x, p1.y, p2.x,p2.y));
                path.splice(x);
            }
            else if(pathLength > aiData.troop.movement * 2 && dashed)
            {
                pathLength -= floor(dist(p1.x, p1.y, p2.x,p2.y));
                path.splice(x);
            }
        }
        return path;
    }

    /** Basic way to grab randomly from a priority list
     *  Add each element to the Pool a number of times equal to priority, then pick a random index in the list to return. */
    static getRandomAction()
    {
        let pool = [];
        let log = `Creating action pool : `
        for(let i = 0; i < aiData.actions.length; i++ )
        {
            let a = aiData.actions[i];
            if(a.priority === undefined)
            {
                a.priority = 1;
            }
            log += ` ${a.name} (${a.priority}) `
            for(let x = 0; x < a.priority; x++)
            {
                pool.push(a);
            }
        }
        log += ` up for selection.`;
        console.log(log);

        let a = selectRandom(1, pool)[0]
        console.log(`Picked ${a.name}.`)
        return a
    }

    /** Displays the possible paths for the pickedAction  */
    static displayPathsToTroops()
    {
        stroke(20,155,20); strokeWeight(8);

        for(let i = 0; i < aiData.paths.length; i++)
        {
            let path = aiData.paths[i];

            for(let j = 1; j < path.length;j++ )
            {
                let p1 = camera.mapPointToScreenPoint(path[j].x, path[j].y);
                let p2 = camera.mapPointToScreenPoint(path[j-1].x, path[j-1].y);
                line(p1.x, p1.y, p2.x, p2.y);
            }
        }
    }

    /** Displays the state of the current A* algorithm - Insanely expansive */
    static displayCurrentAStar()
    {
        if(aiData.currentAStar)
        {
            fill (30,170,30, 40);
            for(let i =0; i < aiData.currentAStar.open.length; i ++)
            {
                let p = camera.mapPointToScreenPoint(aiData.currentAStar.open[i].x,aiData.currentAStar.open[i].y )
                let dim = camera.mapDimensionsToScreen( aiData.currentAStar.stepSize,  aiData.currentAStar.stepSize)
                ellipse(p.x, p.y, dim.x / 2, dim.y / 2);
            }
            fill (170,30,30, 40);
            for(let i =0; i < aiData.currentAStar.closed.length; i ++)
            {
                let p = camera.mapPointToScreenPoint(aiData.currentAStar.closed[i].x,aiData.currentAStar.closed[i].y )
                let dim = camera.mapDimensionsToScreen( aiData.currentAStar.stepSize,  aiData.currentAStar.stepSize)
                ellipse(p.x, p.y, dim.x / 2, dim.y / 2);
            }
            
            stroke (170,170,170, 10);
            strokeWeight(4);
            let temp = aiData.currentAStar.current;
            aiData.currentAStar.path.push(temp);
            while(temp.parent)
            {
                aiData.currentAStar.path.push(temp.parent);
                temp = temp.parent;
            }
            for(let p = 1; p < aiData.currentAStar.path.length; p ++)
            {
                let p1 = camera.mapPointToScreenPoint(aiData.currentAStar.path[p].x, aiData.currentAStar.path[p].y);
                let p2 = camera.mapPointToScreenPoint(aiData.currentAStar.path[p-1].x, aiData.currentAStar.path[p-1].y);
                line(p1.x, p1.y, p2.x, p2.y);
            }
        }
    }
}


class Spot 
{
    constructor(args)
    {
        this.x  = args.x;
        this.y  = args.y;
        this.f  = 0;
        this.g  = 0;
        this.h  = 0;
    }
    getNeighbors(stepSize, troop)
    {
        let ret = [];
        for(let x = -1; x <= 1; x++)
        {
            for(let y = -1; y <= 1; y++)
            {
                if(x != 0 || y != 0)
                {
                    let oX = x * stepSize;
                    let oY = y * stepSize;
                    let vec = createVector(this.x + oX, this.y + oY);

                    let t;
                    if(!troop)
                    {
                        t = { position : vec };
                    }
                    else
                    {
                        t = {position : vec, dimension : troop.dimension};
                    }
                    
                    if( !intersectsWithObstacle(t) )
                    {
                        ret.push(new Spot(vec));
                    }
                }
            }
        }
        return ret;
    }
  }
