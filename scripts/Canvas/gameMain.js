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
    canvas = createCanvas(windowWidth,windowHeight);
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
                        if(hoverDash)
                        {
                            let t = {};
                            t.position = currentTroop.position;
                            t.movement = currentTroop.movement + currentTroop.speed;
                            t.dimension = currentTroop.dimension;
                            t.stk = currentTroop.stk;
                            camera.displayMovement(t)
                        }
                        camera.displayMovement(currentTroop, game.initiativeOrder, game.areas);
                    }
                    else
                    {
                        let act = game.initiativeOrder[game.currentIndex].actions[actionInput];
                        camera.displayAction(currentTroop, act, game.initiativeOrder);
                    }
                }
                break;
        }
    }

    
    // ALT button pressed => Display Tactical overlay
    if(keyIsDown(ALT))
    {
        camera.displayTacticalOverlay();
    }

    // CTRL button pressed => Display measurement tool overlay
    if(measureStart)
    {
        let measureUnit = {value : 100, name: "m"};
        if(camera.displayedClicks > 1000000)
        {
            measureUnit = {value : 100000, name: "km"}
        }
        camera.displayMeasure(measureStart,measureUnit);
    }
    if(!keyIsDown(CONTROL)) // Otherwise stop drawing
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
function logs(message)
{
    if(!game.gameLog)
        game.gameLog = [];
    
    game.gameLog.push(message);
    writeGameLogs();
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

// Clicking
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
        // If we Left Click during the game and it's our turn.
        else if(event.buttons == 1 && game.state == "Game" && playerName == game.initiativeOrder[game.currentIndex].isPlayer)
        {
            let troop = game.initiativeOrder[game.currentIndex];
            let mouseMap = camera.screenPointToMapPoint(mouseX, mouseY);
            mouseMap = createVector(mouseMap.x, mouseMap.y);

            // Movement
            if(actionInput == undefined)
            {
                let troopDistance = floor(mouseMap.copy().dist( createVector(troop.position.x, troop.position.y) ));
                let intersecting = troop.intersects(mouseMap, game.initiativeOrder, game.areas);
                if(!intersecting && troopDistance < troop.movement)
                {
                    troop.move(mouseMap);
                }
            } // Use action if we have some left
            else if(troop.hasTakenAction < troop.actionsPerTurn)
            {
                let act = game.initiativeOrder[game.currentIndex].actions[actionInput];
                if(act.uses != 0 )
                {
                    let targets = getAffectedTroops(troop, act, game.initiativeOrder);

                    if(targets.length > 0)
                    {
                        let damage;
                        if(targets.length > 1 && troop.actions[actionInput].damage !== 0)
                        {
                            damage = troop.rollDamage(troop.actions[actionInput]);
                        }
                        targets.forEach(id =>
                        {
                            if(damage)
                                troop.useAction(actionInput, game.initiativeOrder[id], damage);
                            else
                                troop.useAction(actionInput, game.initiativeOrder[id]);
                        });
                        // If action has limited uses
                        if( !troop.actions[actionInput].onSuccess)
                        {
                            if(troop.actions[actionInput].uses !== -1)
                                troop.actions[actionInput].uses -= 1;
                            if(troop.actions[actionInput].pool)
                                troop.pools[troop.actions[actionInput].pool] -= 1;
                        }
                        
                        troop.hasTakenAction ++;

                        // Update the DOM, see the <script> element in game.html.
                        writeGameOrder();
                        writeTroop(game.initiativeOrder[game.currentIndex]);
                        actionInput = undefined;
                    }
                }
            }
        }
    }
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
    toggleTab(`game`);
    toggleTab(`logs`);

}