function writeGameLogs()
{
    if(game.gameLog)
    {
        let e = ``;
        for(let i = 0; i < game.gameLog.length; i++)
        {
            let log = game.gameLog[i]
            e += `<p> ${log} </p>`
        }
        let objDiv = document.querySelector(`#logsTab`)
        objDiv.innerHTML = e;
        document.querySelector(`#logsTab`).innerHTML = e;
        objDiv.scrollTop = objDiv.scrollHeight;

    }
}
function writeEncounterSelect()
{
    let data = LocalData.get("encounters", "All");
    let elt = `<option value="---" > ---</option>`;
    for(let i=0; i< data.length; i++) 
    {
        let enc = data[i];
        elt += `<option value="${i}" > ${enc.name} </option>` 
    }
    document.querySelector("#encounter").innerHTML= elt;
}
function writeGame(id)
{
    logs(`Launching local game n° ${id}.`);
    if(id !== "---")
    {
        let enc = LocalData.get("encounters", "All");
        let data = enc[id];
        logs(`-${data.name} is being setup.`);
        camera.setMap(data.mapSize)

        game.areas = [];
        data.areas.forEach(a => 
        {
            if(a.coloration)
                a.coloration = color(a.coloration.r, a.coloration.g, a.coloration.b, a.coloration.a);
            if(a.stk)
                a.stk = color(a.stk.r, a.stk.g, a.stk.b);
            a.shape = JSON.parse(a.shape);
            game.areas.push(a);
        })

        logs(`<br/>`);
        //logs(`Adding Players and their troops.`);
        // Write the Groups option and add the group's troops to the initiative order
        let elt =   `<option value="---" > --- </option>
                    <option value="GM"> GM </option>`;

        for(let i= 0; i< data.groups.length; i++) 
        {
            let group = data.groups[i];
            elt += `<option value="${group.name}" > ${group.name} </option>`;
            logs(` Adding <b style="color:rgb(${color(group.color).levels[0]}, ${color(group.color).levels[1]},${color(group.color).levels[2]});"> ${group.name} </b>`)
            group.troops.forEach(troop =>
            {
                troop.isPlayer = group.name;
                let t = new Troop(troop);
                logs(` - Setting up ${t.getHTMLName()} </b>`)
                t.startGame();
                game.initiativeOrder.push(t);
            })
            logs(`<br/>`)                
        }
        document.querySelector("#group").innerHTML= elt;

        game.round = 0;
        // Sorting initiative
        game.initiativeOrder = game.initiativeOrder.sort((a,b) => {return b.initiative - a.initiative;})
        game.currentIndex = 0;
        writeGameOrder(true);
        writeTroop(game.initiativeOrder[game.currentIndex]);
        logs(`<br/>`);
        logs(`Starting Game.`);
        game.initiativeOrder[game.currentIndex].startTurn();
        game.state = "Game";

        toggleTab("turn", "block");
        toggleTab("troop", "none");
        toggleTab("logs", "none")
    }
    else
    {
        toggleTab("troop", "none");
        toggleTab("turn", "none");
        toggleTab("logs", "none");
        document.querySelector("#group").innerHTML= `<option value="---"> --- </option>`;

    }
}
function writeGameOrder(a)
{
    let elt = document.querySelector(`#turnTab`);
    let tElt = ``;
    for(let i = game.currentIndex; i < game.initiativeOrder.length; i++)
    {
        let t = game.initiativeOrder[i];
        let unc = ` ( ${t.hitPoints.current} / ${t.hitPoints.maximum} ) `;
        if(t.hasCondition("name", "Unconcious"))
            unc = ` ( Unconcious ) `;

        tElt += `<div id="troop${i}" onclick="camera.setAnchor(game.initiativeOrder[${i}]);" onmouseout="focussedTroop = undefined;" onmouseover="focussedTroop = game.initiativeOrder[${i}];" style="cursor:pointer; font-size: 1rem; padding:0.5rem; padding-left:2rem; border-radius:2rem; background-color: rgba(0,0,0,0.7); color:rgb(${t.stk.levels[0]}, ${t.stk.levels[1]}, ${t.stk.levels[2]});" > ${t.name} - ${unc} </div>`
    }
    for(let i = 0; i < game.currentIndex; i++)
    {
        let t = game.initiativeOrder[i];
        let unc = ` ( ${t.hitPoints.current} / ${t.hitPoints.maximum} )`
        if(t.hasCondition("name", "Unconcious"))
            unc = ` ( Unconcious ) `
        tElt += `<div id="troop${i}" onclick="camera.setAnchor(game.initiativeOrder[${i}]);" onmouseout="focussedTroop = undefined;" onmouseover="focussedTroop = game.initiativeOrder[${i}];" style="cursor:pointer; font-size: 1rem; padding:0.5rem; padding-left:2rem; border-radius:2rem; background-color: rgba(0,0,0,0.7); color:rgb(${t.stk.levels[0]}, ${t.stk.levels[1]}, ${t.stk.levels[2]});" > ${t.name} - ${unc} </div>`
    }
    elt.innerHTML = tElt;
    document.querySelector("#page_content").append(elt);
}

/** Writes the Troop Menu element with the data from the Troop that's passed as an argument */
function writeTroop(troop)
{
    // Table with the Troop's data.
    let elt = ` <table style="width:100%; table-layout:fixed;" > 
                    <tr> 
                        <th style="color:rgb(240,180,60);"> Name </th>
                        <th style="color:rgb(240,180,60);"> Actions Left </th>
                        <th style="color:rgb(240,180,60);"> Hit Points </th>
                        <th style="color:rgb(240,180,60);"> Armor Class </th>
                    </tr>  
                    <tr style="font-size:1.3rem;"> 
                        <th> ${troop.getHTMLName()} </th>
                        <th> ${troop.actionsPerTurn - troop.actionsTaken}</th>
                        <th> ${troop.hitPoints.current} / ${troop.hitPoints.maximum} </th>
                        <th> ${troop.armorClass} </th> 
                    </tr>
                </table>`; 


    // Display Action buttons if we are the Troop's player 
    // IF statements are meant to find conditions NOT to display the button
    if(playerName == troop.isPlayer)
    {
        let tt = `game.initiativeOrder[game.currentIndex]`; // Reference the Troop.
        elt+= `<table id="actionsTable"><tbody> <tr>`;

        // We only allow to have buttons if we have actions left, otherwise we only have Next Turn;
        if(troop.actionsTaken < troop.actionsPerTurn) 
        {
            for(let i = 0; i < troop.actions.length; i++)
            {
                let a = troop.actions[i];

                // The action has uses left
                if(a.uses !== 0)
                {
                    // The pools for that actions are not empty
                    if (!a.pool || (a.pool && troop.pools[a.pool] !== 0) )
                    {
                        // If this action is meant to recharge a pool, only display if said pool is empty
                        if (!a.condition || !a.condition.recharge || (a.condition.recharge && troop.pools[a.condition.recharge.split(", ")[0]] == 0) )
                        {
                            // If the action costs more than what we can afford, don't display it
                            if(!a.useCost || (troop.actionsPerTurn - troop.actionsTaken - a.useCost >= 0) )
                            {
                                // If we haven't used the action before on this turn.
                                if(!a.hasBeenUsed)
                                {
                                    // We can't apply a condition to ourselves if we already have it
                                    if( a.target != "Self" || !a.condition || (a.target == "Self" && !troop.hasCondition("name", a.condition.name)) )
                                    {
                                        // Display the amount of uses we have left for the action
                                        let u = ``;
                                        if(a.uses != -1) { u += `(${a.uses})` }
                                        if(a.pool && troop.pools[a.pool] != -1) { u= `(${troop.pools[a.pool]})`; }
                                            
                                        // Define the behavior when we hover the button
                                        let hoverBehavior = `toggleTab('action', 'grid'); document.querySelector('#actionTab').innerHTML = ${tt}.getActionDescription(${i});`
                                        let hoverOutBehavior = `toggleTab('action', 'none'); document.querySelector('#actionTab').innerHTML = '';`
                                        // Dash is the only thing with a different behavior on Hover, but hey.
                                        if(a.name == "Dash"){ hoverBehavior += `hoverDash = true;`; hoverOutBehavior += `hoverDash = false;` }

                                        elt+=`<th> <input onmouseout="${hoverOutBehavior}"; onmouseover="${hoverBehavior}" class="actionButton" type="submit" value="${a.name} ${u}" onclick="actionInput=${i};" /> </th>`
                                    }
                                }
                            }
                        }
                    }                            
                }
            }
        }
        // Add the Next Turn button.
        elt += `<th> <input class="actionButton" style="background-color:rgb(255,255,255,0.7); color:rgb(50,50,50);" type="submit" value="End Turn" onclick="nextTurn();" /> </th>`;
        elt += `</tr></tbody></table>`
    }
    document.querySelector("#troopTab").innerHTML = elt;
}
function toggle(id)
{
    let e = document.querySelector(id);
    if( e.style )
    {
        if(e.style.visibility == "hidden")
        {
            e.style.visibility = "visible";
        }
        else
        {
            e.style.visibility = "hidden";
        }
    }
}