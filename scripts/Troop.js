class Troop
{
    /** Constructor for a troop
     * @param {TroopData} args : (OPTIONAL) data from a troop to load (examples : LocalStorage or ServerStorage)  */
    constructor(args)
    {
        this.name = args.name || "Basic Soldier";
        this.htmlName = `<b style="color:rgb(${args.stk.r},${args.stk.g},${args.stk.b});"> ${this.name} </b>`;
        this.isPlayer = args.isPlayer || false;
        this.player = this.isPlayer;

        this.position = args.position;
        let size;
        if(args.size)
            size = createVector(parseInt(args.radius), parseInt(args.radius) );
        if(args.dimension)
            size = createVector(parseInt(args.dimension.x), parseInt(args.dimension.y));
        this.dimension = size || createVector(50,50);
        this.stk = color(args.stk.r, args.stk.g, args.stk.b);

        let stdScore = 
        {
            "Strength" : {score : 14, bonus : 2},
            "Dexterity" : {score : 14, bonus : 2}, 
            "Constitution" : {score : 14, bonus : 2}, 
            "Intelligence" : {score : 10, bonus : 0}, 
            "Wisdom" : {score : 10, bonus : 0}, 
            "Charisma" : {score : 10, bonus : 0}, 
        }
        this.abilityScores = args.abilityScores || stdScore;
       
        this.initiativeBonus = this.abilityScores["Dexterity"].bonus;

        this.hitPoints = args.hitPoints ||  {dieAmount : 1, dieType : 10, bonus : 2}

        this.AC = args.armorClass ||14;
        this.armorClass = this.AC;

        this.resistances = "";
        this.vulnerabilities = "";
        this.immunities = "";

        this.damageBonus = 0;
        this.toHitBonus = 0;

        this.speed =  args.speed || 900;
        this.movement = this.speed;

        this.turnActions = args.actionsPerTurn;
        this.actionsPerTurn = args.actionsPerTurn || 1;

        if(args.actions[0] && args.actions[0].name == "Dash")
            this.actions = args.actions;
        else
        {
            this.actions = [
                {name:"Dash", toHit :"None", saveSkill:"None", damage : "0", target:"Self", reach:10, areaEffect:1, uses : -1, condition : {name:"Dashing", duration:0, moveMod:1, damage:0}},
                {name:"Dodge", toHit :"None", saveSkill:"None", damage : "0", target:"Self", reach:10, areaEffect:1, uses : -1, condition : {name:"Dodging", duration:0, disadvantageTarget:true, damage:"0", skipTurn : false}},
                {name:"Help", toHit :"None", saveSkill:"None", damage : "0", target:"Ally", reach:150, areaEffect:1, uses : -1, condition : {name:"Helped by " + this.name, duration:1, advantageHit:true, damage:"0", skipTurn : false}},
            ];
            args.actions.forEach(a => {this.actions.push(a)})
        }
        this.conditions = args.conditions || [];
        this.pools = args.pools || {};
        this.parse();
    }

    /** Make sure all the data is properly converted from the storage to the instance */
    parse()
    {
        this.dimension.x = parseInt(this.dimension.x);
        this.dimension.y = parseInt(this.dimension.y);

        for(let key in this.abilityScores)
        {
            this.abilityScores[key].score = Number.parseInt(this.abilityScores[key].score);
            this.abilityScores[key].bonus = Number.parseInt(this.abilityScores[key].bonus);
        }
        this.armorClass = Number.parseInt(this.armorClass);
        for(let key in this.hitPoints)
        {
            if(key !== "formula")
            {
                this.hitPoints[key] = Number.parseInt(this.hitPoints[key])
            }
        }
        this.actionsPerTurn = Number.parseInt(this.actionsPerTurn);
        this.turnActions = Number.parseInt(this.turnActions);
        for(let act in this.actions)
        {
            let a = this.actions[act];
            a.areaEffect = Number.parseInt(a.areaEffect);
            a.reach = parseFloat(a.reach);
            a.saveDC = parseInt(a.saveDC);
            a.uses = parseInt(a.uses);
            a.damageExtra = parseInt(a.damageExtra);
            a.toHitExtra = parseInt(a.toHitExtra);
            if(a.condition)
            {
                for(let key in a.condition)
                {
                    if(key == "saveDC" || key == "duration" || key == "damageBonus")
                    {
                        a.condition[key] = Number.parseInt(a.condition[key]);
                    }
                    else
                    {
                        a.condition[key] = a.condition[key];
                    }
                }
            }
        }
    }

    getName()
    {
        let ret = `${this.name} `;
        if(this.hasCondition("name", "Unconcious"))
        {
            ret += `(Unconcious)`;
        }
        else
        {
            ret += `(${this.hitPoints.current} / ${this.hitPoints.maximum})`
        }
        return ret;
    }

    getActionDescription(id)
    {
        let act = this.actions[id];
        let ret = `<h4> ${act.name}</h4>`;

        switch (act.target)
        {
            case "Self":
                ret += `<p> Target yourself.<br/>` 
                break;
            case "Enemy":
                if(act.areaEffect < 10)
                    ret += `<p>Target an Enemy creature within reach (${act.reach / 100} m.)<br/>`
                else
                    ret += `<p>Target Enemy creatures in a ${(act.areaEffect / 100)} m. circle within reach (${act.reach / 100} m.)<br/>`
                break;
            case "Ally":
                if(act.areaEffect < 10)
                    ret += `<p>Target an Ally creature within reach (${act.reach / 100} m.)<br/>`
                else
                    ret += `<p>Target Ally creatures within a ${(act.areaEffect / 100)} m. circle within reach (${act.reach / 100} m.)<br/>`
                break;
            case "Point":
                ret += `<p>Target Any creature within a ${(act.areaEffect / 100)} m. circle within reach (${act.reach / 100} m.)<br/>`
        }
        if(act.toHit !== "None")
        {
            ret += `Roll to hit using your ${act.toHit} bonus `;
            if(act.toHitExtra)
                ret+= `+ ${act.toHitExtra} <br/>`;
            else
                ret+= `<br/>`;
        }
        if(act.saveSkill !== "None")
        {
            ret += `The targets roll a ${act.saveSkill} saving throw with difficulty ${act.saveDC}. Success will decrease damage in half.<br/>` 
        }
        if(act.damage != "0")
        {
            let d = ``;
            if(act.damageAbility != "None")
                d += `+ your ${act.damageAbility} bonus `
            if(act.damageExtra != 0)
                d += `+ ${act.damageExtra} `;

            if(act.damage[0] == "-")
                ret += `The target regains ${act.damage} ${d} hit points. <br/>`;
            else
                ret += `The target looses ${act.damage} ${d} hit points from ${act.damageType} damage. <br/> `
        }
        if(act.uses !== -1)
        {
            ret += `You can use this action ${act.uses} time(s) per combat.<br/>`;
        }
        if(act.pool)
        {
            ret += `You must use one of your ${act.pool}. You have ${this.pools[act.pool]} left.<br/>`
        }
        if(act.condition && act.condition !== "None")
        {
            ret += `This Action gives the condition ${act.condition.name}.`
            if(act.condition.save && act.condition.save !== "None")
                ret += ` (${act.condition.save} Save - DC ${act.condition.saveDC})`;
        }
        return ret;
    }

    /** Roll dem dices to setup this.initiative and this.hitPoints for a game*/
    setup()
    {
        this.initiative = floor(random() * 20) + 1;
        this.initiative += Number.parseInt(this.initiativeBonus);
        //logs(`Initiative : 1d20 + ${Number.parseInt(this.initiativeBonus)} = ${this.initiative}`);

        this.hitPoints.maximum = 0;
        for(var i = 0; i < this.hitPoints.dieAmount; i++)
        {
            let roll = floor(random() * parseInt(this.hitPoints.dieType) ) + 1;
            this.hitPoints.maximum += roll;
        }
        if(this.hitPoints.bonus)
        {
            this.hitPoints.maximum += parseInt(this.hitPoints.bonus);
        }

        this.hitPoints.current = this.hitPoints.maximum;
        //logs(`HP : ${this.hitPoints.dieAmount}d${this.hitPoints.dieType} + ${this.hitPoints.bonus} = ${this.hitPoints.maximum}`);


        this.hasTakenAction = 0;
        this.movement = this.speed;

        this.applyConditions();
    }

    /** Starts a fresh turn for the Troop. Resets movement and applies conditions.  */
    startTurn(areas)
    {
        this.hasTakenAction = 0;
        this.movement = this.speed;
        this.armorClass = this.AC;
        this.resistances = "";
        this.vulnerabilities = "";
        this.immunities = "";
        this.damageBonus = 0;
        this.toHitBonus = 0;
        this.actionsPerTurn = this.turnActions;
        this.isPlayer = this.player;

        this.resetConditions();
        this.applyConditions(areas);
    }

    // Applies every condition on start of the turn.
    applyConditions(areas)
    {
        if(this.hasCondition("name","Unconcious"))
        {
            nextTurn();
        }
        else
        {
            if(areas)
            {
                logs(`${this.htmlName} starts its turn.`);        

                areas.forEach(a => 
                {
                    if(a.conditions && intersects(this.position, a.shape))
                    {
                        a.conditions.forEach(c => this.conditions.push(c));
                    }
                })
            }

            let skipTurnFlag = false;
            this.conditions.forEach(c =>
            {
                if(c.name !== "Unconcious")
                {
                    if(this.applyCondition(c))
                    {
                        skipTurnFlag=true;
                    }
                }
            })
            if(skipTurnFlag)
            {
                nextTurn();
            }
        }
    }

    /** Applies a given condition (when received from an action and when starting the turn) */
    applyCondition(c)
    {
        if(c.duration !== -1 && c.duration !== 0)
        {
            c.duration--;
            logs(`${c.name} remaining turns : ${c.duration}.`)
        }
        if(c.save)
        {
            let save = {saveSkill : c.save, saveDC : c.saveDC};
            save = this.rollSave(save);
            if(save)
            {
                logs(`${this.htmlName} is no longer ${c.name}.`);
                c.duration = 0;
                return false;
            }
        }
        if(c.damage && Number.parseInt(c.damage) != 0)
        {
            let damage = {name: c.name, damage : c.damage, damageAbility : "None", damageExtra : 0};
            damage = this.rollDamage(damage);
            if(damage)
            {
                if(c.areaEffect)
                {
                    let targets = getAffectedTroops(this, {target:"Enemy", areaEffect : Number.parseInt(c.areaEffect) }, game.initiativeOrder, true);
                    targets.forEach(t => 
                    {
                        game.initiativeOrder[t].hitPoints.current -= damage;
                        game.initiativeOrder[t].checkHitPoints();
                        logs(`${game.initiativeOrder[t].htmlName} looses ${damage} hit points from being in ${this.htmlName}'s ${c.name} area.`)
                    })
                }
                else
                {
                    this.hitPoints.current -= damage;
                    this.checkHitPoints();
                    if(damage > 0)
                    {
                        logs(`${this.htmlName} looses ${damage} hit points for being ${c.name}.`)
                    }
                    else
                    {
                        logs(`${this.htmlName} regains ${-damage} hit points for being ${c.name}.`)
                    }
                }
            }
        }
        if(c.moveMod)
        {
            this.movement += this.speed * Number.parseFloat(c.moveMod);
            logs(`${this.htmlName} is ${c.name}, movement becomes ${this.movement} for the turn.`);
        }
        if(c.resistances)
        {
            logs(`${this.htmlName} is resistant to ${c.resistances} damage type(s).`);
            this.resistances += c.resistances; 
        }
        if(c.vulnerabilities)
        {
            logs(`${this.htmlName} is vulnerable to ${c.vulnerabilities} damage type(s).`);
            this.vulnerabilities += c.vulnerabilities;
        }
        if(c.immunities)
        {
            logs(`${this.htmlName} is immune to ${c.immunities} damage type(s).`);
            this.immunities += c.immunities;
        }
        if(c.skipTurn)
        {
            logs(`${this.htmlName} is not able to act this turn for being ${c.name}.`);
            return true;
        }
        if(c.addAction)
        {
            logs(`${this.htmlName} can take ${this.actionsPerTurn + c.addAction} actions this turn.`);
            this.actionsPerTurn += Number.parseInt(c.addAction);
        }
        if(c.acBonus)
        {
            logs(`${this.htmlName} has an Armor Class of ${this.armorClass + c.acBonus} this turn.`);
            this.armorClass += Number.parseInt(c.acBonus)
        }
        if(c.damageBonus)
        {
            this.damageBonus += Number.parseInt(c.damageBonus);
        }
        if(c.advantageHit)
        {
            logs(`${this.htmlName} has advantage on attack rolls for the turn.`);
        }
        if(c.advantageTarget)
        {
            logs(`Attack rolls targeting ${this.htmlName} have advantage for the turn.`);
        }
        if(c.disadvantageHit)
        {
            logs(`${this.htmlName} has disadvantage on attack rolls for the turn.`);
        }
        if(c.disadvantageTarget)
        {
            logs(`Attack rolls targeting ${this.htmlName} have disadvantage for the turn.`);
        }
        if(c.charm)
        {
            logs(`${this.htmlName} is ${c.name} and joins ${c.charm}`);
            this.isPlayer = c.charm;
        }
        if(c.recharge)
        {
            let r = c.recharge.split(", ");
            this.pools[r[0]] += Number.parseInt(r[1]);
        }
        return false;
    }

    /** Resets conditions for the turn by removing used up ones and checking Areas */
    resetConditions()
    {
        // Elliminating conditions that are over
        for (let i = 0; i < this.conditions.length;i++)
        {
            let c = this.conditions[i];
            if(c.duration == 0)
            {
                logs(`${this.name} is no longer ${c.name}.`)
                this.conditions.splice(i,1);
                i--;
            }
        }
        // TODO Picking up conditions from an area
    }

    /** Check hitPoints for death or resurekt */
    checkHitPoints()
    {
        this.hasCondition("name","Unconcious", true); // Remove the Unconcious condition


        if(this.hitPoints.current > this.hitPoints.maximum)
        {
            this.hitPoints.current = this.hitPoints.maximum
        }
        if(this.hitPoints.current <= 0)
        {
            this.hitPoints.current = 0;
            this.conditions.push({name: "Unconcious"}) // Put the Unconcious condition back
        }
    }

    /** Tells if the Troop is suffering from a specific condition
     * @param {String} filter : checks for condition[filter]
     * @param {String} value : checks condition[filter] == value
     * @param {String} removeFlag : splices the condition if needed
     * @returns {Boolean} has the troop got the condition ?*/
    hasCondition(filter, value, removeFlag)
    {
        let flag = false;
        for(let i = 0; i < this.conditions.length; i ++)
        {
            let c = this.conditions[i]

            if (c[filter]== value)
            {
                flag = true;
                if(removeFlag)
                {
                    this.conditions.splice(i, 1);
                }
            }
        
        }
        return flag;
    }
    
    /** Tells if the Troop has resistance or vulnerability to a damage type
     * @param {String} name : the damage type to check
     * @param {String} type : a flag to output vulnerability or immunity instead
     * @returns {Boolean} has the troop got the resist ?*/
    hasResist(name, type)
    {
        if(!name || name == "")
            return false;

        let ret = false;
        if(type == "vulnerability")
        {
            this.vulnerabilities.split(", ").forEach(v =>
            {
                if(v == name)
                    ret= true;
            })
        }
        else if(type == "immunity")
        {
            this.immunities.split(", ").forEach(v =>
            {
                if(v == name)
                    ret= true;
            })
        }
        else
        {
            this.resistances.split(", ").forEach(v =>
            {
                if(v == name)
                    ret= true;
            })
        }
        return ret;
    }

    /** Allows to know whether a troop is allowed to move at the given position on the map */
    intersects(position, otherTroops, areas)
    {
        // Intersecting
        let flag = false;
        if(otherTroops)
        {
            otherTroops.forEach(oT =>
            {
                if(!(oT.position.x == this.position.x) || !(oT.position.y == this.position.y))
                {
                    if(position.copy().dist(createVector(oT.position.x, oT.position.y)) < oT.dimension.x + this.dimension.x)
                    {
                        flag = true;
                    }
                }
            });
        }
        if(areas)
        {
            areas.forEach(area =>
            {
                let temp = clone(area.shape);
                temp.push(area.shape[0]);
                if(area.isObstacle)
                {
                    for(let i = 0; i < TWO_PI; i += TWO_PI / 12)
                    {
                        let v = 
                        {
                            x :  Math.floor( position.x + (this.dimension.x   * sin(i)) ),
                            y:   Math.floor( position.y + (this.dimension.y  * cos(i)) )
                        }
                        if(intersects(createVector(v.x, v.y), temp))
                        {
                            flag = true;   
                        }
                    }
                }
            })
        }
        return flag;
    }

    /** Changes troop position to the given position on the map */
    move(position)
    {
        let distance = floor(position.copy().dist( createVector(this.position.x, this.position.y) ));

        this.position.x = position.x;
        this.position.y = position.y;
        this.movement -= distance;
        logs(`${this.htmlName} moves to (${this.position.x}, ${this.position.y}). <br/> ${this.movement} clicks left of movement.`)
    }

    /** use Action onto a target
     * @param {Integer} actionIndex : the index of the action in this.actions
     * @param {Troop} target : the recipient of the action */
    useAction(actionIndex, target)
    {
        let action = this.actions[actionIndex] 
        if(action.uses != 0 )
        {
            if(action.target !== "Self" || target.name !== this.name) 
                logs(`${this.htmlName} uses ${action.name} on ${target.htmlName}.`);
            else
                logs(`${this.htmlName} uses ${action.name}`);

            
            let toHit = this.rollToHit(action, target);
            let save = target.rollSave(action);
            // Automatic success actions => Example Healing Word {toHit : "None", saveSkill : "None"}
            if(toHit === undefined && save === undefined)
            {
                if(action.damage == "0") {}
                else
                {
                    let d = this.rollDamage(action)
                    target.hitPoints.current -= d;
                    logs(`${target.name} regains ${-d} hit points.`);
                }
            }
            else
            {
                let d;
                // Automatic success actions with saveDC to reduce Damage => Example Fireball {toHit : "None", saveSkill : "Dexterity"}
                if(save !== undefined && toHit === undefined)
                {
                    d = this.rollDamage(action);
                    if(save === true)
                    {
                        d = floor(d * 0.5);
                    }
                }
                // Melee / Ranged , Spell/Weapon Attacks => Example Longsword {toHit : "Strength", saveSkill: "None"}
                else if(toHit !== undefined && save === undefined)
                {
                    if(toHit === true)
                    {
                        d = this.rollDamage(action);
                    }
                }
                // Roll to Hit action + saveDC to reduce Damage => Example Rogue Sneak Attack for some reason.
                else
                {
                    d = this.rollDamage(action);
                    if(save === true)
                    {
                        d = floor(d * 0.5);
                    }
                }
                // We hit the target, apply damage
                if(toHit !== false && d)
                {
                    if(action.onSuccess)
                    {
                        if(action.uses != -1)
                            this.actions[actionIndex].uses --;
                        if(action.pool && this.pools[action.pool] !== -1)
                            this.pools[action.pool] --;
                    }
                    if(target.hasResist(action.damageType)) // Resist
                    {
                        d = floor(d/2);
                        logs(`${target.htmlName} has resistance against ${action.damageType} damage.`);
                    }
                    if(target.hasResist(action.damageType, "vulnerability")) // Vulnerability
                    {
                        d = d *2;
                        logs(`${target.htmlName} is vulnerable against ${action.damageType} damage.`);
                    }
                    if(target.hasResist(action.damageType, "immunity")) // Vulnerability
                    {
                        d = 0;
                        logs(`${target.htmlName} is immune against ${action.damageType} damage.`);
                    }
                    target.hitPoints.current -= d;
                    logs(`${target.htmlName} takes ${d} ${action.damageType} damage`);
                }
            }

            if(action.condition)
            {
                if(action.condition.charm == "true")
                {
                    action.condition.charm = this.isPlayer;
                }
                if(!action.condition.save)
                    action.condition.save = "None";

                let conditionSave = target.rollSave({saveSkill : action.condition.save, saveDC : action.condition.saveDC});
                if(!conditionSave)
                {
                    //logs(`${target.htmlName} now has the condition ${action.condition.name}.`);
                    if(!target.hasCondition("name", action.condition.name))
                    {
                        target.conditions.push(action.condition);
                        let a = clone(action.condition);
                        a.save = undefined;
                        a.duration = -1;
                        target.applyCondition(a);
                    }
                }
            }
            target.checkHitPoints();
        }
    }

    /** Rolls a saving throw an incomming attack or condition
     * @param {action} : {saveSkill - the involved ability score, saveDC - only here for show}
     * @returns {boolean} : the roll's success against action.saveDC.Z*/
    rollSave(action)
    {
        let roll;
        if(action.saveSkill !== "None")
        {
            logs(`${this.htmlName} rolls a ${action.saveSkill} save (DC : ${action.saveDC}).`);
            roll = floor(random() * 20) + 1;
            logs(`(${roll}) + ${this.abilityScores[action.saveSkill].bonus} = ${roll + this.abilityScores[action.saveSkill].bonus}`);
            roll = roll + this.abilityScores[action.saveSkill].bonus;

            let newRoll = floor(random() * 20) + 1 + this.abilityScores[action.saveSkill].bonus;
            if(this.hasCondition("saveDisadvantage", action.saveSkill))
            {
                logs(`${this.htmlName} has dissadvantage on ${action.saveSkill} saves. Disadvantage roll = ${newRoll}`);
                if(newRoll < roll)
                {
                    roll = newRoll;
                }
            }
            if(this.hasCondition("saveAdvantage", action.saveSkill))
            {
                logs(`${this.htmlName} has advantage on ${action.saveSkill} saves. Advantage roll = ${newRoll}`)
                if(newRoll > roll)
                {
                    roll = newRoll
                }
            }
            return (roll >= action.saveDC)
        }
        return roll;
    }

     /** Rolls to Hit with an action
     * @param {Action} : {toHit = the involved ability score}
     * @param {Troop} : target with AC && advantage
     * @returns undefined (toHit == "None") | roll value (AC undefined) | true (roll meets AC) | false (roll doesn't meet AC) */
    rollToHit(action, target)
    {
        let roll;
        if(action.toHit !== "None")
        {
            logs(`${this.htmlName} rolls to Hit for ${action.name}. (1d20 + ${this.abilityScores[action.toHit].bonus + action.toHitExtra}) :`); 
            roll = floor(random() * 20) + 1;
            logs(`(${roll}) + ${this.abilityScores[action.toHit].bonus + action.toHitExtra} = ${roll + this.abilityScores[action.toHit].bonus + action.toHitExtra}`);
            roll += this.abilityScores[action.toHit].bonus + action.toHitExtra;

            
            let newRoll = floor(random() * 20) + 1;
            newRoll += this.abilityScores[action.toHit].bonus + action.toHitExtra;

            // ADVANTAGE TO HIT FOR ATTACKER
            if(this.hasCondition("advantageHit", true))
            {
                if(target.hasCondition("disadvantageTarget", true))
                {
                    logs(`${this.htmlName} has advantage on the attack, but ${target.htmlName} imposes disadvantage.`);
                }
                else
                {
                    logs(`${this.htmlName} has advantage on the attack. Advantage roll = ${newRoll}.`);
                    // ADVANTAGE ROLL
                    if(newRoll > roll)
                    {
                        roll = newRoll;
                    }
                }
            }
            // DISSADVANTAGE TO HIT FOR ATTACKER
            else if(this.hasCondition("disadvantageHit", true))
            {
                if(target.hasCondition("advantageTarget", true))
                {
                    // TARGET HAS USED RECKLESS ATTACK FOR INSTANCE => NORMAL ROLL
                    logs(`${this.htmlName} has disadvantage on the attack, but ${target.htmlName} imposes is also at a disadvantage.`);
                }
                else
                {
                    logs(`${this.htmlName} has disadvantage on the attack. Disadvantage roll = ${newRoll}.`);
                    // DISADVANTAGE ROLL   
                    if(newRoll < roll)
                    {
                        roll = newRoll;
                    }
                }
            }
            // NORMAL ROLL FOR ATTACKER
            else
            {
                if(target.hasCondition("advantageTarget", true))
                {
                    logs(`${target.htmlName} has a condition that gives ${this.htmlName} advantage. Advantage Roll = ${newRoll}`)
                    // TARGET HAS USED RECKLESS ATTACK FOR INSTANCE => ADVANTAGE ROLL
                    if(newRoll > roll)
                    {
                        roll = newRoll;
                    }
                }
                else if(target.hasCondition("disadvantageTarget", true) )
                {
                    // TARGET HAS USED DODGE FOR INSTANCE => DISADVANTAGE ROLL
                    logs(`${target.htmlName} has a condition that gives ${this.htmlName} disadvantage. Disadvantage Roll = ${newRoll}`)
                    if(newRoll < roll)
                    {
                        roll = newRoll;
                    }
                }
            }

            if(target.armorClass)
            {
                if(roll >= target.armorClass)
                {
                    logs(`${action.name} hits !`);
                    return true;
                }
                else
                {
                    logs(`${action.name} misses !`);
                    return false;
                }
            }
            else
                return roll;
        }
        return roll;
    }

    /** Rolls for a specific dice type and amount and adds a bonus
     * @param {action} : {damage = the roll , damageAbility = the involved ability score, damageExtra: some extra damage bonus}
     * @returns {Integer} : the roll's result. */
    rollDamage(action)
    {
        let roll = 0;
        let log = `${this.htmlName} rolls damage`
        let neg = false;

        if(action.damage == "0")
            return 0;
        
        let d = action.damage.match(/([0-9]+)d([0-9]+)/)
        if(action.damage[0] == "-")
        {
            d =  action.damage.slice(1,action.damage.length).match(/([0-9]+)d([0-9]+)/);
            neg = true;
            log = `${this.htmlName} rolls healing`
        }
        //logs(`${log} for ${action.name}.  (${action.damage})`)


        let dieAmount = Number.parseInt(d[1]);
        let dieType = Number.parseInt(d[2]);
        let dLog = `` 
        for(let i = 0; i < dieAmount; i++)
        {
            let die = floor(random() * dieType) + 1;
            if(action.condition && action.condition.name == "Great Weapon Master" && (die == 1 || die == 2) )
            {
                let reroll = floor(random() * dieType + 1);
                dLog += ` (${die} => ${reroll}) `;
                roll += reroll;
            }
            else
            {
                dLog += ` (${die}) `;
                roll += die;
            }
        }

        if(action.damageAbility != "None")
        {
            dLog += `+ ${this.abilityScores[action.damageAbility].bonus + action.damageExtra + this.damageBonus} =`
            roll +=this.abilityScores[action.damageAbility].bonus;
        }
        if(action.damageExtra != 0)
        {
            roll += action.damageExtra;
        }
        if(this.damageBonus != 0)
        {
            roll += this.damageBonus;
        }
        dLog += `${roll}`;
        
        if(dieType !== 1)
            logs(`${log} for ${action.name}.  ${dLog}`);
        if(neg)
        {
            return -roll;
        }
        else
        {
            return roll;
        }
    }
}
