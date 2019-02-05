

/**Functions dumped in a file.
 *  Used for DOM edition in encounterEditor.html */

 /**displayEdit displays all the possible Encounters available in localStorage into a HTML element.  */
 function displayEdit()
 {
     let ret = `<option value=""> --- </option>`;
     let d = LocalData.getAllEncounters();
 
     for(let i = 0; i < d.length; i++)
     {
         enc = d[i];
         ret += `<option value="${i}" > ${enc.name} </option>`; 
     }
     
     document.querySelector(`#edit`).innerHTML = ret;
 }
 
  /**writeExplanation displays a message of explanation from onmouseover message
   * @param {String} value : the message to be displayed 
   * @param {Integer} id : the id number of #explanation${id} HTML element */
 function writeExplanation(value, id)
 {
     let elt = document.querySelector(`#explanations${id}`);
     let write = `<p>`; 
     switch(value)
     {
         // GENERAL TAB TIPS
         case "edit":
             write = "<b> Edit Encounter : </b><br/> Select an encounter to copy for editing.";
             break;
         case "name":
             write = "<b> Encounter Name : </b><br/>Sets the name for the encounter. <br/><br/>  By Default, the encounter will save under the name 'Default Encounter'.<br/><br/> If you insert the name of an already existing Encounter, it will instead add '- Copy' at the end of that Encounter's name. <br/> ";
             break;
        case "source":
             write = "<b> Source : </b><br/> The Source name under which to save this encounter. <br/>  By Default, the encounter will save under the Default source. <br/> ";
             break;
         case "radius":
             write = "<b> Map Radius : </b><br/> The size of this encounter's map radius. <br/> <br/> The value is in meters, so two floating point numbers are acceptable. <br/> <br/> The default value makes a map of 15 meters in radius with its center at {15, 15}. This means all coordinates between {0, 0} to {3000, 3000} become accessible (100 coordinates per meter). <br/><br/> The Camera zoom boundaries are set to this value.";
             break;
         case "groupsAmount":
             write = "<b> Groups Amount : </b><br/> The amount of groups involved in this encounter. <br/> Think of this as Player + NPC count.";
             break;
         case "gameType":
             write = "<b> Game Type : </b><br/> Select the type of game you wish to create.";
             break;
         case "encounterDesc":
             write = "<b> Encounter Description : </b><br/> You know. Be creative.";
             break;
        case "gridDisplay" :
             write = "<b> Grid Display : </b><br/> Check the box to have the grid on the map. <br/> Number determines the size of each cell on the grid. <br/><br/> 'Murican tip : Setting this to 150 is equivalent to having a 5ft. grid. ";
             break;

        // AREAS TAB
        case "editArea":
            write = "<b> Add Area : </b><br/> <br/> Adds an Area to the map. <br/> An Area can be multiple things : a map element, an item, or a shape that helps set the map. <br/><br/> Areas can be obstacles, they can inflict conditions such as damage or movement penalty. But they can simply be visual  <br/>";
            break;

        case "areaName":
            write = "<b> Area Name : </b><br/> <br/> Text to be displayed on top of the Area.";
            break;
        
        case "areaPos":
            write = "<b> Area Position : </b><br/> <br/> Sets the center position for the Polygon creation to start building.";
            break;

        case "areaPointsPos":
             write = "<b> Points of the Area : </b><br/> <br/> You can see a table of each Point within the shape with it's X and Y coordinates. <br/> </p><p>Precision here is in clicks (cm.).<br/></p><p> Did you know you could drag them ? ";
             break; 
         case "areaSeePoints":
             write = "<b> See Area Points :  </b><br/> <br/> Toggles the display of the points for this area. ";
             break;  
         case "areaRandom":
             write = "<b> Randomness Factor : </b><br/> For the polygon, sets a fraction by which to apply randomness.<br/> - 0 means a regular polygon <br/> - 0.5 implies that each point is at least 50% of the radius + some random amount.";
             break;  
         case "areaRadius":
             write = "<b> Area Radius : </b><br/> <br/> Determines the distance from the center which the Polygon creation uses to draw the Area.";
             break; 
         case "areaPoints":
             write = "<b> Points Amount : </b><br/> <br/> Determines the amount of points the Polygon creation will draw. <br/> 4 makes a square, 6 makes a hexagon.";
             break; 
         case "areaRedraw":
             write = "<b> Redraw Button : </b><br/> <br/> Yup, this will redraw the Area using the Position, Amount of points and Radius you entered. <br/> <b> Beware if you dragged stuff. Don't press here.</b> ";
             break;
         case "areaDelete":
             write = "<b> Delete Area : </b><br/> <br/> Well. You know.";
             break; 
         case "areaColor":
             write = "<b> Area Color : </b><br/> <br/> Determines the color for the Area. <br/> I vow to making the Alpha value easier to use.";
             break; 
         case "areaClone":
             write = "<b> Clone Area : </b><br/> <br/> Creates a new clone with the same Polygon generation as this one. <br/> Doesn't copy the dragged points.";
             break; 
         case "areaAlpha":
             write = "<b> Area Transparency : </b><br/> <br/> Determines transparency for the area's color.";
             break; 
     }
     write += `</p>`;
     elt.innerHTML = write;
 }
 
  /**writeGroups displays a message of explanation from onmouseover message
   * @param {String} holderID : the holder element's ID */
 function writeGroups(holderID, groupNames)
 {
     let elt = document.querySelector(`#${holderID}`);
     elt.innerHTML = "";
     for(let i = 0; i < groupsAmount; i++)
     {
        let name; 
        if(groupNames && groupNames[i])
         {
            name = `${groupNames[i]}`;
         }
         else 
            name = `Group ${i+1}`; 
         let partyHolder = document.createElement("div");
         partyHolder.id = `group${i}`;
         partyHolder.style = `border-right :1px solid rgb(250, 180, 60);`
         partyHolder.innerHTML += 
             `<input type="text" id="name${i}" value="${name}">  
             <input style="margin-left:1rem;" type="color" id="color${i}" value="#FFFFFF" />
             <input style="margin-left:1rem;" type="submit" value="Add Troop" onclick="addTroop(${i})" />
             <input style="margin-left: 2rem; type="text" value="" />`
         
         let troopsHolder = document.createElement("div");
         troopsHolder.id = `holder${i}`;
         troopsHolder.style = `width : 95%; margin : auto; border-top : 1px solid rgb(250, 180, 60); border-right :1px solid rgb(250, 180, 60); `
         partyHolder.append(troopsHolder);
 
         elt.append(partyHolder);
         if(groups[i])
         {
             writeTroops(i);
         }
         elt.append(partyHolder);
     }
 }
 
 /** Write troops div from the group
  * @param {*} group : the group's key in the troops object*/
 function writeTroops(group)
 {
     let holder = document.querySelector(`#holder${group}`);
     holder.innerHTML = ``;
     // For each troop
     for(let ind = 0; ind < groups[group].troops.length; ind++)
     { 
         // If we can't find the troop in the DOM, we add a new Troop
         if(document.querySelector(`#name${group}_${ind}`) == null)
         {   
             let t = groups[group].troops[ind];
            
             let troopSelect = document.createElement("div");
             troopSelect.id = `troop${group}_${ind}`;
             let troopOption = `<option value="${t.name}"> ${t.name} </option>`;

             LocalData.getAllTroops().forEach(troop => 
             {
                 if(troop.name != t.name)
                    troopOption += `<option value="${troop.name}"> ${troop.name} </option>`;
             });
 
             
             troopSelect.innerHTML = `<select id="name${group}_${ind}" onchange="editTroop(${group}, ${ind})"> ${troopOption} </select>`;
             troopSelect.innerHTML +=   `Position X : <input style="width:5rem;" type="number" id="posX${group}_${ind}" min=0 max=${camera.mapBoundaries.max / 100} value=${floor(t.position.x / 100)} onchange="editTroop(${group}, ${ind})"> |
                                         Position Y : <input style="width:5rem;" type="number" id="posY${group}_${ind}" min=0 max=${camera.mapBoundaries.max / 100} value=${floor(t.position.y / 100)}  onchange="editTroop(${group}, ${ind})"> |
                                         <input type="submit" onclick="deleteTroop(${group}, ${ind})" value="DELETE" />
                                         ${writeTroopActionSelect(group, ind)}`;
             troopSelect.style = "padding-top : 0.5rem;border-bottom : 1px solid rgb(250,180,60);"
 
             holder.append(troopSelect);
         }
     }
 }
function writeTroopActionSelect(group, id)
{
    let elt = `<select id="troopActionSelect${group}_${id}" >  <option value="None"> ----- </option><option value="Move"> Movement </option>`;
    for (let i = 0; i < groups[group].troops[id].actions.length; i++)
    {
        let a = groups[group].troops[id].actions[i];
        elt = `${elt} <option value="${i}"> ${a.name} </option>`
    }
    elt = `${elt} </select>`;

    return elt;
}
/** AREAS START */
/** Toggler for the Polygon holder for an Area */
 function toggleAreaHolder(id)
 {
     let e = document.querySelector(`#areaH${id}`);
     if(e.style.display == "block")
     {
         e.style.display = "none";
     }
     else
     {
         e.style.display = "block";
     }
 }

/** Writes all the areas from areas global object into the dom */
 function writeAreas()
 {
     let holder = document.querySelector("#areaHolder");
     holder.innerHTML = "";
 
     for(let id = 0; id < areas.length; id++)
     {
        writeArea(id, areas[id]);
     }
 }

/** Writes a given area onto the DOM  */
function writeArea(id, area)
{
    let elt = document.querySelector("#areaHolder");
    let n = document.createElement("div");
    let name = area.name || ``;
    let col = rgbToHex(area.coloration.levels[0], area.coloration.levels[1], area.coloration.levels[2]);
    let pos = createVector(area.position.x / 100, area.position.y / 100);
    let radius = area.radius;
    let pointsAmount = area.pointsAmount;
    let randomize = area.randomize;
    let obstacle = (area.isObstacle) ? `checked` : ``;
    let animated = (area.animated) ? `checked` : ``;
    let alpha = 255-area.coloration.levels[3];

    n.id = id;
    n.innerHTML = `<div id="areaData${n.id}" style="cursor: pointer; border-bottom: 1px solid rgb(250,180,60);" >
                        <input id="areaName${n.id}" onmouseover='writeExplanation("areaName", 2);' type="text" placeholder="Enter Area Name..." value="${name}" style="margin-right:2rem;" onchange="areas[${n.id}].name = this.value;" /> ${id}
                        <input id="areaCol${n.id}"  onmouseover='writeExplanation("areaColor", 2);' type="color" onchange="areas[${n.id}].coloration = color(this.value);" value="${col}" style="margin-right:2rem; width:2rem;" /> 
                        Transparency : <input id="areaAlpha${n.id}" style="margin-right:2rem;" onmouseover='writeExplanation("areaAlpha", 2);' type="range" step=1 min=0 max=255 value="${alpha}" onchange="areas[${n.id}].coloration.levels[3] = 255 - parseInt(this.value); " />
                        Center : ( X =  <input style="width:2rem;" id="areaPosX${n.id}" type="number"  value="${pos.x}"  onchange="areas[${n.id}].position.x = Number.parseFloat(this.value * 100); redrawArea(${n.id});"  onmouseover='writeExplanation("areaPos", 2);' />
                        , Y = <input style="width:2rem;" id="areaPosY${n.id}" type="number" value="${pos.y}" onchange="areas[${n.id}].position.y = Number.parseFloat(this.value * 100); redrawArea(${n.id});"  onmouseover='writeExplanation("areaPos", 2);' /> )
                        <input style="width: 5rem; margin-left: 2rem;" id="${n.id}" type="submit" value="Clone" onclick="addArea(${n.id})"  onmouseover='writeExplanation("areaClone", 2);' />
                        <input style="width: 5rem; margin-left: 2rem;" type="submit" value="Delete" onclick="deleteArea(${n.id});"  onmouseover='writeExplanation("areaDelete", 2);' /><br/>
                        <input type="submit" value="See Polygon" style="width: 8rem;" onclick="toggleAreaHolder(${n.id})" onmouseover='writeExplanation("areaSeePoints", 2);'/> 
                        Animate : <input type="checkbox" id="areaAnimate${n.id}" onchange="areas[${id}].animated = this.checked;" ${animated} /> 
                        Obstacle : <input type="checkbox" id="areaObstacle${n.id}" onchange="areas[${id}].isObstacle = this.checked;" ${obstacle} /> 
                    </div>
                    <div id="areaH${n.id}" style="display:none; background-color:rgba(0,0,0,0.5); border-bottom: 1px solid rgb(250,180,60);"">
                        Points <input style="width:2rem; margin-right:2rem;" id="areaPointsAmount${n.id}" type="number" value=${pointsAmount} onchange="areas[${n.id}].pointsAmount = this.value; redrawArea(${n.id})" onmouseover='writeExplanation("areaPoints", 2);' />  
                        Radius <input id="areaSize${n.id}" type="number" value=${radius / 100} onchange="areas[${n.id}].radius = this.value * 100; redrawArea(${n.id})"  style="margin-right:2rem;" onmouseover='writeExplanation("areaRadius", 2);' />
                        Randomness <input style="width:2rem;" id="areaRandom${n.id}" type="number" value=${randomize} onchange="areas[${n.id}].randomize = this.value; redrawArea(${n.id})" onmouseover='writeExplanation("areaRandom", 2);' style="margin-right:2rem;" /> 
                        <input id="${n.id}" type="submit" value="Add Point" onclick="addPointToShape(${n.id});" style="margin-left:1rem; margin-right:2rem;" onmouseover='writeExplanation("areaRedraw", 2);'  /> 
                        <input id="${n.id}" type="submit" value="Redraw Polygon" onclick="redrawArea(${n.id});" style="margin-left:1rem; margin-right:2rem;" onmouseover='writeExplanation("areaRedraw", 2);'  /> 
                        <input id="${n.id}" type="submit" value="Subdivide Polygon" onclick="subdivide(${n.id},1, {identifySub: true});" style="margin-left:1rem; margin-right:2rem;" onmouseover='writeExplanation("areaRedraw", 2);'  /> 

                        ${writePointsHTML(n.id, area.shape)}

                    </div>`; 
    elt.append(n);
}

/** Writes a row for each of the points in a given shape */
function writePointsHTML(id, shape)
{
    let ret = `<table id="points${id}" style="width: 30%; margin-left : 30%;" onmouseover='writeExplanation("areaPointsPos", 2);' ><tbody>`;
    for(let i = 0; i < shape.length; i++) 
    {
        point = shape[i];
        ret += `<tr><th>Position</th><th> <input id="pointPosX${id}_${i}" type="number" value="${point.x}" onchange="changePos(${id},${i})" /> </th> <th><input id="pointPosY${id}_${i}" type="number" onchange="changePos(${id},${i})" value="${point.y}" /> </th> </tr>`; 
    }
    ret+= `        </tbody></table>`
    return ret;
}

function addPointToShape(id)
{
    areas[id].shape.push({x: camera.mapPosition.x, y:camera.mapPosition.y});
    areas[id].pointsAmount++;
    document.querySelector(`#points${id}`).innerHTML = writePointsHTML(id, areas[id].shape);
    document.querySelector(`#areaPointsAmount${id}`).value = areas[id].pointsAmount;
}

function changePos(area, index)
{
    let x = document.querySelector(`#pointPosX${area}_${index}`)
    x = Number.parseFloat(x.value);

    let y = document.querySelector(`#pointPosY${area}_${index}`)
    y = Number.parseFloat(y.value);

    areas[area].shape[index] = {x : x, y : y};
    let cenr = centroid(areas[area]);
    areas[area].position.x = cenr.x;
    areas[area].position.y = cenr.y;
    document.querySelector(`#areaPosX${area}`).value = cenr.x / 100;
    document.querySelector(`#areaPosY${area}`).value = cenr.y / 100
}