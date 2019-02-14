class Camera
{
    constructor(anchor)
    {
        ellipseMode(RADIUS);
        // Boundaries in zoom  (clicksPerScreen) and position (clicksPerMap)
        this.zoomBoundaries = {min : 100, max : 8000}
        this.mapBoundaries = {min : 0, max : 4000}

        // Gives the amount of clicks (cm.) to be displayed at startup.
        this.displayedClicks = floor(this.zoomBoundaries.max / 2.5);

        // camera is anchored to an entity with a position on the map (expressed in x - y click from 0 to mapSize)
        this.anchor = anchor || {position : {x: round(this.mapBoundaries.max / 2), y:round(this.mapBoundaries.max / 2)}};
        this.mapPosition = this.anchor.position;

        // Compute other attributes 
        this.setScreenCenterPoint();
        this.setScreenSize();
        this.setMapDimensions();
        this.setClicksPerPixel();
    }

    /** Set this.anchor to the parameter object, or returns false
     * @param {*} args : Entity (or Child) ||  Screen Point
     * Passing a Troop takes the dimension into account for Tactical Overlay and centers the Camera onto Troop's position. 
     * Passing a Screen Point and an array of Troops checks if there is a Troop to anchor to. */
    setAnchor(args)
    {
        if(args.position && args.dimension)
        {
            this.anchor = args;
            return true;
        }
        else if(args.screenPos && args.troops)
        {
            let t = this.getEntity(args.screenPos, args.troops);
            if(t)
                return this.setAnchor(t);
        }
        return false;
    }

    /** Sets this.mapBoundaries and this.zoomBoundaries according to the size arguments.
     * @param {*} size : The clicks size of the map to display. */
    setMap(size)
    {
        this.anchor = undefined;
        this.mapBoundaries.max = size; 
        this.zoomBoundaries.max = floor(size * 2);
        this.centerMapPosition();

        this.displayedClicks = this.zoomBoundaries.max;
        this.setMapDimensions();
        this.setClicksPerPixel();
    }

    /** Sets this.mapPosition vector according to the center of the mapBoundaries*/
    centerMapPosition()
    {
        this.mapPosition = createVector(round(this.mapBoundaries.max / 2), round(this.mapBoundaries.max / 2));
        this.anchor = {position : {x: round(this.mapBoundaries.max / 2), y:round(this.mapBoundaries.max / 2)}};
    }
    /** Sets this.mapPosition vector according to the current anchor. 
     * If we change anchor, then slide towards the new target. */
    setMapPosition()
    {
        let anch;
        if(this.anchor && this.anchor.position)
        {
            anch = createVector(this.anchor.position.x, this.anchor.position.y);
        }
        else
        {
            anch = this.mapPosition;
        }

        if(this.mapPosition !== anch)
        {
            let d = dist(this.mapPosition.x, this.mapPosition.y, anch.x, anch.y)
            if(d <= 50)
            {
                this.mapPosition = anch;
                if(!this.anchor.dimension) { this.anchor = undefined; }
            }
            else 
            {
                this.mapPosition.x += floor((anch.x - this.mapPosition.x) / 20);
                this.mapPosition.y += floor((anch.y - this.mapPosition.y) / 20)
            }
        }
    }

    /** Set this.screenCenterPoint vector containing the center of the screen in Pixels */
    setScreenCenterPoint()
    {
        let w = round(windowWidth / 2);
        let h = round(windowHeight / 2);
        this.screenCenterPoint =  createVector(w, h);
    }

    /** Sets this.screenSize vector with the amount of pixel available on the shortest dimension of the screen (width or height) in Pixels
     *  Sets this.ratio with the ratio between the two dimensions */
    setScreenSize()
    {
        if(windowWidth > windowHeight)
        {
            this.screenSize = windowHeight ;
            this.screenRatio = windowWidth / windowHeight;
        }
        else
        {
            this.screenSize = windowWidth ;
            this.screenRatio = windowHeight / windowWidth;
        }
    }

    /** Sets this.mapDimensions vector with the amount of clicks visible on both dimensions */
    setMapDimensions()
    {
        let w; let h;
        if(windowWidth > windowHeight)
        {
            w = floor(this.displayedClicks * this.screenRatio);
            h = this.displayedClicks;
        }
        else
        {
            w = this.displayedClicks;
            h = floor(this.displayedClicks * this.screenRatio);
        }
        this.mapDimensions = createVector(w,h);
    }

    /** Sets this.clicksPerPixels with the amount of clicks there are per Pixel on current screen*/
    setClicksPerPixel()
    {
        this.clicksPerPixel = this.displayedClicks / this.screenSize;
    }

    /** Returns a Vector with the pixel position of a given Entity's position
     * @param {*} x : the x position in clicks
     * @param {*} y : the y position in clicks
     */
    mapPointToScreenPoint(x,y)
    {
        let deltaX = x - this.mapPosition.x;
        let deltaY = y - this.mapPosition.y;

        let pixelDeltaX = floor(deltaX / this.clicksPerPixel);
        let pixelDeltaY = floor(deltaY / this.clicksPerPixel);

        let posX =  pixelDeltaX + this.screenCenterPoint.x;
        let posY =  pixelDeltaY + this.screenCenterPoint.y;
        return createVector(posX, posY);
    }

    /** Returns a Vector with the map position in clicks from the pixel position on screen
     * @param {*} x : the x position in pixels
     * @param {*} y : the y position in pixels
     */
    screenPointToMapPoint(x,y)
    {
        let deltaX = x - this.screenCenterPoint.x;
        let deltaY = y - this.screenCenterPoint.y;

        let pixelDeltaX = round(deltaX * this.clicksPerPixel );
        let pixelDeltaY = round(deltaY * this.clicksPerPixel );

        let posX =  pixelDeltaX + this.mapPosition.x;
        let posY =  pixelDeltaY + this.mapPosition.y;
        return createVector(floor(posX), floor(posY) );
    }

    /** Returns a Vector with the pixel dimension of a given Entity's dimension
     * @param {*} x : the x dimension in clicks
     * @param {*} y : the y dimension in clicks
     */
    mapDimensionsToScreen(x,y)
    {
        let xx = floor(x / this.clicksPerPixel)
        let yy = floor(y / this.clicksPerPixel)

        return createVector(xx,yy);
    }

    /** Returns an array of points for a polygon on the map */
    getShape(x, y, radius, pointsAmount, randomize, noiseValue, startingRotation)
    {
        let shape = [];
        let r = 0;
        if(startingRotation)
            r = startingRotation

        for(var i = -(PI/pointsAmount) + r; i < TWO_PI - ((PI/pointsAmount) * 2) + r; i += TWO_PI / pointsAmount)
        {
            let n = (noiseValue === undefined) ? noise(frameCount / 50, x + y + radius + i) : noise(frameCount / 50, noiseValue.x + noiseValue.y + radius + i)
            
            let r = map(n, 0, 1, -radius*randomize, radius * randomize); // Mapping that noise point to Radius according to the random factor
            let v = 
            {
                x :  Math.floor( x + (radius + r) * cos(i) ),
                y:   Math.floor( y + (radius + r) * sin(i) )
            }
            shape.push(v)
        }
        return shape;
    }
    /** Returns an entity if there is one at the Screen point */
    getEntity(screenPos, troops)
    {
        let flag;
        let p = this.screenPointToMapPoint(screenPos.x, screenPos.y);
        p = createVector(p.x, p.y);
        troops.forEach(t => 
        {
            if( p.copy().dist(createVector(t.position.x, t.position.y)) < t.dimension.x )
            {
                flag = t;
            }
        })
        return flag;
    }
    /** Determines if an entity is on screen currently (entity can be a point or ellipse) */
    isOnScreen(entity)
    {
        if(entity.dimension === undefined)
        {
            let screenRight = this.mapPosition.x + floor(this.mapDimensions.x / 2);
            let screenLeft  = this.mapPosition.x - floor(this.mapDimensions.x / 2);
            let screenTop    = this.mapPosition.y - floor(this.mapDimensions.y / 2);
            let screenBottom = this.mapPosition.y + floor(this.mapDimensions.y / 2);
            if(entity.position.x < screenRight && entity.position.x > screenLeft)
            {
                if(entity.position.y < screenBottom && entity.position.y > screenTop)
                {
                    return true;
                }
            }
        }
        else 
        {
            let entityRight = entity.position.x + entity.dimension.x;
            let entityLeft  = entity.position.x - entity.dimension.x;
            let screenRight = this.mapPosition.x + floor(this.mapDimensions.x / 2);
            let screenLeft  = this.mapPosition.x - floor(this.mapDimensions.x / 2);

            if(entityLeft < screenRight && entityRight > screenLeft)
            {
                let entityTop    = entity.position.y - entity.dimension.y;
                let entityBottom = entity.position.y + entity.dimension.y;
                let screenTop    = this.mapPosition.y - floor(this.mapDimensions.y / 2);
                let screenBottom = this.mapPosition.y + floor(this.mapDimensions.y / 2);

                if(entityTop < screenBottom && entityBottom > screenTop)
                {
                    return true;
                }
            }
        }
        return false;
    }

    /** Displays an Ellipse on top of the canvas
     * @param {*} entity : the entity to be displayed {position} | {position, dimension, coloration, stk, name}
     * @returns Array with position X and Y of the entity on the screen || false
    */
    displayEntity(entity)
    {
        if(!entity.position)
        {
            return false;
        }
        if(this.isOnScreen(entity))
        {
            let pos = this.mapPointToScreenPoint(entity.position.x, entity.position.y);
            let dim;
            if(entity.dimension)
            {
                dim = this.mapDimensionsToScreen(entity.dimension.x, entity.dimension.y);
            }
            if(dim == undefined || dim.x < 2)
            {
                dim = createVector(2,2);
            }

            let str = entity.stk || color(250, 250, 250, 150);
            strokeWeight(3);
            stroke(str);

            let c = entity.coloration || color(0, 0, 0, 150);
            fill(c);

            ellipse(pos.x, pos.y, dim.x, dim.y);
            noStroke();
            
            return [pos.x, pos.y];
        }
        return false;
    }
    /** Displays a closed polygon on the screen.
     * @param {*} area : Polygon to be displayed {position}
     * @returns Array with position X and Y of the area on the screen || false
    */
    displayArea(area)
    {
        if(area.stk)
            stroke( color(area.stk.levels[0], area.stk.levels[1], area.stk.levels[2], area.stk.levels[3] ))
        else
            noStroke();
            
        let ct;
        if(area.coloration)
        {
            ct = color(area.coloration.levels[0], area.coloration.levels[1], area.coloration.levels[2], area.coloration.levels[3])
        }
        let c = ct || color(0,0,0,150);
        fill(c);

        if(area.animatedColor)
        {
            if(frameCount % area.animatedColor == 0)
            {
                area.nextColor = color(random(255), random(255), random(255), area.coloration.levels[3])
            }
            else if (area.nextColor)
            {
                area.coloration = lerpColor(area.coloration, area.nextColor, (frameCount % area.animatedColor / area.animatedColor) / 100 );
            }
        }
        if(area.randomWalk && area.noise)
        {
            area.position.x += floor( map( floor(noise(frameCount / 50, area.noise.x) * area.randomWalk), 0, area.randomWalk -1, -area.randomWalk+1, area.randomWalk ) )
            area.position.y += floor( map( floor(noise(frameCount / 50, area.noise.y) * area.randomWalk), 0, area.randomWalk-1, -area.randomWalk+1, area.randomWalk ) )
            area.shape = camera.getShape(area.position.x, area.position.y, area.radius, area.pointsAmount, area.randomize, area.noise);
        }
        else if(area.animated)
        {
            //area.shape = camera.getShape(area.position.x, area.position.y, area.radius, area.pointsAmount, area.randomize);
        }

        if(area.shape)
        {
            // Compute centroid
            let shapeCentroid = this.centroid(area);
            shapeCentroid = this.mapPointToScreenPoint(shapeCentroid.x, shapeCentroid.y);
            shapeCentroid = createVector(shapeCentroid.x, shapeCentroid.y);

            // Display and compute average distance between centeroid and points (in pixels)
            let size = 0;
            beginShape();
            area.shape.forEach(point =>
            {
                let p = this.mapPointToScreenPoint(point.x,point.y);
                let d = shapeCentroid.copy().dist( createVector(p.x, p.y) );
                size += d;
                vertex(p.x, p.y);
            })
            endShape();
            size = floor(size / area.shape.length );

            // If the name exists and the shape size is between boundaries, display the name
            if(area.name && size > 30)
            {
                if(size <= 60)
                {
                    this.displayText(shapeCentroid, size / 4, area.name)
                }
                else if(size > 50)
                {
                    this.displayText(shapeCentroid, 14, area.name)
                }
            }
            
            // Return the pixel position of the shape's centroid, because why not.
            return [shapeCentroid.x, shapeCentroid.y];
        }
        return false;
    }
    /**Displays a grid on the map with length of square side = size*/
    displayGrid(size)
    {
        for(let i = 0; i <= this.mapBoundaries.max; i+= size)
        {
            let p1 = {x: i, y: 0};
            let p2 = {x : i, y: this.mapBoundaries.max};
            
            let l21 = {x: 0, y: i};
            let l22 = {x : this.mapBoundaries.max, y: i};

            strokeWeight(2);
            stroke(0,0,0,100);
            let sp1 = this.mapPointToScreenPoint(p1.x, p1.y);
            let sp2 = this.mapPointToScreenPoint(p2.x, p2.y);
            line(sp1.x, sp1.y, sp2.x, sp2.y);

            l21 = this.mapPointToScreenPoint(l21.x, l21.y);
            l22 = this.mapPointToScreenPoint(l22.x, l22.y);
            line(l21.x, l21.y, l22.x, l22.y);

        }
    }
    /** Displays a focus area around an entity
     * @param {*} entity : possibly a Troop
     * @param {boolean} name : flag to add name display;
    */
    displayFocus(entity, name, ignoreSize)
    {
        let pos = this.mapPointToScreenPoint(entity.position.x, entity.position.y);
        let dim = this.mapDimensionsToScreen(entity.dimension.x + 10, entity.dimension.y + 10);
        noFill();

        stroke(0,0,0,255);
        ellipse(pos.x, pos.y, dim.x, dim.y );
        
        stroke(255,255,255,255);
        ellipse(pos.x, pos.y, dim.x - 2, dim.y - 2 );


        if(entity.name && name)
        {
            pos.y += dim.y; // Move the display down

            let text = ``; // Figure out the entity's name / text 
            if(entity.getName)
                text = entity.getName();
            else   
                text = entity.name;
            
            // Display according to the dimension of the Entity on the screen
            if(ignoreSize)
            {
                pos.y += dim.y + 16;
                this.displayText(pos, 16, text)
            }
            else if(dim.x > 10)
            {
                if(dim.x <= 45)
                {
                    pos.y += dim.y/1.5;
                    this.displayText(pos, dim.x / 1.5, text)
                }
                else if(dim.x > 45)
                {
                    pos.y += 30
                    this.displayText(pos, 30, text)
                }
            }
        }
    }

    displayText(screenPos, fontSize, message)
    {
        fill(255,255,255,175);
        textAlign(CENTER, BASELINE);
        stroke(0,0,0,175);
        strokeWeight(3);
        textSize(fontSize);
        text(`${message}`, screenPos.x, screenPos.y);
        textAlign(LEFT);
    }

    displayMeasure(start, units)
    {
        let mousePos = this.screenPointToMapPoint(mouseX, mouseY);
        mousePos = createVector(mousePos.x, mousePos.y);

        let d = mousePos.copy().dist(createVector(start.x, start.y));

        let screenStart = this.mapPointToScreenPoint(start.x, start.y);

        fill(255, 255, 255, 200);
        stroke(0,0,0,175);
        strokeWeight(2);

        line(screenStart.x, screenStart.y, mouseX, mouseY);
       
        textSize(16);
        text(`${floor(d/units.value)} ${units.name}.`, mouseX + 5, mouseY + 5);
    }

    /** Displays the area around a troop which is equal to its movement */
    displayMovement(troop, otherTroops, areas)
    {
        if(troop.movement > 0)
        {
            let pos = this.mapPointToScreenPoint(troop.position.x, troop.position.y);
            let dim = this.mapDimensionsToScreen(troop.movement, troop.movement);
            let col = color(troop.stk.levels[0],troop.stk.levels[1],troop.stk.levels[2], 50);
            fill(col);
            ellipse(pos.x, pos.y, dim.x, dim.y);
    
            if(otherTroops && areas)
            {
                let mouseMapPos = this.screenPointToMapPoint(mouseX, mouseY);
                mouseMapPos = createVector(mouseMapPos.x, mouseMapPos.y);
        
                if(mouseMapPos.copy().dist(createVector(troop.position.x, troop.position.y)) < troop.movement)
                {
                    let flag = troop.intersects(mouseMapPos, otherTroops, areas); 
                    if(flag)
                        fill(250,0,0,70);
                    else
                        fill(0,250,0,70);
    
                    let tDim = this.mapDimensionsToScreen(troop.dimension.x, troop.dimension.y)
                    ellipse(mouseX, mouseY, tDim.x, tDim.y);
                    stroke(col);
                    line(mouseX, mouseY, pos.x, pos.y);
                }
            }
        }
    }

    /** Displays the reach of an action */
    displayAction(troop, action, otherTroops)
    {
        let pos = this.mapPointToScreenPoint(troop.position.x, troop.position.y);
        let dim = this.mapDimensionsToScreen(troop.dimension.x + action.reach, troop.dimension.y + action.reach) ;
        let col = color(troop.stk.levels[0],troop.stk.levels[1],troop.stk.levels[2], 250);

        let aoe = this.mapDimensionsToScreen(action.areaEffect, action.areaEffect);
        if(createVector(mouseX, mouseY).dist(pos) <= dim.x)
        {
            fill(col);
            stroke(255);
            ellipse(mouseX, mouseY, aoe.x, aoe.y);
        }

        if(otherTroops !== undefined)
        {
            let troops =  getAffectedTroops(troop, action, otherTroops)
            troops.forEach(index => {this.displayFocus(otherTroops[index])} );
        }
        stroke(col);
        fill(255,255,255,20);
        ellipse(pos.x, pos.y, dim.x, dim.y);
    }

    /** Displays the whole content of a game */
    displayGame(game)
    {
        if(game.areas)
        {
            for(let i = 0; i < game.areas.length; i++)
            {
                let area = game.areas[i];
                this.displayArea(area);
            }
        }
        if(game.initiativeOrder)
        {
            for(let i = 0; i < game.initiativeOrder.length; i++)
            {
                let troop = game.initiativeOrder[i];
                this.displayEntity(troop);
            }
        }
        this.setMapPosition();
    }

    displaySimpleOverlay()
    {
        let pos = createVector(this.mapPosition.x, this.mapPosition.y);
        let dim;
        if(this.anchor && this.anchor.dimension)
            dim = this.anchor.dimension.copy();
        else 
            dim = createVector(0,0);
                    
        noFill();
        strokeWeight(1);

        for(var i = 0; i <= 10; i++)
        {
            let exp = Math.pow(10,i);
            let max = this.mapDimensionsToScreen((9 * exp) + dim.x, (9 * exp )+ dim.y) ;
            let mapMax = floor(map(max.y, 0, windowHeight * 5, 10, 25));
            stroke(0,0,0,mapMax * 10);
            for(var a = 1; a <= 9; a++)
            {
                let da = this.mapDimensionsToScreen((a * exp) + dim.x, (a * exp)+ dim.y) ;
                let pp = this.mapPointToScreenPoint(pos.x, pos.y);
                
                let unit = "";
                if(a * exp >= 100 && a * exp < 100000)
                    unit = "" + (a * exp) / 100 + " m."
                else if(a * exp >= 100000)
                    unit = "" + (a * exp) / 100000 + " km. "

                if(max.y > 100)
                {
                    ellipse(pp.x, pp.y, da.x, da.y);
                    text(unit,  pp.x - (2 + (i * 4)), pp.y - (da.x) )
                }
            }
        }
    }
    /** Displays a set of circles showing distances from the center of the screen */
    displayTacticalOverlay()
    {
        let pos = createVector(this.mapPosition.x, this.mapPosition.y);
        let dim;
        if(this.anchor && this.anchor.dimension)
            dim = this.anchor.dimension.copy();
        else 
            dim = createVector(0,0);

        for(var i = 10; i >=  1; i--) 
        {
            let exp = Math.pow(10, i);// 10 to the power of I, so from 1 to 100000 clicks (times one thousand)
            let max = this.mapDimensionsToScreen(exp + dim.x, exp + dim.y); // Get the pixel values for each of the powers of 10

            let e2 = Math.pow(10, i+1)
            let max2 = this.mapDimensionsToScreen(e2 + dim.x, e2 + dim.y); // Get the pixel values for each of the powers of 10

            let strokeValue = floor(map(max.y, 0, windowHeight, 5, 25)); // Map the pixel value to an alpha value
            stroke(0,0,0,strokeValue * 20);

            let screenCenter = this.screenCenterPoint;
            // For the inner values between each power of 10 (so 2-3-4-5-6-7-8-9)
            for(var a = 10; a >= 0; a--)
            {
                let da = this.mapDimensionsToScreen((a * exp) + dim.x, (a * exp) + dim.y); // Get the pixel dimension
                let dc = this.mapDimensionsToScreen((a * exp), (a * exp)); // Get the pixel dimension
                if(a * Math.pow(10,i) < this.displayedClicks)
                {
                    // If the pixel value of 
                    if(max2.y > height * 0.3)
                    {
                        strokeWeight(1);
                        fill(0,0,0,3);
                        stroke(0,0,0,150);
                        ellipse(screenCenter.x, screenCenter.y, da.x, da.y);
                        line(screenCenter.x , screenCenter.y - da.y, screenCenter.x, screenCenter.y + da.y)
                        line(screenCenter.x - da.x , screenCenter.y, screenCenter.x + da.x, screenCenter.y)

                        if(i > 1)
                        {
                            line(screenCenter.x - dc.x, screenCenter.y - dc.y, screenCenter.x + dc.x, screenCenter.y  - dc.y);
                            line(screenCenter.x - dc.x, screenCenter.y  + dc.y, screenCenter.x + dc.x, screenCenter.y  + dc.y);

                            line(screenCenter.x - dc.x, screenCenter.y  - dc.y, screenCenter.x  - dc.x, screenCenter.y  + dc.y);
                            line(screenCenter.x  + dc.x, screenCenter.y  - dc.y, screenCenter.x  + dc.x, screenCenter.y  + dc.y);
                        }

                        if(a !== 10 && a !== 0)
                        {
                            textSize(12);
                            fill(0,0,0,250);
                            text("" + (a * exp) / 100 + " m", screenCenter.x + 5, screenCenter.y + (da.y) +2)
                            text("" + (a * exp) / 100 + " m", screenCenter.x + 5, screenCenter.y - (da.y) +2)
                            
                        }
                    }
                }
            }
            textSize(13);
            fill(250,250,250,250);
            text(`( ${floor(pos.x)}, ${floor(pos.y)} )`, screenCenter.x + 5, screenCenter.y - 5);
        }

        this.displayMapBorders();
    }

    /** Displays the border of the map according to  this.mapBoundaries */
    displayMapBorders()
    {
        let s = round(this.mapBoundaries.max / 2);
        let dim = this.mapDimensionsToScreen(s, s);
        let pos = this.mapPointToScreenPoint(s, s);
        noFill();
        strokeWeight(8);
        stroke(255,0,0,50);
        rectMode(RADIUS);
        rect(pos.x, pos.y, dim.x, dim.y);
        strokeWeight(1)
    }

    /** Moves the camera around using arrow keys */
    move()
    {
        let speed = round(this.clicksPerPixel * 2.5);
        if(this.clicksPerPixel < 10000)
        {
            speed = round(speed * 1.5) + 1;
        }
        if(this.clicksPerPixel < 7)
        {
            speed = round(speed  * 1.5) + 1;
        }

        if(keyIsDown(UP_ARROW) && this.mapPosition.y > this.mapBoundaries.min)
        {
            this.mapPosition.y -= round(speed);
            this.anchor = undefined;
        }

        if(keyIsDown(DOWN_ARROW) && this.mapPosition.y < this.mapBoundaries.max)
        {
            this.mapPosition.y += round(speed);
            this.anchor = undefined;
        }

        if(keyIsDown(LEFT_ARROW) && this.mapPosition.x > this.mapBoundaries.min)
        {
            this.mapPosition.x -= round(speed);
            this.anchor = undefined;
        }
        if(keyIsDown(RIGHT_ARROW) && this.mapPosition.x < this.mapBoundaries.max)
        {
            this.mapPosition.x += round(speed);
            this.anchor = undefined;

        }
    }

    /** Zooms the camera back and forth using mouseWheel */
    zoom(mouseWheelEvent)
    {
        let zoomChange = floor(sqrt(this.displayedClicks) * 10)
        if(this.displayedClicks > 25000)
        {
            zoomChange = floor(zoomChange * (zoomChange * 0.001))
        }
        if(mouseWheelEvent.delta > 0)
        {
            if(this.displayedClicks < this.zoomBoundaries.max)
            {
                this.displayedClicks += zoomChange;
            }
        }
        else 
        {
            if(this.displayedClicks > this.zoomBoundaries.min)
            {
                this.displayedClicks -= zoomChange;
            }
        }

        this.setMapDimensions();
        this.setClicksPerPixel();
        return false;
    }

    /**RANDOM GLOBAL STUFF */
    centroid(area)
    {
        let vertices = area.shape
        let centroid = createVector(0, 0);
        let signedArea = 0.0;
        let x0 = 0.0; // Current vertex X
        let y0 = 0.0; // Current vertex Y
        let x1 = 0.0; // Next vertex X
        let y1 = 0.0; // Next vertex Y
        let a = 0.0;  // Partial signed area

        // For all vertices except last
        let i = 0
        for (i = 0; i < vertices.length-1; i++)
        {
            x0 = vertices[i].x;
            y0 = vertices[i].y;
            x1 = vertices[i+1].x;
            y1 = vertices[i+1].y;
            a = x0*y1 - x1*y0;
            signedArea += a;
            centroid.x += (x0 + x1)*a;
            centroid.y += (y0 + y1)*a;
        }

        // Do last vertex separately to avoid performing an expensive
        // modulus operation in each iteration.
        x0 = vertices[i].x;
        y0 = vertices[i].y;
        x1 = vertices[0].x;
        y1 = vertices[0].y;
        a = x0*y1 - x1*y0;
        signedArea += a;
        centroid.x += (x0 + x1)*a;
        centroid.y += (y0 + y1)*a;

        signedArea *= 0.5;
        centroid.x /= (6.0*signedArea);
        centroid.y /= (6.0*signedArea);
        return {x: floor(centroid.x), y:floor(centroid.y)};
    } 
}