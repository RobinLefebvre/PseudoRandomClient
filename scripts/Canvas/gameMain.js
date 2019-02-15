// Global stuff.
let canvas;
let camera;
let game = {initiativeOrder: []};
let playerName = "---";
let actionInput;
let measureStart;
let focussedTroop;
let GMMode = false;
let hoverDash;

/** Setup is called once on document load*/
function setup()
{
    canvas = createCanvas(window.innerWidth,window.innerHeight);
    camera = new Camera();
    frameRate(48);
    windowResized = () => {resizeCanvas(windowWidth, windowHeight); camera.setScreenSize(); camera.setScreenCenterPoint();}
    mouseWheel = (event) => {if(eventManagement.restrictToCanvas(event)){event.preventDefault(); camera.zoom(event);}}
    writeEncounterSelect();
}
/** After setup, draw is called at 48 fps */
function draw()
{
    // Redraw background
    background(50,50,50);

    // Cancel the display of an action
    if(keyIsDown(ESCAPE))
        actionInput = undefined;
    
    // Display the Game
    if(game.state)
    {
        camera.displayGame(game); // Will display every troop and area in the game object
        // I realize there is only one state here. But AI thinking and Animation display will come here.
        switch(game.state)
        {
            case "Game":
                let currentTroop = game.initiativeOrder[game.currentIndex];
                // If we are allowed to play the troop
                if(playerName == currentTroop.isPlayer)
                {
                    // If we don't have an action selected
                    if(actionInput == undefined)
                    {
                        if(hoverDash) // Dash has a special hovering display
                        {
                            let t = {};
                            t.position = currentTroop.position;
                            t.movement = currentTroop.movement + currentTroop.speed;
                            t.dimension = currentTroop.dimension;
                            t.stk = currentTroop.stk;
                            camera.displayMovement(t)
                        }
                        camera.displayMovement(currentTroop, game.initiativeOrder, game.areas); // Display Movement of the troop
                    }
                    // We did select an action in the Troop menu
                    else
                    {
                        let act = game.initiativeOrder[game.currentIndex].actions[actionInput];
                        camera.displayAction(currentTroop, act, game.initiativeOrder);
                    }
                }
                break;
        }
    }

    
    // ALT button pressed => Display Tactical overlay - Could use some improvement / rework.
    if(keyIsDown(ALT))
    {
        camera.displayTacticalOverlay();
    }

    // CTRL button pressed => Display measurement between a point and your mouse position
    if(measureStart)
    {
        let measureUnit = {value : 100, name: "m"};
        if(camera.displayedClicks > 1000000)
        {
            measureUnit = {value : 100000, name: "km"}
        }
        camera.displayMeasure(measureStart,measureUnit);
    }
    if(!keyIsDown(CONTROL)) // Stop drawing the measurement if we released CTRL
    {
        measureStart = undefined;
    }

    // If we are hovering on the Turn Order HTML element => Focus on troop
    if(focussedTroop)
    {
        camera.displayFocus(focussedTroop, true);
    }
    // If we hover over a troop in the game => Focus on troop
    if(camera.getEntity({x: mouseX, y:mouseY}, game.initiativeOrder))
    {
        camera.displayFocus(camera.getEntity({x: mouseX, y:mouseY}, game.initiativeOrder), true)
    }
}
// Called if a troop ends its turn (there's a HTML button for that)
function nextTurn()
{
    if(game.currentIndex >= game.initiativeOrder.length - 1)
    {
        game.currentIndex = -1;
        logs(`Starting new Round. `)
    }
    game.currentIndex ++;
    game.initiativeOrder[game.currentIndex].startTurn(game.areas);
    actionInput = undefined;
    camera.anchor = game.initiativeOrder[game.currentIndex];

    if(GMMode)
        playerName = game.initiativeOrder[game.currentIndex].isPlayer;

    writeGameOrder();
    writeTroop(game.initiativeOrder[game.currentIndex]);
}
// Functions pushing the message onto the Game's gamelog.
function logs(message, flag)
{
    if(!game.gameLog)
        game.gameLog = [];
    if(!flag)
    {
        game.gameLog.push(message);
        writeGameLogs();
    }
}

// Using mouse drag to move with right click.
function mouseDragged(event)
{
    if(eventManagement.restrictToCanvas(event)) 
    {
        event.preventDefault();
        if(event.buttons == 2)
        {
            let speed = round(camera.clicksPerPixel * 0.7) + 1;
            camera.mapPosition.x -= event.movementX * speed;
            camera.mapPosition.y -= event.movementY * speed;
            camera.anchor = undefined;
        }
    }
}

// Clicking. Yeah... I know. It's scary. But let's go through it together.
function mousePressed(event) 
{
    if(eventManagement.restrictToCanvas(event))
    {
        event.preventDefault(); 
        // If CTRL is down, then we start measuring distances
        if(keyIsDown(CONTROL))
        {
            measureStart = camera.screenPointToMapPoint(mouseX, mouseY);
        }
        // If we Left Click during the game AND it's our turn, we Good.
        else if(event.buttons == 1 && game.state == "Game" && playerName == game.initiativeOrder[game.currentIndex].isPlayer)
        {
            let troop = game.initiativeOrder[game.currentIndex];
            let mouseMap = camera.screenPointToMapPoint(mouseX, mouseY);
            mouseMap = createVector(mouseMap.x, mouseMap.y);

            // Activate Movement => Check if we collide with an obstacle => Should be reworked so that we can't go through an obstacles *as easily*
            if(actionInput == undefined)
            {
                let troopDistance = floor(mouseMap.copy().dist( createVector(troop.position.x, troop.position.y) ));
                let intersecting = troop.intersects(mouseMap, game.initiativeOrder, game.areas);
                if(!intersecting && troopDistance < troop.movement)
                {
                    troop.move(mouseMap);
                }
            } 
            // Use the selected action (if we have some left)
            else if(troop.actionsTaken < troop.actionsPerTurn)
            {
                // Get the action from the index
                let act = game.initiativeOrder[game.currentIndex].actions[actionInput];

                // Get the targets for tha action at the position of the click (should be reworked to take in the Mouse Position)
                let targets = getAffectedTroops(troop, act, game.initiativeOrder);
                if(targets.length > 0)
                {
                    // We have an array of targets. If there are more than 1 then roll for shared damage.
                    let damage;
                    if(targets.length > 1 && troop.actions[actionInput].damage !== "0")
                    {
                        damage = troop.rollDamage(troop.actions[actionInput]);
                    }

                    targets.forEach(id =>
                    {
                        troop.useAction(actionInput, game.initiativeOrder[id], damage);
                    });
                    // If action has limited uses and doesn't need to hit for reducing => Reduce the uses
                    if( !troop.actions[actionInput].onSuccess)
                    {
                        if(troop.actions[actionInput].uses !== -1)
                            troop.actions[actionInput].uses -= 1;
                        if(troop.actions[actionInput].pool && troop.actions[actionInput].expandsPool)
                            troop.pools[troop.actions[actionInput].pool] -= 1;
                    }
                    
                    troop.actionsTaken ++;
                    troop.actions[actionInput].hasBeenUsed = true;

                    // Update the DOM, see the <script> element in game.html.
                    writeGameOrder();
                    writeTroop(game.initiativeOrder[game.currentIndex]);
                    actionInput = undefined;
                }
            }
        }
    }
}

/** Returns the Array of troops that are targeted by an action at a given time. This should be like the Camera's work... I guess. */
function getAffectedTroops(troop, action, otherTroops, flag)
{
    let ret = [];
    if(!flag)
    {
        let mouseMapPos = camera.screenPointToMapPoint(mouseX, mouseY);
        mouseMapPos = createVector(mouseMapPos.x, mouseMapPos.y);
        
        let d = mouseMapPos.dist(createVector(troop.position.x, troop.position.y))
        // The mouse is hovering within Action's reach
        if(d < action.reach + troop.dimension.x )
        {
            for(let i = 0; i < otherTroops.length; i++) 
            {
                let t = otherTroops[i];
                let d = mouseMapPos.dist(createVector(t.position.x, t.position.y));
                // If the troop is within the area of effect
                if(d < action.areaEffect + t.dimension.x)
                {
                    let isAffected = true;
                    switch(action.target)
                    {
                        case "Enemy" :
                            isAffected = (t.isPlayer != troop.isPlayer);
                            break;

                        case "Ally" :
                            isAffected = (t.isPlayer == troop.isPlayer);
                            break;

                        case "Self" :
                            isAffected = (t.position.x == troop.position.x && t.position.y == troop.position.y)
                    }
                    if(t.hasCondition("name", "Unconcious") && action.target !== "Ally" && !action.targetsUnconcious )
                    {
                        isAffected = false;
                    }
                    if(isAffected)
                    {
                        ret.push(i);
                    }
                }
            }
        }
    }
    else
    {
        let v = createVector(troop.position.x, troop.position.y);
        for(let i = 0; i < otherTroops.length; i++) 
        {
            let t = otherTroops[i];
            let d = v.dist(createVector(t.position.x, t.position.y));
            // If the troop is within the area of effect
            if(d < action.areaEffect + t.dimension.x)
            {
                let isAffected = true;
                switch(action.target)
                {
                    case "Enemy" :
                        isAffected = (t.isPlayer != troop.isPlayer);
                        break;

                    case "Ally" :
                        isAffected = (t.isPlayer == troop.isPlayer);
                        break;

                    case "Self" :
                        isAffected = (t.position.x == troop.position.x && t.position.y == troop.position.y)
                }

                if(isAffected)
                {
                    ret.push(i);
                }
            }
        }
    }  
    return ret;
}
// Sets the current player according to the <select> html element in the page.
function switchPlayer(name)
{
    if(name == "GM")
    {
        playerName = game.initiativeOrder[game.currentIndex].isPlayer;
        GMMode = true;
    }
    else
    {
        playerName = name;
        GMMode = false;
    }
    camera.anchor = game.initiativeOrder[game.currentIndex];
    
    // Update the DOM, see the <script> element in game.html.
    writeGameOrder(); 
    writeTroop(game.initiativeOrder[game.currentIndex]);
    toggleTab(`game`, "none");
    toggleTab(`logs`, "block");
    toggleTab(`troop`, "grid");
    toggleTab(`turn`, "block");


}
