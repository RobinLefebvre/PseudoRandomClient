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
    let data = LocalData.getAllEncounters();
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
    if(this.id !== "---")
    {
        let enc = LocalData.getAllEncounters();
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
                logs(` - Setting up ${t.htmlName} </b>`)
                t.setup();
                game.initiativeOrder.push(t);
            })
            logs(`<br/>`)                
        }
        document.querySelector("#group").innerHTML= elt;

        // Sorting initiative
        game.initiativeOrder = game.initiativeOrder.sort((a,b) => {return b.initiative - a.initiative;})
        game.currentIndex = 0;
        writeGameOrder(true);
        writeTroop(game.initiativeOrder[game.currentIndex]);
        logs(`<br/>`);
        logs(`Starting Game.`);
        game.initiativeOrder[game.currentIndex].startTurn();
        game.state = "Game";

        toggleTab("turn");
        toggleTab("troop")
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
function writeTroop(troop)
{
    let elt = ` <table style="width:100%" > 
                    <tr> 
                        <th style="color:rgb(240,180,60);"> Name </th> 
                        <th style="color:rgb(240,180,60);"> Player </th>
                        <th style="color:rgb(240,180,60);"> Hit Points </th>
                        <th style="color:rgb(240,180,60);"> Armor Class </th>
                        <th style="color:rgb(240,180,60);"> Actions Left </th>
                    </tr>  
                    <tr style="font-size:1.2rem;"> 
                        <th> <b> ${troop.name}</b>  </th> 
                        <th> <b style="color:rgb(${troop.stk.levels[0]},${troop.stk.levels[1]},${troop.stk.levels[2]});" > ${troop.isPlayer}</b> </th> 
                        <th> ${troop.hitPoints.current} / ${troop.hitPoints.maximum} </th>
                        <th> ${troop.armorClass} </th> 
                        <th> ${troop.actionsPerTurn - troop.hasTakenAction}</th>
                    </tr>
                </table> `; 

    elt += `<hr/>`;

    if(playerName == troop.isPlayer)
    {
        elt+= `<table style="width:100%;" >`;
        if(troop.hasTakenAction < troop.actionsPerTurn)
        {
            let tt = `game.initiativeOrder[game.currentIndex]`;
            elt+=`<th> <input onmouseout="toggleTab('action'); document.querySelector('#actionTab').innerHTML = ''; hoverDash = false;"; onmouseover="toggleTab('action');  document.querySelector('#actionTab').innerHTML = ${tt}.getActionDescription(0); hoverDash = true;" style="width:100%; font-size:1rem; background-color:rgb(50,50,50); border:none;" type="submit" value="${troop.actions[0].name}" onclick="actionInput = 0;" /> </th>`
            for(let i = 1; i < troop.actions.length; i++)
            {
                let a = troop.actions[i];
                if(a.uses !== 0)
                {
                    if (!a.pool || (a.pool && troop.pools[a.pool] !== 0) )
                    {
                        if (!a.condition || !a.condition.recharge || (a.condition.recharge && troop.pools[a.condition.recharge.split(", ")[0]] == 0) )
                        {
                            if(a.uses == -1 || (a.uses != -1 && troop.actionsPerTurn - troop.hasTakenAction - a.uses >= 0) )
                            {
                                let u = ``;
                                    if(a.uses != -1)
                                    u+= `(${a.uses})`
                                if(a.pool && troop.pools[a.pool] != -1)
                                    u= `(${troop.pools[a.pool]})`;
                        
                                elt+=`<th> <input onmouseout="toggleTab('action'); document.querySelector('#actionTab').innerHTML = ''"; onmouseover="toggleTab('action');  document.querySelector('#actionTab').innerHTML = ${tt}.getActionDescription(${i})" style="width:100%; font-size:1rem; background-color:rgb(50,50,50); border:none;" type="submit" value="${a.name} ${u}" onclick="actionInput = ${i};" /> </th>`
                            }
                            }
                    }                            
                }
            }
        }
        elt += `<th> <input style="width:100%; font-size:1rem; background-color:rgb(255,255,255,0.5); color:rgb(50,50,50); border:none;" type="submit" value="End Turn" onclick="nextTurn();" /> </th>`;
        elt += `</tr></table>`
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