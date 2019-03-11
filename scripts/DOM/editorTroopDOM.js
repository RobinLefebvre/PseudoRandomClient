let poolsAmount = 0;

let selectedActions = [];
let actions = [];
const actionKeys = ["name", "uses", "reach", "areaEffect", "target",  "pool", "expandsPool","toHit", "toHitExtra", "onSuccess", "targetsUnconcious", "addCost", "damage", "damageAbility", "damageExtra", "damageType", "saveAbility", "saveDC", "saveCancelsDamage", "isVampiric"]

let selectedConditions = [];
let conditions = []
const conditionKeys = ["name", "duration", "notDealt", "save", "saveDC", "damage", "moveMod", "resistances", "immunities", "vulnerabilities", "skipTurn", "addAction", "acBonus", "damageBonus", "toHitBonus", "charm", "recharge", "evade", "saveAdvantage", "saveDisadvantage", "advantageHit","disadvantageHit", "advantageTarget", "disadvantageTarget", "rerollHit", "rerollDamage", "areaEffect", "target"];

let traitsAmount = 0;
let traits = [];

// Setup runs on load
function setup()
{
    writeTroopSelect();
    rewriteActionsHTML();
}

// Packages all the data from the Form and inputs it into an Object, ready to be saved.
function sendData()
{
    let t = {};
    t.name =  document.querySelector("#name").value;
    t.source =  document.querySelector("#source").value;

    t.type = document.querySelector("#type").value;
    t.size = document.querySelector("#size").value;

    t.dimension = {x :document.querySelector("#radius").value, y : document.querySelector("#radius").value};
    t.armorClass = document.querySelector("#armorClass").value;
    t.hitPoints = {
        dieAmount :  document.querySelector("#hpamount").value,
        dieType :  document.querySelector("#hptype").value,
        bonus : document.querySelector("#hpBonus").value,
    };
    t.hitPoints.formula = `${t.hitPoints.dieAmount}d${t.hitPoints.dieType}+${t.hitPoints.bonus}`
    t.abilityScores = 
    {
        "Strength": {"score": document.querySelector("#StrengthScore").value, "bonus": document.querySelector("#StrengthBonus").value},
        "Dexterity": {"score": document.querySelector("#DexterityScore").value, "bonus": document.querySelector("#DexterityBonus").value},
        "Constitution": {"score": document.querySelector("#ConstitutionScore").value, "bonus": document.querySelector("#ConstitutionBonus").value },
        "Intelligence": {"score": document.querySelector("#IntelligenceScore").value, "bonus": document.querySelector("#IntelligenceBonus").value },
        "Wisdom": {"score": document.querySelector("#WisdomScore").value, "bonus": document.querySelector("#WisdomBonus").value},
        "Charisma": {"score": document.querySelector("#CharismaScore").value, "bonus": document.querySelector("#CharismaBonus").value }
    }
    t.speed = document.querySelector("#speed").value * 100; 
    t.actionsPerTurn = document.querySelector(`#actionsPerTurn`).value
    t.turnsAmount = document.querySelector(`#turnsAmount`).value

    t.pools = {};
    for(let i = 0; i < poolsAmount; i++)
    {
        let name = document.querySelector(`#pname${i}`); let points = document.querySelector(`#ppoints${i}`);
        if(name != null && name.value != "" && points !== null)
        {
            t.pools[name.value] = Number.parseInt(points.value);
        }
    }

    t.actions = [];
    for(let i = 0; i < actions.length; i++)
    {
        let a = clone(actions[i]);
        if(conditions[i] && conditions[i] !== {})
        {
            a.condition = conditions[i];
            addActionOrConditionToLocal("condition", conditions[i])
        }
        t.actions.push(a);
        addActionOrConditionToLocal("action", a)
    }

    t.conditions = [];
    for(let i = 0; i < traitsAmount ; i++)
    {
        let cond = { name :"None", damage : "0", resistances : "", vulnerabilities : "", immunities : "" }
        for(let key in cond)
        {
            if(document.querySelector(`#t${key}${i}`) !== null && document.querySelector(`#t${key}${i}`).value !== "" )
            {
                cond[key] = document.querySelector(`#t${key}${i}`).value;
            }
            if(document.querySelector(`#tadditional${i}`) !== null && document.querySelector(`#tadditional${i}`).value !== "")
            {
                cond.additional = document.querySelector(`#cadditional${i}`).value;
                cond[cond.additional] = document.querySelector(`#cadditionalValue${i}`).value
            }
        }
        cond.duration = -1;
        if(document.querySelector(`#tname${i}`) !== null && document.querySelector(`#tname${i}`).value !== "")
        {
            t.conditions.push(cond);
            addActionOrConditionToLocal("condition", cond)
        }
    }

    // Actual storage of the Troop
    let data = LocalData.getLocalStorage()
    if(data[t.source] == undefined)
    {
        LocalData.createSource(t.source);
        data = LocalData.getLocalStorage();
    }
    LocalData.add(t.source, "troops", t);
}
// Verifies whether we have the data in localStorage, and adds it to the right place.
function addActionOrConditionToLocal(actionOrCondition, data)
{
    if(actionOrCondition == "action")
    {
        let actData = LocalData.get("actions", "All");
        let flag = false;
        actData.forEach(act => {if(act.name == data.name){flag = true;}})
        if(!flag)
            LocalData.add(t.source, "actions", data);
    }
    else if(actionOrCondition == "condition")
    {
        let condData = LocalData.get("conditions", "All");
        let flag = false;
        condData.forEach(cond => {if(!data.name || data.name == cond.name){flag = true;}})
        if(!flag)
            LocalData.add(t.source, "conditions", data);
    }
    
}

// Write the data for the Troop at given localStorage Index.
function writeTroop(troopIndex)
{
    actionsAmount = 0;
    let troopData = LocalData.get("troops", "All");
    let t = troopData[troopIndex];
    document.querySelector("#name").value = t.name;
    document.querySelector("#type").value = t.type;

    if(t.radius)
        document.querySelector("#radius").value = t.radius;
    if(t.dimension)
        document.querySelector("#radius").value = t.dimension.x;
    document.querySelector("#size").value = t.size;
    document.querySelector("#armorClass").value = t.armorClass;
    document.querySelector("#hpamount").value = t.hitPoints.dieAmount,
    document.querySelector("#hptype").value = t.hitPoints.dieType,
    document.querySelector("#hpBonus").value = t.hitPoints.bonus;

    for(let score in t.abilityScores)
    {
        document.querySelector(`#${score}Score`).value = t.abilityScores[score].score;
        document.querySelector(`#${score}Bonus`).value = t.abilityScores[score].bonus;
    }
    document.querySelector("#speed").value = floor(t.speed / 100); 
    document.querySelector("#actionsPerTurn").value = t.actionsPerTurn;        
    document.querySelector("#turnsAmount").value = t.turnsAmount;                     

    if(t.pools)
    {
        let i = 0;
        for(let p in t.pools)
        {
            addPool({name : p, points : t.pools[p]})
            i++;
        }
        poolsAmount = i;
    }
    if(t.actions)
    {
        t.actions.forEach(a => {a.timestamp = undefined;});
        let conds = [];
        for(let i = 0; i < t.actions.length; i++)
        {
            if(t.actions[i].condition)
            {
                t.actions[i].condition.timestamp = undefined;

                conds[i] =  clone(t.actions[i].condition);
                t.actions[i].condition = undefined;
            }
        }
        actions = t.actions;
        conditions = conds;
        actionsAmount = t.actions.length;
        rewriteActionsHTML()
    }
    if(t.conditions)
    {
        t.conditions.forEach(t => addTrait(t));
        traitsAmount= t.conditions.length;
    }
    return t;
}

function writeAbilityScore()
{
    let abilityScores = 
    {
        "Strength": {"score" : document.querySelector("#StrengthScore").value},
        "Dexterity": {"score" : document.querySelector("#DexterityScore").value},
        "Constitution": {"score" : document.querySelector("#ConstitutionScore").value},
        "Intelligence": {"score" : document.querySelector("#IntelligenceScore").value },
        "Wisdom": {"score" : document.querySelector("#WisdomScore").value},
        "Charisma": {"score" : document.querySelector("#CharismaScore").value}
    }
    for(let ability in abilityScores)
    {   
        if(abilityScores[ability].score)
        {
            abilityScores[ability].bonus = floor((abilityScores[ability].score - 10) / 2);
            document.querySelector(`#${ability}Bonus`).value = abilityScores[ability].bonus;
        }
        else
        {
            abilityScores[ability].bonus = document.querySelector(`#${ability}Bonus`).value;
            abilityScores[ability].score = (abilityScores[ability].bonus * 2) + 10;
            document.querySelector(`#${ability}Score`).value = abilityScores[ability].score;
        }
    }
}

// Rewrites the whole <div> that holds the list of actions
function rewriteActionsHTML()
{
    let elt = `<div id="actionsList">  <input type="submit" value="Add Action" onclick="addNewAction()" />`
    for(let act = 0; act < actions.length; act ++)
    {
        let action = actions[act];

        let hidden = false;
        let htmlElt = document.querySelector(`#action${act}`) 
        if(htmlElt != null && htmlElt.style.display == "none" ){ hidden =true; }

        elt += `<div class="holder">
            <h4 style="cursor:pointer;" onclick="toggleHolder(${act})"> ${action.name} </h4> 
            ${getActionOrConditionSelect('action', act)} 
            <input type="submit" value="Delete" onclick="deleteAction(${act})"/> 
            ${getActionHTML(act, hidden)} </div>`;
        elt += `<br />`
    }
    elt += `</div>`
    document.querySelector("#actionsHolder").innerHTML = elt;
}

// Toggles the visibility on an Action's attribute tweaking
function toggleHolder(actionIndex)
{
    let elt = document.querySelector(`#action${actionIndex}`);
    if(elt.style.display !== "none"){ elt.style.display = "none" }
    else{ elt.style.display = "grid" }
}

// Adds a new action to the list
function addNewAction()
{
    actions.push({"name": "Action", "uses" : -1, "target" : "Self", "reach" : 10, "areaEffect" : 1});
    conditions.push({})
    rewriteActionsHTML();
}

// Deletes an action and its associated condition
function deleteAction(actionIndex)
{
    actions.splice(actionIndex, 1);
    conditions.splice(actionIndex, 1);
    rewriteActionsHTML();
}

// Returns the whole HTML <div> that holds an Action element (Form that allows to add and modify attributes of the action).
function getActionHTML(actionIndex, hidden)
{
    let action = actions[actionIndex];
    let condition = conditions[actionIndex];
    let a = clone(action);
    a.condition = condition;
    a = new Action(a);

    let h = ``
    if(hidden)
        h = `style="display:none;"`

    let elt = `<div class="attributesHolder" id="action${actionIndex}" ${h} >`
        elt += `<p class="explanation"> ACTION DESCRIPTION -  ${a.describe(true)}</p>`
    for(let key in action)
    {
        if(action[key] !== undefined)
        {
            elt += getAttributeSelect('action', key, actionIndex)
            elt += `<input type="text" value="${actions[actionIndex][key]}" id="value_${key}" onchange="changeAttributeValue('action', '${key}', ${actionIndex}, this.value)" />`
            elt += `<input type="submit" value="Delete" id="delete_${key}" onclick="deleteAttribute('action', '${key}', ${actionIndex});" />`
        }
    }
    elt += `<p class="fullRow"> </p>`
    elt+= `<input type="submit" value="Add Attribute" onclick="addAttribute('action', ${actionIndex})" />`
    elt += `<p class="fullRow"> </p>`

    elt += `<div class="attributesHolder" id"condition" > <h4> Condition </h4> ${getActionOrConditionSelect('condition', actionIndex)}  <input type="submit" value="Local Save" onclick="saveAction('condition', ${actionIndex})" />`;
        elt += `<p class="explanation"> CONDITION DESCRIPTION -  ${a.describeCondition()} </p>`
    for(let key in condition)
    {
        if(condition[key] !== undefined)
        {
            elt += getAttributeSelect('condition', key, actionIndex)
            elt += `<input type="text" value="${condition[key]}" id="value_${key}"  onchange="changeAttributeValue('condition', '${key}', ${actionIndex}, this.value)" />`
            elt += `<input type="submit" value="Delete" id="delete_${key}" onclick="deleteAttribute('condition', '${key}', ${actionIndex});" />`
        }
    }
    elt+= `<input type="submit" value="Add Condition Attribute" onclick="addAttribute('condition', ${actionIndex})" />`
    elt += `</div>`;
    elt += `</div>`;
    return elt;
}

// Returns a <select> element's HTML containing the list of all Actions/Conditions within localStorage
function getActionOrConditionSelect(actionOrCondition, actionIndex)
{
    let elt = `<select onchange="reloadAction('${actionOrCondition}', this.value, ${actionIndex})"> <option value="undefined"> --- </option>`
    if(actionOrCondition == "action")
    {
        let data = LocalData.get("actions", "All");
        for(let i = 0; i < data.length; i++)
        {
            let act = data[i];

            if(selectedActions[actionIndex] && selectedActions[actionIndex] == i)
                elt += `<option value="${i}" selected="selected"> ${act.name} </option>`;
            else
                elt += `<option value="${i}"> ${act.name} </option>`;
        }
    }
    else if(actionOrCondition =="condition")
    {
        let data = LocalData.get("conditions", "All");
        for(let i = 0; i < data.length; i++)
        {
            let cond = data[i];

            if(selectedConditions[actionIndex] && selectedConditions[actionIndex] == i)
                elt += `<option value="${i}" selected="selected"> ${cond.name} </option>`;
            else
                elt += `<option value="${i}"> ${cond.name} </option>`;
        }
    }
    elt += `</select>`;
    return elt;
}

// Resets the Action at actionIndex. Its values are set to ones of the localStorage action at ID
function reloadAction(actionOrCondition, id, actionIndex)
{
    if(id)
    {
        if(actionOrCondition == "action")
        {                        
            let data = LocalData.get("actions", "All");
            actions[actionIndex] = data[id];
            if(data[id].condition){
                conditions[actionIndex] = data[id].condition;
            }
            selectedActions[actionIndex] = id;
        }
        else if(actionOrCondition =="condition")
        {
            let data = LocalData.get("conditions", "All");
            conditions[actionIndex] = data[id];
            selectedConditions[actionIndex] = id;
        }
        rewriteActionsHTML(); 
    }
}

// Adds a new attribute to an action or a condition ( following the global actionKeys and conditionKeys arrays, minus the ones already defined )
function addAttribute(actionOrCondition, actionIndex)
{
    if(actionOrCondition == "action")
    {
        let firstKey = "name";
        for(let i = 0; i < actionKeys.length; i++)
        {
            let k = actionKeys[i];
            if(actions[actionIndex][ k ] == undefined )
            {
                firstKey = k;
                break;
            }
        }
        actions[actionIndex][firstKey] = "";
    }
    else if(actionOrCondition =="condition")
    {
        let firstKey = "name";
        for(let i = 0; i < conditionKeys.length; i++)
        {
            let k = conditionKeys[i];
            if(conditions[actionIndex][ k ] == undefined )
            {
                firstKey = k;
                break;
            }
        }
        conditions[actionIndex][firstKey] = "";
    }
    rewriteActionsHTML();
}

// Switches the value of an attribute within an Action/Condition to the new value
function changeAttributeValue(actionOrCondition, key, actionIndex, value)
{
    if(actionOrCondition == "action")
    {
        actions[actionIndex][key] = value;
    }
    else if(actionOrCondition =="condition")
    {
        conditions[actionIndex][key] = value;
    }
    rewriteActionsHTML();
}

// Deletes the value from the Actions/Condition 
function deleteAttribute(actionOrCondition, key, actionIndex)
{
    if(actionOrCondition == "action")
    {
        actions[actionIndex][key] = undefined;
    }
    else if(actionOrCondition =="condition")
    {
        conditions[actionIndex][key] = undefined;
    }
    rewriteActionsHTML();
}

// Switches one attribute to another when we change value on the <select>
function switchAttribute(actionOrCondition, from, to, actionIndex)
{
    if(actionOrCondition == 'action')
    {
        actions[actionIndex][from] = undefined;
        actions[actionIndex][to] = "";
    }
    else if (actionOrCondition == 'condition')
    {
        conditions[actionIndex][from] = undefined;
        conditions[actionIndex][to] = "";
    }
    rewriteActionsHTML();
}

// Returns a <select> element with the possible attributes to be selected for the Action/Condition
function getAttributeSelect(actionOrCondition, value, actionIndex)
{
    let obj;
    let checkList;
    let id = "";
    if(actionOrCondition == 'action')
    {
        if(!value)
            id = actionKeys[actions[actionIndex].length];
        else
            id = value;

        obj = actionKeys;
        checkList = actions[actionIndex];
    }
    else if(actionOrCondition == 'condition')
    {
        if(!value)
            id = conditionKeys[conditions[actionIndex].length];
        else
            id = value;

        obj = conditionKeys;
        checkList = conditions[actionIndex];
    }

    let elt = `<select id="${id}" onchange="switchAttribute('${actionOrCondition}', '${id}', this.value, ${actionIndex})">`
    obj.forEach(key =>
    {
        let s = ``;
        if(value && key == value)
            s = `selected="selected"`;
        
        let opt = `<option value="${key}" ${s}> ${key} </option> `;

        let writeFlag = true;
        for(let haveKey in checkList)
        {
            if(key == haveKey && haveKey != value)
                writeFlag = false
        }
        if(writeFlag)
            elt += opt;
    });

    return elt;
}

function addNewTrait()
{
    let cond = { name :"Regenerate", additional : "", damage : "-10d1", resistances : "", vulnerabilities : "", immunities : "" }
    addTrait(cond);
}

function addTrait(trait)
{
    let row = document.createElement("tr");
    row.id = `traitRow${traitsAmount}`;
    row.innerHTML = 
        ` <th><input type="submit" value="Delete" onclick="removeTrait(${traitsAmount});" /></th>
        <th><input id="tname${traitsAmount}" type="text"  placeholder="Condition Name" value="${trait.name}" /></th>
        <th><input id="tdamage${traitsAmount}" placeholder="Damage Roll" type="text" value="${trait.damage}"/></th>
        <th><input id="tresistances${traitsAmount}" placeholder="Resistance, Resistance" type="text" value="${trait.resistances}" />
        <input id="tvulnerabilities${traitsAmount}" placeholder="Vulnerability, Vulnerability" type="text"  value="${trait.vulnerabilities}" /> 
        <input id="timmunities${traitsAmount}" placeholder="Immunity, Immunity" type="text"  value="${trait.immunities}" /> </th>
        <th><input id="tadditional${traitsAmount}" placeholder="Additional Key" type="text" value="${trait.additional}" />
            <input id="tadditionalValue${traitsAmount}" placeholder="Additional Value" type="text" value="" /> </th>`
    

    document.querySelector("#traitsTable").childNodes[1].append(row);
    traitsAmount++;
}

function removeTrait(id)
{                
    let elt = document.querySelector(`#traitRow${id}`);
    let table =document.querySelector("#traitsTable").childNodes[1];
    table.removeChild(elt);
}

function addNewPool()
{
    let p = {name:"Spell Slots 1", points:"2"};
    addPool(p);
}

function addPool(pool)
{
    let row = document.createElement("tr");
    row.id = `poolsRow${poolsAmount}`;
    row.innerHTML = 
    `<th><input type="submit" value="Delete" onclick="removePool(${poolsAmount});" /></th>
    <th><input id="pname${poolsAmount}" type="text"  placeholder="Pool's Name" value="${pool.name}" /></th>
    <th><input id="ppoints${poolsAmount}" type="number" value="${pool.points}" /></th>`;

    document.querySelector("#poolsTable").childNodes[1].append(row);
    poolsAmount ++;
}

function removePool(id)
{
    let elt = document.querySelector(`#poolsRow${id}`);
    let table =document.querySelector("#poolsTable").childNodes[1];
    table.removeChild(elt); 
}

// Switches back and forth between the Troop and Actions Panels on the HTML
function toggleTroopTab(id)
{
    let troop = document.querySelector("#troopCreation");
    let troopButt = document.querySelector(`#troopTabToggle`);
    let act = document.querySelector("#actionEdit");
    let actButt = document.querySelector(`#actionsTabToggle`);
    if(id == "actionsTabToggle")
    {
        troopButt.style.textDecoration= "none";
        actButt.style.textDecoration = "underline";

        troop.style.display = "none";
        act.style.display = "grid";
    }
    else
    {
        troopButt.style.textDecoration= "underline";
        actButt.style.textDecoration = "none";

        troop.style.display = "grid";
        act.style.display = "none";
    }
}

// Returns a <select> element with each Troop of the localStorage.content.troops array
function writeTroopSelect()
{
    let troopData = LocalData.get("troops", "All");
    let elt = document.querySelector("#edit");
    for(let i = 0; i < troopData.length; i++)
    {
        let troop = troopData[i];
        let e = document.createElement("option");
        e.value = i;
        e.innerHTML = troop.name;
        elt.append(e);
    }
}

// May be used for input on Actions.
function writeAbilityScoreSelect(value)
{
    let abilityScores = {"Strength" : "","Dexterity" : "","Constitution": "","Intelligence": "","Wisdom": "","Charisma": ""}

    let elt;
    if(value == "None")
        elt = `<option value="None">None</option> <option value="Strength">Strength</option> <option value="Dexterity">Dexterity</option> <option value="Constitution">Constitution</option> <option value="Intelligence">Intelligence</option> <option value="Wisdom">Wisdom</option> <option value="Charisma">Charisma</option></select>`
    else
    {
        elt = `<option value="None">None</option>`
        for(let key in abilityScores)
        {
            elt += `<option value="${key}" `
            if(key == value){ elt += `selected="selected" >`}
            else {elt += `>`}
            elt += `${key} </option>`
        }
    }
    return elt;
}

function writeTargetSelect(value)
{
    let targets = ["Ally", "Enemy", "Self", "Point"];
    let elt;
    for(let i = 0; i<targets.length;i++)
    {
        elt += `<option value="${targets[i]}" `;
        if(value == targets[i]){ elt += `selected="selected" > ${targets[i]} </option>`}
        else { elt += `> ${targets[i]} </option>`}
    }
    return elt;
}