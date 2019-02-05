let actionsAmount = 0;
let traitsAmount = 0;
let poolsAmount = 0;

function setup()
{
    writeEdit();
}
function sendData()
{
    let data = LocalData.getLocalStorage()
    let t = {};
    t.name =  document.querySelector("#name").value;
    t.source =  document.querySelector("#source").value;
    if(data[t.source] == undefined)
    {
        LocalData.createSource(t.source);
        data = LocalData.getLocalStorage();
    }
    t.type = document.querySelector("#type").value;
    t.radius = document.querySelector("#radius").value;
    t.size = document.querySelector("#size").value;
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
        let n = document.querySelector(`#pname${i}`);
        if(n != null)
        {
            n =document.querySelector(`#pname${i}`).value;
            if(n != "")
            {
                t.pools[n] = Number.parseInt(document.querySelector(`#ppoints${i}`).value);
            }
        }
    }
    t.actions = [];
    for(let i = 0; i < actionsAmount ; i++)
    {
        let a = {name: "Club", damage: "1d6", damageAbility : "Strength", damageExtra : 0, damageType : "Bludgeoning", toHit : "Strength", toHitExtra : 0, saveSkill: "None", saveDC : 0, target : "Enemy", uses : -1, onSuccess : false, reach:150, areaEffect : 1};
        let cond = { name :"None", duration: -1, damage : "0", save : "None", saveDC : 0, resistances : "", vulnerabilities : "", immunities:"" }
        for(let key in a)
        {
            if(document.querySelector(`#${key}${i}`) !== null )
            {
                a[key] = document.querySelector(`#${key}${i}`).value
                if(key == "reach")
                {
                    a[key] = Number.parseFloat(a[key]) * 100;
                }
                if(key == "onSuccess")
                    a[key] = document.querySelector(`#${key}${i}`).checked
            }

        }
        // Action uses pool
        if(document.querySelector(`#pool${i}`) !== null  && document.querySelector(`#pool${i}`).value != "")
        {
            a["pool"] = document.querySelector(`#pool${i}`).value;
        }
        //IF ACTION HAS CONDITION
        if(document.querySelector(`#cname${i}`) !== null && document.querySelector(`#cname${i}`).value != "" )
        {
            for(let key in cond)
            {
                if(document.querySelector(`#c${key}${i}`) !== null && document.querySelector(`#c${key}${i}`).value !== "")
                {
                    cond[key] = document.querySelector(`#c${key}${i}`).value;
                }
            }
            if(document.querySelector(`#cadditional${i}`) !== null && document.querySelector(`#cadditional${i}`).value !== "")
            {
                cond.additional = document.querySelector(`#cadditional${i}`).value;
                let a = document.querySelector(`#cadditionalValue${i}`).value;
                
                if(a == "true")
                    a = true;
                
                cond[cond.additional] = a
            }
            a.condition = cond;
        }
        if(document.querySelector(`#name${i}`) !== null )
            t.actions.push(a);
        //delete
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
        }
    }
    
    LocalData.addTroop(t.source, t);
}
function writeTroop(troop)
{
    let data = LocalData.getAllTroops();
    actionsAmount = 0;
    data.forEach(t => 
    {
        if(t.name == troop)
        {
            document.querySelector("#name").value = t.name;
            document.querySelector("#type").value = t.type;
            document.querySelector("#radius").value = t.radius;
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
                t.actions.forEach(a => {addAction(a);});
                actionsAmount = t.actions.length;
            }
            if(t.conditions)
            {
                t.conditions.forEach(t => addTrait(t));
                traitsAmount= t.conditions.length;
            }
            return t;
        }
    })
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
function addNewAction()
{
    let a = {name:"Club", damage: "1d6", damageAbility : "Strength", damageExtra : 0, damageType : "Bludgeoning", toHit : "Strength", toHitExtra : 0, saveSkill: "None", saveDC : 0, target : "Enemy", uses : -1, onSuccess : false, reach:150, areaEffect : 1};
    let cond = { name :"", additional : "", duration: -1 , damage : "0", save : "None", saveDC : 0, resistances : "", vulnerabilities : "" }

    a.condition = cond;
    addAction(a);
}
function addAction(values)
{
    let row = document.createElement("tr");
    row.id = `actionRow${actionsAmount}`;
    row.style = "border:1px solid rgb(250,180,60);"
    let skipt =``, succ = ``;
    let conditionHTML = `<th></th>`;
    if(values.condition)
    {
        let add = values.condition[values.condition.additional]
        if(!add)
        {
            add = "";
        }
        conditionHTML =  `<th>
                <input id="cname${actionsAmount}" type="text"  placeholder="Condition Name" value="${values.condition.name}" />
                <input id="cduration${actionsAmount}" type="number" value="${values.condition.duration}" />
                <input id="cdamage${actionsAmount}" placeholder="Damage Roll" type="text" value="${values.condition.damage}"/>
                <select id="csave${actionsAmount}" > ${writeAbilityScoreSelect(values.condition.save)}<br/>
                <input id="csaveDC${actionsAmount}" type="number" value="${values.condition.saveDC}"/> 

                <input id="cresistances${actionsAmount}" placeholder="Resistance, Resistance" type="text" value="${values.condition.resistances}" />
                <input id="cvulnerabilities${actionsAmount}" placeholder="Vulnerability, Vulnerability" type="text"  value="${values.condition.vulnerabilities}" />
                <input id="cimmunities${actionsAmount}" placeholder="Immunity, Immunity" type="text"  value="${values.condition.vulnerabilities}" />

                <input id="cadditional${actionsAmount}" placeholder="Additional Key" type="text" value="${values.condition.additional}" />
                <input id="cadditionalValue${actionsAmount}" placeholder="Additional Value" type="text" value="${add}" /> 
            </th>`
    }

    if(!values.pool)
        values.pool = "";
    if(values.onSuccess)
        succ = `checked`;
    row.innerHTML = `
    <th><input type="submit" onclick="removeAction(${actionsAmount})"  value="Delete"/></th>
    <th> <input type="text" id="name${actionsAmount}" value="${values.name}"> </th>
    <th> <input type="text" id="damage${actionsAmount}" value="${values.damage}"/> 
        <br/><select id="damageAbility${actionsAmount}" >${writeAbilityScoreSelect(values.damageAbility)} 
        <br/><input type="number" id="damageExtra${actionsAmount}" value="${values.damageExtra}"/>
        <br/><input type="text" id="damageType${actionsAmount}" value="${values.damageType}"/></th>
    <th><select id="toHit${actionsAmount}" >${writeAbilityScoreSelect(values.toHit)} 
        <br/><input type="number" id="toHitExtra${actionsAmount}" value="${values.toHitExtra}"/></th>
    <th><select id="saveSkill${actionsAmount}">${writeAbilityScoreSelect(values.saveSkill)}
        <br/><input type="number" id="saveDC${actionsAmount}" value="${values.saveDC}"/></th>
    <th> <select id="target${actionsAmount}" ><option value="${values.target}" > ${values.target}</option><option value="Enemy">Enemy</option><option value="Ally">Ally</option><option value="Point">Point</option><option value="Self">Self</option></select>
        <br/><input type="number" id="reach${actionsAmount}" value="${values.reach / 100}" />
        <br/><input type="number" id="areaEffect${actionsAmount}" value="${values.areaEffect}" /></th>
    <th> <input type="number" id="uses${actionsAmount}" value=${values.uses} /> 
        <input type="checkbox" id="onSuccess${actionsAmount}" ${succ}/>
        <input type="text" id="pool${actionsAmount}" value="${values.pool}" /> </th>    
    ${conditionHTML}    `;

    document.querySelector("#actionsTable").childNodes[1].append(row);
    actionsAmount ++;
}  
function removeAction(id)
{                
    let elt = document.querySelector(`#actionRow${id}`);
    let table =document.querySelector("#actionsTable").childNodes[1];
    table.removeChild(elt);
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


function writeEdit()
{
    let elt = document.querySelector("#edit");
    let data = LocalData.getAllTroops();
    data.forEach(troop =>
    {
        let e = document.createElement("option");
        e.value = troop.name;
        e.innerHTML = troop.name;
        elt.append(e);
    })
}
function writeConditionSelect(value)
{
    let elt;
    if(value != "None")
        elt = `<select id="conditions"> <option value="${value}"> ${value} </option> </select> `;
    else
        elt = `<select id="conditions"> <option value="None"> None </option> </select> `;

    return elt;
}
function writeAbilityScoreSelect(value)
{
    let elt;
    if(value != "None")
        elt = `<option value="${value}">${value}</option> <option value="None">None</option> <option value="Strength">Strength</option> <option value="Dexterity">Dexterity</option> <option value="Constitution">Constitution</option> <option value="Intelligence">Intelligence</option> <option value="Wisdom">Wisdom</option> <option value="Charisma">Charisma</option></select>`
    else
        elt = `<option value="None">None</option> <option value="Strength">Strength</option> <option value="Dexterity">Dexterity</option> <option value="Constitution">Constitution</option> <option value="Intelligence">Intelligence</option> <option value="Wisdom">Wisdom</option> <option value="Charisma">Charisma</option></select>`

    return elt;
}
