class Troop
{
    /** Constructor for a Troop
     * @param {TroopData} args : JSON data of a Troop / HTML Form data of a Troop.  */
    constructor(args)
    {
        this.name = args.name || "Default Troop";
        // Keep track of the various values that will need resetting.
        this.originalData = {};

        this.isAI = args.isAI || false;
        this.originalData["isAI"] = this.isAI;

        //Is Player tells which Party the troop belongs to. Needs to be stored because of Charm spells
        this.isPlayer = args.isPlayer || false;
        this.originalData["isPlayer"] = args.isPlayer;

        // Stroke value for the Troop being drawn on the map / shown in Menu. Being Charmed during play should change this, so we add it to originalData.
        if(args.stk)
        {
            this.stk = {};
            if(args.stk)
            {
                this.stk = args.stk;
                this.originalData["stk"] = args.stk;
            }
        }
        
        // Position for the Troop being drawn on the map.
        this.position = args.position || {x : 0, y : 0};

        // Dimension for the Troop being drawn on the map.
        if(args.radius) // Radius is remnant of Older version, relying on the Troop Editor... Will eventually dissapear
            this.dimension = {x :  Number.parseInt(args.radius),  y : Number.parseInt(args.radius) };
        if(args.dimension)
            this.dimension = {x :  Number.parseInt(args.dimension.x),  y : Number.parseInt(args.dimension.y) };
        if(this.dimension === undefined)
            this.dimension = {x :  75,  y : 75 };

        // Fluff data is filleable with so much random BS that the possibilities are frightening, but we'll get to that later.
        this.fluffData = { size : args.size || "Medium", type : args.type || "Creature" }

        // Some Default ability score (so you can see the content of the map)
        let stdScore = {"Strength" : {score : 14, bonus : 2}, "Dexterity" : {score : 14, bonus : 2}, "Constitution" : {score : 14, bonus : 2}, "Intelligence" : {score : 10, bonus : 0},  "Wisdom" : {score : 10, bonus : 0}, "Charisma" : {score : 10, bonus : 0}}
        this.abilityScores = args.abilityScores || stdScore;
        this.originalData["abilityScores"] = clone(this.abilityScores);

        // Hit points holds a dice roll before the Troop sets itself up for the game. Then it contains Current and Maximum HP.
        this.hitPoints = args.hitPoints ||  {dieAmount : 1, dieType : 6, bonus : this.abilityScores["Constitution"].bonus}
        this.originalData["hitPoints"] = clone(this.hitPoints);

        // Armor Class is subject to change throughout a game, so should be recorded into originalData
        // TODO : Use object like {"base" : "10", "ability" : "Dexterity"}
        if(!args.armorClass)
            this.armorClass = {"base" : 10, "ability" : "Dexterity"}
        else if(args.armorClass.base === undefined)
            this.armorClass= {"base" : args.armorClass};
        else
            this.armorClass = args.armorClass; 

        // Take initiative bonus from DEX. Can have Conditions which alter it later on.
        this.initiativeBonus = this.abilityScores["Dexterity"].bonus;

        // Speed is the amount of movement you get each turn and it is subject to variations with conditions.
        this.speed =  Number.parseInt(args.speed) || 900;
        this.originalData["speed"] = clone(this.speed);

        // The amount of actions we can play each turn will change quite often.
        this.actionsPerTurn = Number.parseInt(args.actionsPerTurn) || 1;
        this.turnsAmount = Number.parseInt(args.turnsAmount) || 1;
        this.originalData["actionsPerTurn"] = clone(this.actionsPerTurn);
        this.originalData["turnsAmount"] = clone(this.turnsAmount);

        // No Troop has any Damage Modifier on its own. These come from having Conditions.
        this.resistances = "";
        this.vulnerabilities = "";
        this.immunities = "";
        this.damageBonus = 0;
        this.toHitBonus = 0;

        // Actions is the Array of action Maps. 
        this.actions = [];
        if(args.actions)
            args.actions.forEach(a => {this.actions.push(a)})

        if(this.hasAction("name", "Help") === false)
            this.actions.unshift({name:"Help", target:"Ally", reach:150, areaEffect:1, uses : -1, condition : {name:"Helped by " + this.name, duration:1, advantageHit : true}});
        
        if(this.hasAction("name", "Dodge") === false)
            this.actions.unshift({name:"Dodge", target:"Self", reach:10, areaEffect:1, uses : -1, condition : {name:"Dodging", duration : 0, disadvantageTarget : true}});

        if(this.hasAction("name", "Dash") === false && this.speed > 0)
            this.actions.unshift( {name:"Dash", target:"Self", reach:10, areaEffect:1, uses : -1, condition : {name:"Dashing", duration:0, moveMod:1, damage:0}} );

        // A Troop can start the game with some Conditions / Traits
        this.conditions = args.conditions || [];

        // Pools of actions are String-Integer pairs limiting uses for Actions
        this.pools = args.pools || {};
        
        // A Troop can receive an equipment which is a map of modifier lists.
        this.equipment = args.equipment || {};
        this.modifiers = args.modifiers || [];

        // Since we receive JSON, we double check the parsing of everything for DataTypes. Me no want no NaN.
        this.parse();
    }

    /** Make sure all the data is properly converted from the storage to the instance. TODO : use Action and Conditions class to parse. */
    parse()
    {
        // Parse ability score
        for(let key in this.abilityScores)
        {
            this.abilityScores[key].score = Number.parseInt(this.abilityScores[key].score);
            this.abilityScores[key].bonus = Number.parseInt(this.abilityScores[key].bonus);
        }
        // Parse HPs
        for(let key in this.hitPoints)
        {
            if(key !== "formula")
            {
                this.hitPoints[key] = Number.parseInt(this.hitPoints[key])
            }
        }
        // Parse Armor Class
        for(let key in this.armorClass)
        {
            this.armorClass[key] = Number.parseInt(this.armorClass[key]) || this.armorClass[key];
        }
        this.originalData["armorClass"] = clone(clone(this.armorClass));

        // Parse Pools
        for(let key in this.pools)
        {
            this.pools[key] = Number.parseInt(this.pools[key]);
        }

        // Parse all of the Troop's actions
        for(let i = 0; i < this.actions.length; i++)
        {
            let act = new Action(this.actions[i]); // Create action object
            for(let key in act)
            {
                this.actions[i][key] = act[key]; // Clone each key of the action object.
            }
        }
        for(let i = 0; i < this.conditions.length; i++)
        {
            let cond = new Condition(this.conditions[i]);
            for(let key in cond)
            {
                this.conditions[i][key] = cond[key];
            }
        }
        this.applyEquipment();
    }

    /** Looks at the Troop's data and generates the things we need to store locally. */
    toJSON()
    {
        this.removeEquipment();

        let ret = {};
        ret.name = this.name;
        ret.position = { x : this.position.x, y: this.position.y}
        ret.dimension = {x : this.dimension.x, y : this.dimension.y};
        ret.fluffData = this.fluffData;
                
        for(let key in this.originalData)
        {
            ret[key] = this.originalData[key];
        }
        ret.actions = this.actions;
        ret.conditions = this.conditions;
        ret.pools = this.pools;
        ret.equipment = this.equipment;

        return JSON.stringify(ret);
    }

    /** Returns an HTML element with the name of the Troop with coloring */
    getHTMLName()
    {
        return `<b style="color:${this.stk};"> ${this.name} </b>`
    }

    /** Gets the value of Armor Class from the object used to calculate it.
     * {base : Integer, ability : AbilityScore.bonus, maximum : Integer, bonus : Integer } */
    getArmorClass()
    {
        if(Number.parseInt(this.armorClass) ){
            return this.armorClass;
        }
        if(!this.armorClass.bonus)
        {
            this.armorClass.bonus = 0;
        }
        let ac = this.armorClass;
        if(ac.base)
        {
            let modifier = 0;
            if(ac.ability)
            {
                if(ac.ability.includes(", "))
                {
                    let ab = ac.ability.split(", ");
                    for(let i = 0; i < ab.length; i++)
                    {
                        modifier += this.abilityScores[ab[i]].bonus
                    }
                }
                else 
                {
                    modifier = this.abilityScores[ac.ability].bonus;
                }
                if(ac.maximum && modifier > ac.maximum)
                {
                    modifier = ac.maximum;
                }
            }
            return ac.base + modifier + ac.bonus;
        }
    }
    
    /** Tells if the Troop possesses an action with key filter == value. TODO : see about returning a clone()
     * @param {String} filter : checks for action[filter]
     * @param {String} value : checks action[filter] == value
     * @param {Boolean} returnIndex : flag to return the Index of the Action instead of the object's pointer.
     * @returns {Boolean} has the troop got the action ?*/
    hasAction(filter, value, returnIndex)
    {
        for(let i = 0; i < this.actions.length; i++)
        {
            if(value === undefined && (filter in this.actions[i]) )
            { 
                return this.actions[i]
            }
            else if(this.actions[i][filter] == value)
            {
                if(returnIndex)
                    return i;
                return this.actions[i];
            }
        }
        return false;
    }

    /** Tells if the Troop is suffering from a specific condition
     * @param {String} filter : checks for condition[filter]
     * @param {String} value : checks condition[filter] == value.
     * @param {String} removeFlag : splices the condition if needed
     * @returns {Boolean | Object} has the troop got the condition with value ? (Returns the value if param value is left undefined) */
    hasCondition(filter, value, removeFlag)
    {
        for(let i = 0; i < this.conditions.length; i ++)
        {
            if(value == undefined && this.conditions[i][filter] != undefined)
            {
                return this.conditions[i][filter];
            }
            if(this.conditions[i][filter] == value)
            {
                if(removeFlag)
                {
                    this.conditions.splice(i, 1);
                }
                return true;
            }
        }
        return false;
    }
    
    /** Tells if the Troop has resistance, vulnerability or immunity to a damage type
     * @param {String} damageType : the damage type to check
     * @param {String} modifier : a flag to output resist, vulnerability or immunity
     * @returns {Boolean} has the troop got the resist ?*/
    hasDamageModifier(damageType, modifier)
    {
        if(!damageType || damageType == "")
            return false;

        let ret = false;
        if(modifier == "vulnerabilities" || modifier == "immunities" || modifier == "resistances")
        {
            this[modifier].split(", ").forEach(sub =>
            {
                if(sub == damageType)
                    ret= true;
            })
        }
        return ret;
    }

    /** Equipment Management : WIP. Applies and Removes modifiers from the Equipment object. */
    getModifiersArray()
    {
        let arr = [];
        for(let key in this.equipment)
        {
            if(this.equipment[key].modifiers)
            {
                for(let i = 0; i < this.equipment[key].modifiers.length; i++)
                {
                    this.equipment[key].modifiers[i].slot = key;
                    arr.push(this.equipment[key].modifiers[i]);
                }
            }
        }
        arr = arr.sort((a, b) => {return a.type.length - b.type.length; } );
        return arr;
    }
    applyEquipment()
    {
        let mods = this.getModifiersArray();
        for(let i = 0; i < mods.length; i++)
        {
            let mod = mods[i];
            this.applyModifier(mod, mod.slot);
        }
    }
    removeEquipment()
    {
        let mods = this.getModifiersArray();
        for(let i = mods.length -1; i >= 0; i--)
        {
            let mod =  mods[i];
            this.removeModifier(mod, mod.slot);
        }
    }
    applyModifier(modifier, slot)
    {
        switch (modifier.type)
        {
            case "size":
                this.dimension = getDimensionFromSizeCategory(modifier.value);
                break;
            case "speed":
                this.speed = modifier.value;
                break;
            
            case "initiativeBonus":
                this.initiativeBonus += modifier.value;
                break;

            case "abilityScoreIncrease" :
                this.abilityScores[modifier.key].score += modifier.value;
                this.abilityScores[modifier.key].bonus = floor( (this.abilityScores[modifier.key].score - 10) / 2 );
                break;

            case "armorClass" : 
                for(let key in modifier.value)
                {
                    this.armorClass[key] = modifier.value[key]
                }
                break;

            case "armorClassBonus" :
                if(this.armorClass.bonus === undefined)
                {
                    this.armorClass.bonus = 0;
                }
                this.armorClass.bonus += modifier.value;
                break;

            case "hitDieIncrease" :
                this.hitPoints.dieType += 2;
                break;

            case "hitDieAmount" :
                this.hitPoints.dieAmount ++;
                break;

            case "hitPointMaximum":
                this.hitPoints.bonus += this.hitPoints.dieAmount;
                break;
                
            case "actionMod" :
                for(let a = 0; a < this.actions.length; a++)
                {
                    for(let key in modifier.filter)
                    {
                        if((key == "name" && this.actions[a][key] && this.actions[a][key].includes(modifier.filter[key])) || 
                            (key != "name" && this.actions[a][key] && this.actions[a][key] == modifier.filter[key] ))
                        {
                            for(let modKey in modifier.value)
                            {
                                if(this.originalData["actions"] === undefined)
                                    this.originalData["actions"] = {};

                                this.originalData["actions"][a] = {};
                                this.originalData["actions"][a]= clone(this.actions[a]);

                                this.actions[a][modKey] = modifier.value[modKey]
                            }
                        }
                    }
                } 
                break;

            case "action" :
                if(!slot || (modifier.value.name.includes("(Two-Handed)") && slot == "Both Hands") || (!modifier.value.name.includes("(Two-Handed)") && slot != "Both Hands"  ))
                {
                    let act = new Action(modifier.value);
                    this.actions.push(act.clone());
                }
                break;
            case "condition" :
                this.conditions.push(modifier.value);
                break;
            case "pool" :
                for(let key in modifier.value)
                {
                    if(!this.pools[key])
                        this.pools[key] = 0;
                    this.pools[key] += modifier.value[key];
                }
                break;
        }
    }
    removeModifier(modifier)
    {
        switch (modifier.type)
        {
            case "size":
                this.dimension = getDimensionFromSizeCategory(this.fluffData.size);
                break;
            case "speed":
                this.speed = this.originalData["speed"];
                break;
            case "initiativeBonus":
                this.initiativeBonus = this.abilityScores["Dexterity"].bonus;
                break;
            case "abilityScoreIncrease" :
                this.abilityScores[modifier.key].score -= modifier.value;
                this.abilityScores[modifier.key].bonus = floor( (this.abilityScores[modifier.key].score - 10) / 2 );
                break;

            case "armorClass" : 
                this.armorClass = this.originalData["armorClass"];
                break;

            case "armorClassBonus" :
                if(this.armorClass.bonus)
                    this.armorClass.bonus -= modifier.value;
                break;

            case "hitDieIncrease" :
                this.hitPoints.dieType -= 2;
                break;

            case "hitDieAmount" :
                this.hitPoints.dieAmount --;
                break;

            case "hitPointMaximum":
                this.hitPoints.bonus -= this.hitPoints.dieAmount;
                break;

            case "actionMod" :
                for(let a = 0; a < this.actions.length; a++)
                {
                    if(this.originalData["actions"] && this.originalData["actions"][a])
                    {
                        let act = new Action(this.originalData["actions"][a]);
                        for(let key in act)
                        {
                            this.actions[a][key]= act[key];
                        }
                    }
                } 
                break;

            case "action" :
                let index = this.hasAction("name", modifier.value.name, true)
                if(this.actions[index]){
                    this.actions.splice(index,1);
                }
                break;
            case "condition" :
                this.hasCondition("name", modifier.value.name, true)        
                break;
            case "pool" :
                for(let key in modifier.value)
                {
                    if(this.pools[key])
                        this.pools[key] = undefined;
                }
                break;
        }
    }

    /** Sets up the Troop at the start of a Game
     * Roll dem dices to setup this.initiative and this.hitPoints for a game*/
    startGame()
    {
        this.initiative = floor(random() * 20) + 1;
        this.initiative += Number.parseInt(this.initiativeBonus);
        // Could check for Condition which improves Initiative and apply it.
        //logs(`Initiative : 1d20 + ${Number.parseInt(this.initiativeBonus)} = ${this.initiative}`);

        // Set the proper Hit Points values from ... the Hit Points values.
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

        this.actionsTaken = 0;
        this.movement = this.speed;

        // Apply Trait conditions
        this.applyConditions();
    }

    /** Starts a fresh turn for the Troop. 
     *  Resets movement and applies conditions.  */
    startTurn( areas )
    {
        if(!this.hasCondition("name", "Unconcious"))
            logs(`${this.getHTMLName()} starts its turn.`);   

        this.actionsTaken = 0;
        for(let key in this.originalData)
        {
            if(key !== "hitPoints")
            {
                this[key] = this.originalData[key];
            }
        }
        this.resistances = "";
        this.vulnerabilities = "";
        this.immunities = "";
        this.damageBonus = 0;
        this.toHitBonus = 0;
        this.movement = this.speed;
        // Remove the hasBeenUsed attribute on all the actions.
        this.actions.forEach(a => { if(a.hasBeenUsed){ a.hasBeenUsed = undefined; } })

        this.resetConditions();
        this.applyConditions(areas);
        this.movement = this.speed;
    }

    /** Apply all the troop's conditions */
    applyConditions( areas )
    {
        if(this.hasCondition("name","Unconcious"))
        {
            nextTurn();
        }
        else
        {
            // Areas can give out Conditions
            if(areas)
            {
                areas.forEach(a => 
                {
                    if(a.conditions && intersects(this.position, a.shape))
                    {
                        a.conditions.forEach(c => this.conditions.push(c));
                    }
                })
            }
        
            let skipTurnFlag = false; // Take note if we are supposed to skip the turn (Stunned, Petrified, blah blah...)
            this.conditions.forEach(c =>
            {
                if(c.name !== "Unconcious") // Unconcious is a special state, no conditions apply there.
                {
                    if(this.applyCondition(c)) // Apply the condition, and check if it is supposed to make us skip the turn.
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
    applyCondition( c )
    {
        // Roll a Save to stop the Condition.
        if(c.save)
        {
            if(this.rollSave({saveAbility : c.save, saveDC : c.saveDC}) === true)
            {
                logs(`${this.getHTMLName()} is no longer ${c.name}.`, c.isLogged);
                c.duration = 0;
                return false; // Make sure we don't apply the thing.
            }
        }
        // Reduce the duration if not infinite && not over
        if(c.duration !== -1 && c.duration !== 0)
        {
            c.duration--;
            logs(`${this.getHTMLName()} is ${c.name} for ${c.duration} turns.`, c.isLogged);
        }
        // Apply Damage if given (includes healing and Aura Effects for damage)
        if(c.damage && Number.parseInt(c.damage) != 0)
        {
            let damageRoll = {name: c.name, damage : c.damage, damageAbility : "None", damageExtra : 0};
            let damage = this.rollDamage(damageRoll);
            if(damage) // If damage roll is valid.
            {
                // If we have an Area of Effect => Use some of the Game/Camera code to find the targets.
                if(c.areaEffect && c.target)
                {
                    let targets = getAffectedTroops(this, {target:c.target, areaEffect : Number.parseInt(c.areaEffect) }, game.initiativeOrder, true);
                    targets.forEach(t => 
                    {
                        game.initiativeOrder[t].hitPoints.current -= damage;
                        game.initiativeOrder[t].checkHitPoints();
                        if(damage > 0)
                            logs(`${game.initiativeOrder[t].getHTMLName()} looses <b style="color:rgb(200,20,20);"> ${damage} </b> hit points for being within ${this.getHTMLName()}'s ${c.name}.`, c.isLogged)
                        else
                            logs(`${game.initiativeOrder[t].getHTMLName()} regains <b style="color:rgb(20,200,20);"> ${-damage} </b> hit points for being within ${this.getHTMLName()}'s ${c.name}.`, c.isLogged)
                    })
                }
                // If we have a condition that deals damage / heals at the start of each turn.
                else
                {
                    this.hitPoints.current -= damage;
                    if(damage > 0)
                        logs(`${this.getHTMLName()} looses <b style="color:rgb(200,20,20);"> ${damage}</b> hit points for being ${c.name}.`, c.isLogged)
                    else
                        logs(`${this.getHTMLName()} regains <b style="color:rgb(20,200,20);"> ${-damage} </b> hit points for being ${c.name}.`, c.isLogged)
                }
            }
        }
        // Condition modifies our movement speed (i.e. Difficult Terrain/ Expeditous Retreat Spell)
        if(c.moveMod)
        {
            this.speed = this.movement + ( this.speed * Number.parseFloat(c.moveMod) );
            this.movement = this.speed;
            logs(`${this.getHTMLName()} is ${c.name}, speed becomes ${this.speed}.`, c.isLogged);
        }
        // Condition gives us Resistances, Vulnerabilities or Immunities
        if(c.resistances)
        {
            logs(`${this.getHTMLName()} is resistant to ${c.resistances} damage type(s).`, c.isLogged);
            this.resistances += c.resistances; 
        }
        if(c.vulnerabilities)
        {
            logs(`${this.getHTMLName()} is vulnerable to ${c.vulnerabilities} damage type(s).`, c.isLogged);
            this.vulnerabilities += c.vulnerabilities;
        }
        if(c.immunities)
        {
            logs(`${this.getHTMLName()} is immune to ${c.immunities} damage type(s).`, c.isLogged);
            this.immunities += c.immunities;
        }
        // Condition makes us skip the Turn (return is to ensure that we do so in this.startTurn() )
        if(c.skipTurn)
        {
            logs(`<b> ${this.getHTMLName()} is not able to act for being ${c.name}. </b>`, c.isLogged);
            return true;
        }
        // Modifies the amount of actions the troop will be able to do this turn. addAction is a *terrible* name.
        if(c.addAction)
        {
            this.actionsPerTurn += Number.parseInt(c.addAction);
        }
        // Modifies the AC of the Troop (i.e. Shield of Faith spell, Parry reaction, etc.). acBonus is a *terrible* name.
        if(c.acBonus)
        {
            logs(`${this.getHTMLName()} has an Armor Class of ${this.getArmorClass() + c.acBonus}.`, c.isLogged);
            console.log(this.originalData["armorClass"], this.armorClass)
            this.originalData["armorClass"] = clone(this.armorClass);
            this.armorClass.bonus += Number.parseInt(c.acBonus);
        }
        // Adds some bonus to damage rolls
        if(c.damageBonus)
        {
            this.damageBonus += Number.parseInt(c.damageBonus);
        }
        // Adds some bonus to damage rolls
        if(c.toHitBonus)
        {
            this.toHitBonus += Number.parseInt(c.toHitBonus);
        }
        // Makes this Troop part of another team
        if(c.charm)
        {
            logs(`${this.getHTMLName()} is ${c.name} and joins ${c.charm}`, c.isLogged);
            this.isPlayer = c.charm.isPlayer;
            this.stk = c.charm.stk;
            this.isAI = c.charm.isAI;
        }
        // "Some Pool Name, 1" will add 1 unit to the Some Pool Name pool of actions. Used for Loading Crossbow.
        if(c.recharge)
        {
            let r = c.recharge.split(", ");
            this.pools[r[0]] += Number.parseInt(r[1]);
            logs(`${this.getHTMLName()} has ${c.name}`, c.isLogged);

        }
        // Advantage and Disadvantage Conditions => See rollToHit function
        // Reckless Attack, Help, Dodge and so on...
        if(c.advantageHit)
        {
            logs(`${this.getHTMLName()} has advantage on attack rolls.`, c.isLogged);
        }
        if(c.advantageTarget)
        {
            logs(`Attack rolls targeting ${this.getHTMLName()} have advantage.`, c.isLogged);
        }
        if(c.disadvantageHit)
        {
            logs(`${this.getHTMLName()} has disadvantage on attack rolls.`, c.isLogged);
        }
        if(c.disadvantageTarget)
        {
            logs(`Attack rolls targeting ${this.getHTMLName()} have disadvantage.`, c.isLogged);
        }
        this.checkHitPoints();
        return false;
    }

    /** Resets conditions for the turn by removing used up ones */
    resetConditions()
    {
        // Elliminating conditions that are over
        for (let i = this.conditions.length -1; i >= 0; i--)
        {
            let c = this.conditions[i];
            if(c.duration == 0)
            {
                logs(`${this.name} is no longer ${c.name}.`, c.isLogged)
                this.conditions.splice(i,1);
            }
        }
    }

    /**Reset the value of a key for condition */
    setConditionValue(conditionName, key, value)
    {
        // Set the duration back
        for(let i =0; i < this.conditions.length; i++)
        {
            if(this.conditions[i].name == conditionName)
            {
                this.conditions[i][key] = value;
            }
        }
    }

    /** Check hitPoints for death or resurrect */
    checkHitPoints()
    {
        this.hasCondition("name","Unconcious", true); // Remove the Unconcious condition temporarily


        if(this.hitPoints.current > this.hitPoints.maximum)
        {
            this.hitPoints.current = this.hitPoints.maximum;
        }
        if(this.hitPoints.current <= 0)
        {
            this.hitPoints.current = 0;
            this.conditions.unshift({name: "Unconcious"}) // Put the Unconcious condition back
        }
    }

    /** use Action onto a target
     * @param {Integer} actionIndex : the index of the action in this.actions
     * @param {Troop} target : the recipient of the action */
    useAction( actionIndex, target, sharedDamage )
    {
        let action = this.actions[actionIndex];

        // Logging the action being used.
        if(action.target !== "Self" || target.name !== this.name) 
            logs(`${this.getHTMLName()} uses ${action.name} on ${target.getHTMLName()}.`);
        else
            logs(`${this.getHTMLName()} uses ${action.name}.`);


        // Rolling dice. Specific functions will take the needed parts of the action and log properly
        let toHit = this.rollToHit(action, target);
        let save = target.rollSave(action);

        // Rolling damage will Log, so we need to do it only when needed.
        let d ;

        // Automatic success actions
        if(toHit === undefined && save === undefined)
        {
            d = this.rollDamage(action, sharedDamage);
        }
        else if(toHit !== false) // If hit is undefined or true, we did affect the troop.
        {
            d = this.rollDamage(action, sharedDamage)
            if(save === true)
            {
                // If we evade the damage entierly
                if(action.saveCancelsDamage || (!action.saveCancelsDamage && (target.hasCondition("evade") == "Any" || target.hasCondition("evade") == action.saveAbility)  ) )
                    d = 0;
                // If we halve the damage
                else if( !action.saveCancelsDamage || (target.hasCondition("evade") == "Any" || target.hasCondition("evade") == action.saveAbility) )
                    d = floor(d * 0.5);
            }
        }
        // We hit the target, apply damage
        if(d !== undefined)
        {
            // Some actions need to hit before we reduce their uses
            if(action.onSuccess)
            {
                if(action.uses != -1)
                    this.actions[actionIndex].uses --;
                if(action.expandsPool && action.pool && this.pools[action.pool] !== -1)
                    this.pools[action.pool] --;
            }
            // Apply Resistances and Log Damage
            if(d > 0)
            {
                d = this.applyResist(action, target, d);
                logs(`${target.getHTMLName()} takes ${d} ${action.damageType} damage from ${action.name}.`);
            }
            else if(d < 0) // Display healing differently (also, healing doesn't need damage type)
            {
                logs(`${target.getHTMLName()} regains  ${-d} hit points ${action.name}.`);
            }

            // Vampiric action, speaks for itself
            if(action.isVampiric)
            {
                this.hitPoints.current += d;
                this.checkHitPoints();
            }

            target.hitPoints.current -= d;
            
            // Deal the Action's Condition to the target
            this.dealCondition(action.condition, target);
        }
        // Set/Unset Unconcious if need be.
        target.checkHitPoints();
    }

    /** useAction Helper 
     * Deals condition for a given action */
    dealCondition( condition, target )
    {
        if(condition && condition.notDealt == "applyToSelfInstead")
        {
            let a = clone(condition);
            let conditionSave = target.rollSave({saveAbility : condition.save, saveDC : condition.saveDC});
            if(!conditionSave)
            {
                a.save = undefined;
                this.applyCondition(a);
            }
        }
        if(condition && !condition.notDealt)
        {
            condition = clone(condition);
            if(condition.charm == true)
            {
                condition.charm = this;
            }
            if(!condition.save)
                condition.save = "None";

            let conditionSave = target.rollSave({saveAbility : condition.save, saveDC : condition.saveDC});
            if(!conditionSave)
            {
                if(!target.hasCondition("name", condition.name))
                {
                    target.conditions.push(condition);

                    // Apply condition rightaway without the save and without decreasing the duration of the Condition given.
                    let a = clone(condition);
                    a.save = undefined;
                    a.duration = -1;
                    target.applyCondition(a);
                }
                else if(target.hasCondition("name", condition.name) && condition.duration !== -1)
                {
                    target.setConditionValue(condition.name, "duration", condition.duration)
                }
            }
        }
    }

    /** useAction Helper
     * Applies resistances, immunities and vulnerability to an action's damage */
    applyResist( action, target, d )
    {
        if(! action.damageType)
        {
            return d;
        }

        let damage = d;
        if(target.hasDamageModifier(action.damageType, "resistances")) // Resist
        {
            damage = floor(d/2);
            logs(`${target.getHTMLName()} has resistance against ${action.damageType} damage.`);
        }
        if(target.hasDamageModifier(action.damageType, "vulnerabilities")) // Vulnerability
        {
            damage = d *2;
            logs(`${target.getHTMLName()} is vulnerable against ${action.damageType} damage.`);
        }
        if(target.hasDamageModifier(action.damageType, "immunities")) // Vulnerability
        {
            damage = 0;
            logs(`${target.getHTMLName()} is immune against ${action.damageType} damage.`);
        }
        return damage;
    }

    /** Rolls a saving throw an incomming attack or condition
     * @param {action} : {saveAbility - the involved ability score, saveDC - only here for show}
     * @returns {boolean} : the roll's success against action.saveDC.Z*/
    rollSave( action )
    {
        let roll;
        if(action.saveAbility !== undefined && action.saveAbility !== "None")
        {
            logs(`${this.getHTMLName()} rolls a ${action.saveAbility} save (DC : ${action.saveDC}).`);
            roll = floor(random() * 20) + 1;
            logs(`(${roll}) + ${this.abilityScores[action.saveAbility].bonus} = ${roll + this.abilityScores[action.saveAbility].bonus}`);
            roll = roll + this.abilityScores[action.saveAbility].bonus;

            let newRoll = floor(random() * 20) + 1 + this.abilityScores[action.saveAbility].bonus;
            if(this.hasCondition("saveDisadvantage", action.saveAbility))
            {
                logs(`${this.getHTMLName()} has dissadvantage on ${action.saveAbility} saves. Disadvantage roll = ${newRoll}`);
                if(newRoll < roll)
                {
                    roll = newRoll;
                }
            }
            if(this.hasCondition("saveAdvantage", action.saveAbility))
            {
                logs(`${this.getHTMLName()} has advantage on ${action.saveAbility} saves. Advantage roll = ${newRoll}`)
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
    rollToHit( action, target )
    {
        let roll;
        if(action.toHit !== undefined)
        {
            // Roll the actual dice
            roll = floor(random() * 20) + 1;
            // Reroll if conditions are met
            let a = this.hasCondition("rerollHit");
            if(a && a instanceof String)
            {
                a.split(", ").forEach(d => {
                    if(roll == d)
                    {
                        let reroll = floor(random() * 20) + 1;
                        roll = `${roll} => ${reroll}`;
                    }
                });
            }

            if(action.toHitExtra && action.toHit !== "None")
            {
                logs(`  ${this.getHTMLName()} rolls to Hit for ${action.name}. 
                (${roll}) + ${this.abilityScores[action.toHit].bonus + action.toHitExtra + this.toHitBonus} = ${roll + this.abilityScores[action.toHit].bonus + action.toHitExtra + this.toHitBonus}`); 
                roll += this.abilityScores[action.toHit].bonus + action.toHitExtra + this.toHitBonus;
            }
            else if(!action.toHitExtra)
            {
                logs(`  ${this.getHTMLName()} rolls to Hit for ${action.name}. 
                (${roll}) + ${this.abilityScores[action.toHit].bonus + this.toHitBonus} = ${roll + this.abilityScores[action.toHit].bonus + this.toHitBonus}`); 
                roll += this.abilityScores[action.toHit].bonus + this.toHitBonus;
            }
            else if(action.toHit == "None")
            {
                logs(`  ${this.getHTMLName()} rolls to Hit for ${action.name}. 
                (${roll}) + ${action.toHitExtra + this.toHitBonus} = ${roll + action.toHitExtra + this.toHitBonus}`); 
                roll +=  action.toHitExtra + this.toHitBonus;
            }
            roll = this.applyAdvantage(action, roll, target);
            
            if(target.getArmorClass())
            {
                if(roll >= target.getArmorClass())
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
        }
        return roll;
    }
    
    /** rollToHit Helper
     * Applies the various conditions (on this and on target) that could grant/cancel advantage to the roll.  */
    applyAdvantage(action, roll, target)
    {
        let ret = roll;
        // Roll the advantage/disadvantage dice
        let newRoll = floor(random() * 20) + 1;
        newRoll += this.abilityScores[action.toHit].bonus + action.toHitExtra + this.toHitBonus;

        // ADVANTAGE TO HIT FOR ATTACKER
        if(this.hasCondition("advantageHit", true))
        {
            if(target.hasCondition("disadvantageTarget", true))
                logs(`${this.getHTMLName()} has advantage on the attack, but ${target.getHTMLName()} imposes disadvantage.`);
            else
            {
                // ADVANTAGE ROLL
                logs(`${this.getHTMLName()} has advantage on the attack. Advantage roll = ${newRoll}.`);
                if(newRoll > roll) { ret = newRoll; }
            }
        }
        // DISSADVANTAGE TO HIT FOR ATTACKER
        else if(this.hasCondition("disadvantageHit", true))
        {
            if(target.hasCondition("advantageTarget", true))
                logs(`${this.getHTMLName()} has disadvantage on the attack, but ${target.getHTMLName()} imposes is also at a disadvantage.`);
            else
            {
                // DISADVANTAGE ROLL   
                logs(`${this.getHTMLName()} has disadvantage on the attack. Disadvantage roll = ${newRoll}.`);
                if(newRoll < roll){ ret = newRoll; }
            }
        }
        // NORMAL ROLL FOR ATTACKER
        else
        {
            if(target.hasCondition("advantageTarget", true))
            {
                // TARGET HAS USED RECKLESS ATTACK FOR INSTANCE => ADVANTAGE ROLL
                logs(`${target.getHTMLName()} has a condition that gives ${this.getHTMLName()} advantage. Advantage Roll = ${newRoll}`)
                if(newRoll > roll){ roll = newRoll; }
            }
            else if(target.hasCondition("disadvantageTarget", true) )
            {
                // TARGET HAS USED DODGE FOR INSTANCE => DISADVANTAGE ROLL
                logs(`${target.getHTMLName()} has a condition that gives ${this.getHTMLName()} disadvantage. Disadvantage Roll = ${newRoll}`)
                if(newRoll < roll){ ret = newRoll; }
            }
        }
        return ret;
    }

    /** Rolls for a specific dice type and amount
     * @param {Action} action : Object containing {damage = the roll, damageAbility = the involved ability score, damageExtra: some extra damage bonus}
     * @param {Integer} damage : in case the damage is shared between multiple targets, just return what has been passed.
     * @returns {Integer} : the roll's result. */
    rollDamage( action, damage )
    {
        let roll = 0;
        let log = `${this.getHTMLName()} rolls damage`
        let neg = false;

        if(action.damage === undefined)
            return 0;

        // Return shared Damage
        if(damage)
            return damage;

        // If action.damage is not a roll but a Number
        if(action.damage.toString().match(/^-?[0-9]$/) !== null)
            return action.damage;
        
        
        let d = action.damage.match(/([0-9]+)d([0-9]+)/); // Extract the dice roll values out of the roll
        if(action.damage[0] == "-") // Deal with negative damage
        {
            d =  action.damage.slice(1,action.damage.length).match(/([0-9]+)d([0-9]+)/);
            neg = true;
            log = `${this.getHTMLName()} rolls healing`
        }

        // We found a dice formula to roll
        let dieAmount = Number.parseInt(d[1]);
        let dieType = Number.parseInt(d[2]);
        let dLog = ``;
        // Roll each die
        for(let i = 0; i < dieAmount; i++)
        {
            let die = floor(random() * dieType) + 1;

            // Reroll if conditions are met
            if(action.condition && action.condition["rerollDamage"]) // GENERALIZE THIS SHHH, MATE.
            {
                let rr = action.condition["rerollDamage"].toString();

                rr.split(", ").forEach(d => {
                    if(die == d)
                    {
                        let reroll = floor(random() * dieType) + 1;
                        dLog += ` (${die} => ${reroll}) `;
                        roll += reroll;
                    }
                });
            }
            else
            {
                dLog += ` (${die}) `;
                roll += die;
            }
        }

        // Add the bonuses
        if(action.damageAbility !== undefined && action.damageAbility !== "None")
        {
            dLog += `+ ${this.abilityScores[action.damageAbility].bonus}`
            roll += this.abilityScores[action.damageAbility].bonus;
        }
        if(action.damageExtra !== undefined)
        {
            dLog += `+ ${action.damageExtra}`
            roll += action.damageExtra;
        }
        if(this.damageBonus !== undefined && this.damageBonus !== 0)
        {
            dLog += `+ ${this.damageBonus}`
            roll += this.damageBonus;
        }
        dLog += ` = ${roll}`
        
        // Don't display log for d1's => Doesn't really apply no more.
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

    // Spits out an HTML description of this.actions[id]
    getActionDescription(id)
    {
        let act = new Action(this.actions[id]);

        let ret = `
        <h3> ${act.name} </h3>
        <p>${act.describeTarget()} <br/> 
        ${act.describeSuccess()} <br/>
        ${act.describeDamage()} <br/>
        ${act.describeUses()} <br/>
        ${act.describeCondition()} </p>`
        return ret;
    }

    /** Returns whether a Troop is allowed to move at the given position on the map => TO BE REMOVED IN FAVOR OF CAMERA METHOD */
    intersects( position, otherTroops, areas )
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

    /** Changes Troop position to the given position on the map */
    move( position )
    {
        let distance = floor(position.copy().dist( createVector(this.position.x, this.position.y) ));

        this.position.x = position.x;
        this.position.y = position.y;
        this.movement -= distance;
        logs(`${this.getHTMLName()} moves to (${this.position.x}, ${this.position.y}). <br/> ${this.movement} clicks left of movement.`)
    }
}


/** Action & Condition helper classes. Used for quick parsing and description of the Action & Condition anonymous objects.
 * In order to be useable objects in the game, we need the ability to Clone and toJSON them. 
 * It *would* really help to do that and refactor the hell out of this file.  */
class Action
{
    constructor(args)
    {
        for(let key in args)
        {
            this[key] = args[key];
        }
        this.parse();
    }
    parse()
    {
        for(let key in this)
        {
            if(this[key] === "true")
            {
                this[key] = true;
            }
            else
            {
                if(key !== "damage") // Damage is often misread as an Integer because of `d` character being listed as valid (Thanks, JS)
                {
                    this[key] = Number.parseInt(this[key]) || this[key];
                    if(this[key] == "0"){ this[key] = 0; }
                }
            }
        }
        // Parse the condition within any Action
        if(this.condition)
        {
            for(let key in this.condition)
            {
                if(this.condition[key] == "true")
                {
                    this.condition[key] = true;
                }
                else
                {
                    if(key !== "damage") // Damage is often misread as an Integer because of `d` character being listed as valid  (Thanks, JS)
                    {
                        this.condition[key] = Number.parseInt(this.condition[key]) || this.condition[key];
                        if(this.condition[key] == "0"){ this.condition[key] = 0; }
                    }
                }
            }
        }
    }
    clone()
    {
        let a ={}; 
        for(let key in this)
        {
            a[key] = this[key];
        }
        return a;
    }
    describe(ignoreCondition)
    {
        if(ignoreCondition)
            return `${this.describeTarget()}${this.describeSuccess()} ${this.describeDamage()} ${this.describeUses()}`

        return `${this.describeTarget()}${this.describeSuccess()} ${this.describeDamage()} ${this.describeUses()}${this.describeCondition()}`
    }
    describeTarget()
    {
        let ret = ``;
        switch (this.target)
        {
            case "Self":
                ret += `Target yourself. ` 
                break;
            case "Enemy":
                if(this.areaEffect < 10)
                    ret += `Target an Enemy creature within range (${this.reach / 100} meters). `
                else
                    ret += `Target all Enemy creatures in a ${(this.areaEffect / 100)} meters area around a point within range (${this.reach / 100} meters). `
                break;
            case "Ally":
                if(this.areaEffect < 10)
                    ret += `Target an Ally creature within range (${this.reach / 100} meters). `
                else
                    ret += `Target all Ally creatures in a ${(this.areaEffect / 100)} meters area around a point within range (${this.reach / 100} meters). `
                break;
            case "Point":
                ret += `Target all creatures in a ${(this.areaEffect / 100)} meters area around a point within range (${this.reach / 100} meters). `
        }
        return ret;
    }
    describeSuccess()
    {
        let ret = ``;
        if(this.toHit !== undefined)
        {
            ret += `Roll to hit. `
            if(this.toHit !== "None")
            {
                ret += `You add your ${this.toHit} bonus `;
                if(this.toHitExtra)
                    ret+= `+ ${this.toHitExtra} to the roll. `;
                else
                    ret+= `to the roll. `
            }
            else
            {
                if(this.toHitExtra)
                    ret+= `You add ${this.toHitExtra} to the roll. `;
                else
                    ret+= `You don't add any bonus to the roll.`
            } 
        }
        if(this.saveAbility !== undefined && this.saveAbility !== "None")
        {
            ret += `The targets roll a ${this.saveAbility} saving throw (Difficulty : ${this.saveDC}). `
            if(!this.successCancelsDamage)
            {
                ret += `Success will decrease damage in half. `
            }
            else
            {
                ret += `Success will negate damage. `
            }
        }
        return ret;
    }
    describeDamage()
    {
        let ret = ``;
        if(this.damage !== undefined  && this.damage != "0")
        {
            let d = ``;
            if(this.damageAbility && this.damageAbility != "None")
                d += `+ your ${this.damageAbility} bonus `
            if(this.damageExtra && this.damageExtra != "0")
                d += `+ ${this.damageExtra} `;

            if(this.damage[0] == "-"){let txt = this.damage.slice(1, this.damage.length)
                ret += `The target regains ${txt} ${d} hit points. `;}
            else
                ret += `The target looses ${this.damage} ${d} hit points from ${this.damageType} damage.  `
        }
        return ret;
    }
    describeUses()
    {
        let ret = ``;
        if(this.uses == "-1" && !this.pool)
        {
            ret += `You can use this action once per turn. `;
        }
        if(this.uses != "-1")
        {
            ret += `You can use this action ${this.uses} time(s) per combat. `;
        }
        if(this.pool)
        {
            if(this.expandsPool)
                ret += `You must expand one of your ${this.pool}. `
            else
                ret += `You must have a ${this.pool}. `
        }
        if(this.addCost)
        {
            ret += `Using this Action costs ${this.addCost} actions instead of 1.`;
        }
        return ret;
    }
    describeCondition()
    {
        let ret = ``;
        if(this.isVampiric)
        {
            ret += `You recuperate the amount of damage dealt by this Action.`; 
        }
        if(this.condition)
        {
            ret += `This Action gives the condition ${this.condition.name}. `

            let c = new Condition(this.condition);
            ret += `${c.describe()}`
        }
        return ret;
    }
}
class Condition
{
    constructor(args)
    {
        for(let key in args)
        {
            this[key] = args[key];
        }
        this.parse();
    }
    parse()
    {
        for(let key in this)
        {
            if(this[key] === "true")
            {
                this[key] = true;
            }
            else
            {
                if(key !== "damage") // Damage is often misread as an Integer because of `d` character being listed as valid (Thanks, JS)
                {
                    this[key] = Number.parseInt(this[key]) || this[key];
                    if(this[key] == "0"){ this[key] = 0; }
                }
            }
        }
    }
    
    clone()
    {
        let a ={}; 
        for(let key in this)
        {
            a[key] = this[key];
        }
        return a;
    }
    describe()
    {
        let ret = ``;
        // Save
        if(this.save)
        {
            ret += `The target makes a ${this.save} saving throw (Difficulty : ${this.saveDC}) to stop the Condition at the start of each of their turns. `; // Make sure we don't apply the thing.
        }
        //Duration
        if(this.duration !== -1 && this.duration !== 0 && !this.notDealt)
        {
            ret += `This condition has a duration of ${this.duration} turns. `;
        }
        if(this.duration == 0)
        {
            ret += `The target is affected until the start of their next turn. `
        }
        if(this.duration == -1)
        {
            ret += `This condition is applied at the start of each turn of combat. `
        }
        // Apply Damage if given (includes healing and Aura Effects for damage)
        if(this.damage && Number.parseInt(this.damage) != 0)
        {
            if(this.damage[0] == "-")
                ret += `The target regains ${this.damage} hit points. `;
            else
                ret += `The target looses ${this.damage} hit points. `;
        }
        // Condition modifies our movement speed (i.e. Difficult Terrain/ Expeditous Retreat Spell)
        if(this.moveMod)
        {
            ret += `The target's speed is modified by a factor of ${this.moveMod * 100}%. `;
        }
        // Condition gives us Resistances, Vulnerabilities or Immunities
        if(this.resistances)
        {
            let txt = this.resistances.slice(0, this.resistances.length - 2);
            ret += `The target gains resistance to ${txt} damage types. `;
        }
        if(this.vulnerabilities)
        {
            let txt = this.vulnerabilities.slice(0, this.vulnerabilities.length - 2);
            ret += `The target suffers vulnerability to ${txt} damage types. `;
        }
        if(this.immunities)
        {
            let txt = this.immunities.slice(0, this.immunities.length - 2);
            ret += `The target gains immunity to ${txt} conditions or damage types. `;
        }
        // Condition makes us skip the Turn (return is to ensure that we do so in this.startTurn() )
        if(this.skipTurn)
        {
            ret += `The target can't make actions for the duration. `;
        }
        // Modifies the amount of actions the troop will be able to do this turn. addAction is a *terrible* name.
        if(this.addAction)
        {
            ret += `The target regains ${this.addAction} actions. `;
        }
        // Modifies the AC of the Troop (i.e. Shield of Faith spell, Parry reaction, etc.). acBonus is a *terrible* name.
        if(this.acBonus)
        {
            if(this.acBonus[0] == "-")
            {
                ret += `The target looses ${-this.acBonus} armor class. `;
            }
            else
            {
                ret += `The target gains ${this.acBonus} armor class. `;
            }
        }
        // Adds some bonus to damage rolls
        if(this.damageBonus)
        {
            ret += `The target deals ${this.damageBonus} extra damage on each roll. `;
        }
        // Adds some bonus to attack rolls
        if(this.toHitBonus)
        {
            ret += `The target deals ${this.toHitBonus} extra damage on each roll. `;
        }
        // Makes this Troop part of another team
        if(this.charm)
        {
            ret += `The target is Charmed by you and joins your group. `;
        }
        // "Some Pool Name, 1" will add 1 unit to the Some Pool Name pool of actions. Used for Loading Crossbow.
        if(this.recharge)
        {
            let values = this.recharge.split(", ")
            ret += `The target regains ${values[1]} unit of their ${values[0]}. `;
        }
        if(this.rerollHit)
        {
            ret += `The target can reroll the attack roll if they rolled a ${this.rerollHit} on their initial roll. This is applied before any advantage / disadvantage. ` 
        }

        // Advantage and Disadvantage Conditions => See rollToHit function
        // Reckless Attack, Help, Dodge and so on...
        if(this.advantageHit)
        {
            ret += `The target gains advantage on attack rolls. `;
        }
        if(this.advantageTarget)
        {
            ret += `Attack rolls against the target have advantage. `;
        }
        if(this.disadvantageHit)
        {
            ret += `The target suffers disadvantage on attack rolls.`;
        }
        if(this.disadvantageTarget)
        {
            ret += `Attack rolls against the target have disadvantage. `;
        }
        if(this.saveAdvantage)
        {
            ret += `The target has advantage against ${this.saveAdvantage} saving throws. `
        }
        if(this.saveDisadvantage)
        {
            ret +=  `The target suffers disadvantage against ${this.saveDisadvantage} saving throws. `
        }
        if(this.evade)
        {
            ret += `If the target makes a ${this.evade} saving throw to reduce damage and succeeds, takes no damage. If the target fails the save, it takes half damage. ` 
        }
        return ret;
    }
}