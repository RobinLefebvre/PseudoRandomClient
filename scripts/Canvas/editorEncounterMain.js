let canvas;
let userList;

let areas = [];
let groups = [ {name:"Group 1", troops : []}, {name:"Group 2", troops : []} ];
let encounterName = "Default Encounter";
let source = "Default";
let groupsAmount = 2;

let gridSize = 300;
let gridSnap = 10;

function setup()
{
    canvas = createCanvas(windowWidth, windowHeight);
    camera = new Camera();
    windowResized = () => resizeCanvas(windowWidth, windowHeight);
    changeRadius();
    
    noiseSeed("PseudoRandom");

    writeGroups("groupsData");
    writeSavedMapsOption();
}
function draw()
{
    background(50,50,50);
    
    areas.forEach(a =>
    {
        camera.displayArea(a, true);
    });

    for(let group = 0; group < groups.length; group++)
    {
        let g = groups[group];
        for(let id = 0; id < g.troops.length; id++)
        {
            let troop = g.troops[id];
            //troop = new Troop(troop);

            let act = document.querySelector(`#troopActionSelect${group}_${id}`).value;
            if(act !== "None")
            {
                if(act == "Move")
                {
                    camera.displayMovement(troop)
                }
                else
                {
                    let a = troop.actions[act];
                    troop.dimension = createVector(Number.parseInt(troop.dimension.x),Number.parseInt(troop.dimension.y)) ;
                    a.reach = Number.parseInt(a.reach);
                    a.areaEffect = Number.parseInt(a.areaEffect);
                    camera.displayAction(troop, a)
                }
            }
            troop.stk = groups[group].color;
            camera.displayEntity(troop);  
        }
    }

    if(keyIsDown(ALT))
        camera.displayTacticalOverlay();
        
    if(document.querySelector("#gridDisplay").checked)
        camera.displayGrid(gridSize);
}
function loadEncounter(id)
{
    if(id)
    {
        let encounterID = id.match(/encounter([0-9]+)/);
        let mapID = id.match(/map([0-9]+)/);
        
        let data;
        if(encounterID != null)
        {
            let enc = LocalData.get("encounters", "All");
            data = enc[encounterID[1]];
        }
        if(mapID != null)
        {
            let enc = LocalData.get("maps", "All");
            data = enc[mapID[1]];
        }
        document.querySelector(`#name`).value = data.name;
        encounterName = data.name;

        document.querySelector(`#source`).value = data.source;
        source = data.source;

        document.querySelector(`#mapRadius`).value = floor(data.mapSize / 200);
        changeRadius(floor(data.mapSize / 200));
        if(data.mapSize > 1500000)
            document.querySelector("#gridDisplay").checked = false;

        document.querySelector(`#description`).value = data.description;

        document.querySelector(`#groups`).value = data.groups.length;
        groupsAmount = data.groups.length;
        let groupsName = [];
        for(let group in data.groups)
        {
            let g = data.groups[group];
            groups[group] = {};
            groups[group].name = g.name;
            groupsName[group] = g.name;
            groups[group].color = g.color;
            groups[group].troops = [];
            g.troops.forEach(troop =>
            {
                let t = new Troop(troop);
                groups[group].troops.push(t);
            })
        }
        writeGroups("groupsData", groupsName)

        for(let group in data.groups)
        {
            document.querySelector(`#color${group}`).value = groups[group].color;
        }

        areas = [];
        for(let i = 0; i < data.areas.length; i++)
        {
            let area = data.areas[i];
            area.shape = JSON.parse(area.shape);
            areas.push(area);
        }
        writeAreas();
    }
    else
    {
        groups = [ {name:"Group 1", troops : []}, {name:"Group 2", troops : []} ];
        areas = [];
    }
}
function saveEncounter(json)
{
    let e = {};
    let arr = [];
    areas.forEach(a =>
    {
        let area = {};
        area.name = a.name;
        area.coloration = a.coloration;
        for(let i = 0; i < a.shape.length; i++){a.shape[i] = {x : a.shape[i].x, y:a.shape[i].y} }
        area.shape = JSON.stringify(a.shape);
        area.position = {x : a.position.x, y: a.position.y};
        area.radius = a.radius;
        area.randomize = a.randomize;
        area.pointsAmount = a.pointsAmount;
        area.animated = a.animated;
        area.animatedColor = a.animatedColor;
        area.randomWalk = a.randomWalk;
        area.noise = a.noise;
        area.noWrite = a.noWrite;
        area.isObstacle = a.isObstacle;
        area.conditions = a.conditions;
        area.actions = a.actions;
        arr.push(area);
    })
    e.areas = arr;

    let grps =[];
    let flagEmptyGroup = false;
    for(let group in groups)
    {
        grps[group] = {};
        grps[group].name = document.querySelector(`#name${group}`).value;
        grps[group].color = document.querySelector(`#color${group}`).value;
        grps[group].troops = [];
        if(groups[group].troops.length == 0)
        {
            flagEmptyGroup = true;
        }
        groups[group].troops.forEach(troop => {
            let t = {}
            for(let key in troop)
            {
                t[key] = troop[key];
            }
            
            t.position = {x : troop.position.x, y: troop.position.y};
            t.dimension = {x:troop.dimension.x, y:troop.dimension.y};
            grps[group].troops.push(t);
        })
    }
    e.source = source;
    e.groups = grps;
    e.name = encounterName;
    e.mapSize = camera.mapBoundaries.max;
    e.description = document.querySelector(`#description`).value;
    if(json)
        saveJSON(e, e.name);
    else
    {
        if(!flagEmptyGroup)
        {
            LocalData.add(source, "encounters", e);
        }
        else
        {
            LocalData.add(source, "maps", e);
        }
    }
}

function addTroop(group)
{
    if(groups[group] == undefined)
    {
        groups[group] = {};
        groups[group].troops = [];
    }

    let t = {};
    t.position = {x : round(camera.mapPosition.x), y : round(camera.mapPosition.y) };
    t.stk = document.querySelector(`#color${group}`).value;
    t = new Troop(t);
    groups[group].troops.push(t); 
    writeTroops(group)
}
function deleteTroop(group, id)
{
    groups[group].troops.splice(id,1);
    let elt = document.querySelector(`#troop${group}_${id}`);
    elt.parentNode.removeChild(elt);
    writeTroops(group);
}
function editTroop(group, id)
{
    let n = document.querySelector(`#name${group}_${id}` ).value;
    
    let posX = document.querySelector(`#posX${group}_${id}` );
    let posY = document.querySelector(`#posY${group}_${id}` );
    let pos = createVector(Number.parseFloat(posX.value * 100), Number.parseFloat(posY.value *100) );
    LocalData.get("troops","All").forEach( troop => 
    {
        if(troop.name == n)
        {
            let t = troop;
            t.position = pos;
            t.stk = document.querySelector(`#color${group}`).value;
            t = new Troop(t);
            groups[group].troops[id] = t;
        }
    });
    writeTroops(group);
}

function addArea(id, shapeI, args)
{
    let name, pos, radius, pointsAmount,col, randomize, animated, isObstacle;
    let area = {};
    let s;

    if(id == undefined)
    {
        name = "";
        pos = createVector(camera.mapPosition.x, camera.mapPosition.y);
        radius = gridSnap * 5;
        pointsAmount = 4;
        col = "#000000";
        randomize = 0;
        isObstacle = false;
        animated = false;
        s = camera.getShape(pos.x, pos.y, radius, pointsAmount, randomize);

        area = {animated: animated, name : name, coloration : col, position : pos, radius : radius, pointsAmount: pointsAmount, randomize:randomize, isObstacle : isObstacle};
    }
    else
    {
        name = document.querySelector(`#areaName${id}`).value;
        pos = createVector(Number.parseFloat(document.querySelector(`#areaPosX${id}`).value * 100), Number.parseFloat(document.querySelector(`#areaPosY${id}`).value * 100) );
        radius = Number.parseInt(document.querySelector(`#areaSize${id}`).value * 100);
        pointsAmount = Number.parseInt(document.querySelector(`#areaPointsAmount${id}`).value);
        col = document.querySelector(`#areaCol${id}`).value;
        col += componentToHex(255 - Number.parseInt(document.querySelector(`#areaAlpha${id}`).value));
        randomize = Number.parseFloat(document.querySelector(`#areaRandom${id}`).value);
        isObstacle = document.querySelector(`#areaObstacle${id}`).checked;
        animated = document.querySelector(`#areaAnimate${id}`).checked;

        area = {animated: animated, name : name, coloration : col, position : pos, radius : radius, pointsAmount: pointsAmount, randomize:randomize, isObstacle : isObstacle};

        s = [];
        for(let i = 0; i < areas[id].shape.length; i++) 
        {
            let point = areas[id].shape[i];
            s.push(point);
        }
    }

    if(shapeI)
    {
        s = [];
        for(let i = 0; i < shapeI.length; i++) 
        {
            let point = shapeI[i];
            s.push(point);
        }
    }
    area.shape = s;

    if(args)
    {
        for(let key in args)
        {
            if(key == "centro")
            {
                let cc = centroid(area);
                area.position = createVector(cc.x, cc.y);
                let d = 0;
                area.shape.forEach(s => {
                    d += createVector(s.x, s.y).dist(area.position);
                })
                area.radius = floor(d / area.shape.length); 
            }
            else
            {
                area[key] = args[key];
            }            
        }
    }
    
    id = areas.length;
    areas[id] = area;
    if(!args || args && !args.noWrite)
    {
        writeAreas();
    }
}
function deleteArea(id)
{
    areas.splice(id,1);
    let e = document.querySelector(`#areaData${id}`);
    e.parentNode.removeChild(e);

    let e2 = document.querySelector(`#areaH${id}`);
    e2.parentNode.removeChild(e2);

    writeAreas();
}
function redrawArea(id)
{
    areas[id].shape = camera.getShape(areas[id].position.x, areas[id].position.y, areas[id].radius, areas[id].pointsAmount, areas[id].randomize);
    document.querySelector(`#points${id}`).innerHTML = writePointsHTML(id, areas[id].shape)
}
function invertArea(id)
{
    let area = areas[id];
    // Compute centroid
    let shapeCentroid = centroid(area);
    //shapeCentroid = this.mapPointToScreenPoint(shapeCentroid.x, shapeCentroid.y);
    shapeCentroid = createVector(shapeCentroid.x, shapeCentroid.y);

    // Display and compute average distance between centeroid and points (in pixels)
    let size = 0;
    beginShape();
    area.shape.forEach(point =>
    {
        let d = shapeCentroid.copy().dist( createVector(point.x,point.y) );
        size += d;
    })
    endShape();
    size = floor(size / area.shape.length );

    size += 50;
    let s = camera.getShape(shapeCentroid.x, shapeCentroid.y, size, 4, 0);
    area.shape.forEach(p => s.push(p)  );

    addArea(id, s);
}
function subdivide(id, passes, args)
{
    let count = 0;
    let r = 0.5;
    let s = areas[id].shape;
    let ret = [s];
    let temp = [];

    while(count < passes)
    {
        for(let i = 0; i < ret.length; i++)
        {
            s = ret[i];
            r = 0.5;
            cent = centroid({shape: s});

            if(s.length > 3)
            {
                for(let i = 0; i < s.length -1; i++)
                {
                    let a = [ s[i], cent, s[i+1] ];
                    temp.push( a )
                }
                temp.push( [ s[s.length-1], cent, s[0] ] );
            }
            else if(s.length == 3)
            {
                let pointA = createVector(s[0].x, s[0].y);
                let pointB = createVector(s[1].x, s[1].y);
                let pointC = createVector(s[2].x, s[2].y);

                let p1 = {};
                if(args.random)
                    r = 0.5 + map(noise(pointA.x  / 10000, pointC.y / 10000), 0,1,-args.random,args.random);
                p1.x  = round(lerp(pointA.x, pointC.x, r));
                p1.y  = round(lerp(pointA.y, pointC.y, r));

                let p2 = {};
                if(args.random)
                    r = 0.5 + map(noise(pointA.x  / 10000, pointB.y / 10000), 0,1,-args.random,args.random);
                p2.x  = round(lerp(pointA.x, pointB.x, r));
                p2.y  = round(lerp(pointA.y, pointB.y, r));

                let p3 = {};
                if(args.random)
                    r = 0.5 + map(noise(pointB.x  / 10000, pointC.y / 10000), 0,1,-args.random,args.random);
                p3.x  = round(lerp(pointB.x, pointC.x, r));
                p3.y  = round(lerp(pointB.y, pointC.y, r));

                temp.push( [ pointA, p1, p2 ] );
                temp.push( [ p1, p3, pointC ] );
                temp.push( [ p2, p3, p1 ] );
                temp.push( [ pointB, p3, p2 ] );
            }
        }
        ret = temp;
        temp = [];
        count++;
    }

    for(let i = 0; i < ret.length; i ++)
    {
        let a = {};
        a.pointsAmount = ret[i].length;
        a.centro = true;
        if(args.lerpColoration)
        {
            let c= color(areas[id].coloration)
            let col = lerpColor(c, color(args.lerpColoration), 0.5);
            a.coloration = col;
        }
        if(args.identifySub)
        {
            a.name = `${areas[id].name}_${i}`;
        }
        addArea(id, ret[i], a);
    }
    writeAreas();
}
/** Changes the map radius according to the value of a DOM element or data from a stored encounter */
function changeRadius(data)
{
    let elt = document.querySelector(`#mapRadius`);

    if(data)
    {
        camera.setMap(data * 200); 
        camera.centerMapPosition();
    }
    else
    {
        let map = elt.value;
        camera.setMap(map * 200); 
        camera.centerMapPosition();
    }
    gridSize = Number.parseInt(document.querySelector(`#gridSize`).value);
}
/** Zoom camera */
function mouseWheel(event)
{
    // Prevent when outside canvas
    if(eventManagement.restrictToCanvas(event))
    {
        camera.zoom(event);
    }
}
/** Drag Area Point or Troop (CTRL) */
function mouseDragged(event)
{
    if(eventManagement.restrictToCanvas(event))
    {
        if(!event) {event = window.event; }
        if(event.buttons == 2)
        {
            // Drag Camera
            let speed = round(camera.clicksPerPixel * 0.3) + 1;
            event.preventDefault();
            camera.mapPosition.x -= event.movementX * speed;
            camera.mapPosition.y -= event.movementY * speed;
            camera.anchor = undefined;
        }
        if(event.buttons == 1)
        {
            let mousePos = camera.screenPointToMapPoint(mouseX, mouseY);
            mousePos = createVector(mousePos.x, mousePos.y);
            let dist = camera.displayedClicks/5;

            event.preventDefault();
            if(keyIsDown(CONTROL))
            {
                dragTroop(mousePos, dist);
            }
            else
            {
                dragArea(mousePos, dist);
            }
        }
    }
}
function dragTroop(mousePos, dist)
{
    let closestTroop = {};
    let elt;
    for(let groupIndex = 0; groupIndex < groups.length; groupIndex++)
    {
        group = groups[groupIndex].troops;
        for(let i = 0; i < group.length; i++)
        {
            let troop = group[i];
            let pos = createVector(troop.position.x, troop.position.y);
            let d = pos.copy().dist(mousePos);
            if(d < dist)
            {
                dist = d;
                closestTroop = troop;
                elt = {g : groupIndex, i : i};
            }
        }
    }

    if(elt)
    {
        mousePos.x = (floor(mousePos.x / gridSnap) * gridSnap) + floor(gridSnap / 2);
        mousePos.y = (floor(mousePos.y / gridSnap) * gridSnap) + floor(gridSnap / 2);;
        document.querySelector(`#posX${elt.g}_${elt.i}`).value = mousePos.x / 100;
        document.querySelector(`#posY${elt.g}_${elt.i}`).value = mousePos.y / 100;

        closestTroop.position.x = mousePos.x;
        closestTroop.position.y = mousePos.y;
    }
}
function dragFullArea(mousePos)
{
    for(let areaIndex = 0; areaIndex < areas.length; areaIndex++)
    {

    }
}
function dragArea(mousePos, dist)
{
    let closestPointFromMouse = {};
    let elt;
    for(let areaIndex = 0; areaIndex < areas.length; areaIndex++)
    {
        let a = areas[areaIndex];
        for(let i = 0; i < a.shape.length; i++)
        {
            let point = a.shape[i];
            let p = createVector(point.x, point.y);
            let d = p.copy().dist(mousePos);
            if(d < dist)
            {
                dist = d;
                closestPointFromMouse = point;
                elt = {a : areaIndex, i: i};
            }
        }
    }

    if(elt)
    {
        mousePos.x = floor(mousePos.x / gridSnap) * gridSnap;
        mousePos.y = floor(mousePos.y / gridSnap) * gridSnap;

        document.querySelector(`#pointPosX${elt.a}_${elt.i}`).value = floor(mousePos.x);
        document.querySelector(`#pointPosY${elt.a}_${elt.i}`).value = floor(mousePos.y);

        areas[elt.a].shape[elt.i].x = mousePos.x;
        areas[elt.a].shape[elt.i].y = mousePos.y;
        
        let centr = centroid(areas[elt.a]);
        areas[elt.a].position.x = centr.x;
        areas[elt.a].position.y = centr.y;

        document.querySelector(`#areaPosX${elt.a}`).value = centr.x / 100;
        document.querySelector(`#areaPosY${elt.a}`).value = centr.y / 100;


        let d = 0;
        areas[elt.a].shape.forEach(p => {d += createVector(p.x, p.y).dist(createVector(centr.x, centr.y))});
        areas[elt.a].radius = floor(d / areas[elt.a].shape.length);

        document.querySelector(`#areaSize${elt.a}`).value = floor(d / areas[elt.a].shape.length) / 100;
    }
}
