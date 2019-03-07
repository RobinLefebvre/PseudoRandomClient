const SERVER = "./"
//"./" //"file:///C:/Users/Robin/Projects/[STUFF]/PseudoRandomClient/"; // "http://localhost:6006/"; // "https://trpgproto.glitch.me/";

/** File Reader config with JSON reading */
const contentReader = new FileReader();
contentReader.onload = (data) => { localStorageUtil.readJSONFromInput(data); }
/** File Reader config with JSON reading */
const campaignReader = new FileReader();
campaignReader.onload = (data) => { localStorageUtil.readCampaignJSON(data); }

/* Utility functions for the LocalData - Campaign Data and WorldData utility classes.*/
const localStorageUtil =
{
    readJSONFromInput: function (event) 
    {
        let currentStorage = LocalData.getLocalStorage();
        var result = JSON.parse(event.target.result);
        for (let newKey in result) 
        {
            let flag = true;
            for (let key in currentStorage) 
            {
                if (key == newKey) 
                {
                    flag = false;
                }
            }
            if (flag) 
            {
                currentStorage[newKey] = result[newKey];
            }
        }
        var formatted = JSON.stringify(currentStorage, null, 4);
        localStorage.content = formatted;
        writeContentList();
        return true;
    },
    readCampaignJSON: function (event) 
    {
        var result = event.target.result;
        localStorage.campaign = result;
        return true;
    },
    getDefaultContent: function () 
    {
        let c = DEFAULT_DATA;
        return c;
    },
    getWorld: function () 
    {
        let c = WORLD_DATA;
        return c;
    }
}

/** LocalData is a set of static functions to manipulate the localStorage.content of the user - Manipulates data for the Engine.*/
class LocalData 
{
    /**LocalData.getLocalStorage() returns the current localStorage.content data
     * @return Object with either the current localStorage.content or the Default one (setting it if need be). */
    static getLocalStorage() 
    {
        if (localStorage.content == "{}" || localStorage.content == undefined) 
        {
            let c = localStorageUtil.getDefaultContent();
            localStorage.content = JSON.stringify(c);
            return c;
        }
        else 
            return JSON.parse(localStorage.content);
    }

    static get(filter, value)
    {
        let data = LocalData.getLocalStorage();
        let ret = {};
        if (value == "All")
            ret = [];

        // Look in each Source File
        for (let sourceContent in data)
        {
            // If we search for "source" - value, return the source
            if (filter == "source" && sourceContent == value) 
                return data[sourceContent];
                
            // If we search for a given key and it is present in the source file, add the Source File to return.
            else if (!value && data[sourceContent][filter]) 
            {
                ret[sourceContent] = {};
                ret[sourceContent] = data[sourceContent];
            }
            // If we search for filter - "All", return an array of all things in any Active Source that have the filter key.
            else if (value == "All" && data[sourceContent][filter] && data[sourceContent].isActive) 
            {
                for (let i = 0; i < data[sourceContent][filter].length; i++) 
                {
                    ret.push(data[sourceContent][filter][i]);
                }
            }
        }
        return ret;
    }
    static add(source, key, obj) 
    {
        let data = LocalData.getLocalStorage();
        if (data[source] == undefined) // Create the source if we don't have it
        {
            LocalData.createSource(source);
            data = LocalData.getLocalStorage();
        }
        if (data[source][key] == undefined) // Create the key if we don't have it within the source
        {
            data[source][key] = [];
        }

        // Allow to have multiple names that are identical, but add timestamp to everything.
        // Could be a better way to make sure duplicates / edits are easy to manage.
        obj.timestamp = Date.now();
        data[source][key].push(obj);
        localStorage.content = JSON.stringify(data);
    }

    static delete(source, key, id) 
    {
        let data = LocalData.getLocalStorage();
        data[source][key].splice(id, 1);
        localStorage.content = JSON.stringify(data);
    }

    static toggleSourceActive(name, activity) 
    {
        let data = LocalData.getLocalStorage();
        if (data[name]) 
        {
            data[name].isActive = activity;
        }
        localStorage.content = JSON.stringify(data);
    }

    static createSource(name)
    {
        let data = LocalData.getLocalStorage();
        data[name] = {};
        localStorage.content = JSON.stringify(data);
    }
    static deleteSource(name) 
    {
        let data = LocalData.getLocalStorage();
        if (data[name]) 
            data[name] = undefined;
        localStorage.content = JSON.stringify(data);
    }

    static logToConsole(key, value) 
    {
        let data = LocalData.get(key, value);
        console.log(data);
    }
    static exportActiveToJSON() 
    {
        let data = LocalData.get("isActive");
        saveJSON(data, "all-content.json");
    }
    static exportToJSON() 
    {
        let data = LocalData.getLocalStorage();
        saveJSON(data, "all-content.json");
    }

    /**LocalData.storeToLocal() returns the current localStorage.content data
     * @param fileInput <input type="files" onchange="LocalData.storeToLocal(this.files)"/> */
    static storeToLocal(fileInput) 
    {
        contentReader.readAsText(fileInput.item(0));
    }
}

/** LocalData is a set of static functions to manipulate the localStorage.campaign of the user - Manipulate data for the Campaign Save.*/
class CampaignData {
    static getCampaignData()
    {
        if (localStorage.campaign == "{}" || localStorage.campaign == undefined)
            return undefined
        else
            return JSON.parse(localStorage.campaign);
    }
    static get(object, filter, value) 
    {
        let data = CampaignData.getCampaignData();
        if (!filter)
            return data[object];
        else if (!value)
            return data[object][filter];
        else 
        {
            let ret = [];
            data[object].forEach(obj => { if (obj[filter] && obj[filter] == value) { ret.push(obj); } })
            return ret;
        }

    }
    /**LocalData.storeToLocal() returns the current localStorage.content data
     * @param fileInput <input type="files" onchange="LocalData.storeToLocal(this.files)"/> */
    static storeToLocal(fileInput) 
    {
        campaignReader.readAsText(fileInput.item(0));
    }
}

/** LocalData is a set of static functions to manipulate the localStorage.content of the user - Manipulate data for the Campaign World.*/
class WorldData
{
    static getWorldData() 
    {
        if (localStorage.world == "{}" || localStorage.world == undefined) 
        {
            let c = localStorageUtil.getWorld();
            localStorage.world = JSON.stringify(c);
            return c;
        }
        else 
        {
            return JSON.parse(localStorage.world);
        }
    }
    static get(object, filter, value) 
    {
        let data = WorldData.getWorldData();
        //  We're looking for an entire list (Stereotypes, Combat, Scripted...)
        if (!filter)
            return data[object];
        else if (!value) // Should return a list of all items containing the filter key instead.
            return data[object][filter];
        else // We're looking for a specific item within the list => WorldData[object][filter] == value
        {
            let ret = [];
            data[object].forEach(obj => { if (obj[filter] && obj[filter] == value) { ret.push(obj); } })
            return ret;
        }

    }
}

/* Utility functions for the user-triggered mouse events. Helps make sure we click on the <canvas>, for instance. */
const eventManagement =
{
    eventPath: function (el) 
    {
        //Returns an Array of all the elements being touched by an event
        var path = [];
        while (el) {
            path.push(el);
            if (el.tagName === 'HTML') 
            {
                path.push(document);
                path.push(window);
                return path;
            }
            el = el.parentElement;
        }
    },
    restrictToCanvas: function (event) 
    {
        if (!event) { event = window.event; }
        // Prevent Canvas inputs when hovering DOM elements
        if (eventManagement.eventPath(event.target)[1] == document.querySelector('body') 
            || eventManagement.eventPath(event.target)[0] == document.querySelector('#navigationTab')) 
        {
            return true;
        }
        return false;
    }
}

/**RANDOM  * GLOBAL * STUFF */
/**RANDOM  * GLOBAL * STUFF */
/**RANDOM  * GLOBAL * STUFF */
/**RANDOM  * GLOBAL * STUFF */
/**RANDOM  * GLOBAL * STUFF */

/** Selects an amount of elements at random from a list (or a random value of keys in an object)
 * Does not select twice. */
function selectRandom(amount, list) 
{
    let l = clone(clone(list)); let ret = [];
    for (let i = 0; i < amount; i++) 
    {
        let rand = Math.floor(Math.random() * (Object.keys(l).length));
        ret.push(l[rand]);
        l.splice(rand, 1);
    }
    return ret;
}

/** Turn the rgb value into a Hex value understood by <input type="color" /> */
function rgbToHex(r, g, b, a)
{
    let componentToHex = (c) => { var hex = c.toString(16); return hex.length == 1 ? "0" + hex : hex; }

    if (!a)
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    else
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b) + componentToHex(a);
}

/** Clones an object or array so that we don't touch its freakin pointers. */
function clone(obj) 
{
    if (null == obj || "object" != typeof obj) 
    {
        return obj;
    }
    let copy = obj.constructor();
    for (let attr in obj)
    {
        if (obj.hasOwnProperty(attr))
        {
            copy[attr] = obj[attr];
        }
    }
    return copy;
}

/** Deprecated : See fetch() */
function httpGetAsync(theUrl, callback) 
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () 
    {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) 
        {
            callback(xmlHttp.responseText)
        };
    }
    xmlHttp.open("GET", theUrl, true); 
    xmlHttp.send(null);
}

/** DOM functionality. I believe that's used for like the tabs in the Game page, but I'm not even 100% sure... */
function toggleTab(id, state) 
{
    let elt = document.querySelector(`#${id}Tab`);
    if (!state) 
    {
        if (elt.style.display == "none") 
        {
            elt.style.display = "block";
        }
        else 
        {
            elt.style.display = "none";
        }
    }
    else 
    {
        elt.style.display = state
    }
}

/** Oh come on now, what is this even doing here ? When in the name will I make that bloody Shape/Area/Polygon class, huh ?
 * Anyway. Computes the centroid of a given area defined as { shape: [ {x: 0, y :0}, {}, {}, ...] } */
function centroid(area) 
{
    let vertices = clone(area.shape);
    //vertices[vertices.length] = vertices[0];

    let centroid = createVector(0, 0);
    let signedArea = 0.0;
    let x0 = 0.0; // Current vertex X
    let y0 = 0.0; // Current vertex Y
    let x1 = 0.0; // Next vertex X
    let y1 = 0.0; // Next vertex Y
    let a = 0.0;  // Partial signed area

    // For all vertices except last
    let i = 0
    for (i = 0; i < vertices.length - 1; i++) 
    {
        x0 = vertices[i].x;
        y0 = vertices[i].y;
        x1 = vertices[i + 1].x;
        y1 = vertices[i + 1].y;
        a = x0 * y1 - x1 * y0;
        signedArea += a;
        centroid.x += (x0 + x1) * a;
        centroid.y += (y0 + y1) * a;
    }

    // Do last vertex separately to avoid performing an expensive
    // modulus operation in each iteration.
    x0 = vertices[i].x;
    y0 = vertices[i].y;
    x1 = vertices[0].x;
    y1 = vertices[0].y;
    a = x0 * y1 - x1 * y0;
    signedArea += a;
    centroid.x += (x0 + x1) * a;
    centroid.y += (y0 + y1) * a;

    signedArea *= 0.5;
    centroid.x /= (6.0 * signedArea);
    centroid.y /= (6.0 * signedArea);
    return { x: floor(centroid.x), y: floor(centroid.y) };

}

/** Is the Vector withing a Shape (Array of objects with a position attribute) ?
 * I can't seem to recall where I found this code. Likely it came from Coding Train Slack with some pimping by yours truly*/
function intersects(vector, shape) 
{
    let s = clone(shape);
    s[shape.length] = shape[0];
    let wn = 0;
    for (let i = 0; i < s.length - 1; i++) 
    {
        let vec1 = createVector(s[i].x, s[i].y);
        let vec2 = createVector(s[i + 1].x, s[i + 1].y);
        if (vec2.y <= vector.y) 
        {
            if (vec1.y > vector.y) 
            {
                if (isLeft([vec2.x, vec2.y], [vec1.x, vec1.y], [vector.x, vector.y]) > 0)
                {
                    wn++;
                }
            }
        }
        else 
        {
            if (vec1.y <= vector.y) 
            {
                if (isLeft([vec2.x, vec2.y], [vec1.x, vec1.y], [vector.x, vector.y]) < 0) 
                {
                    wn--;
                }
            }
        }
    }
    return wn != 0;
}

/* Used for intersection above*/
function isLeft(P0, P1, P2) 
{
    return ((P1[0] - P0[0]) * (P2[1] - P0[1]) - (P2[0] - P0[0]) * (P1[1] - P0[1]));
}

/** Returns whether a Troop (entity on a Map) intersects with an Area with the isObstacle flag */
function intersectsWithObstacle(entity)
{
    let areas = game.areas;
    let flag = false;
    let p =
    {
        x: entity.position.x,
        y: entity.position.y
    }
    for (let j = 0; j < areas.length; j++) 
    {
        let a = areas[j];
        if (a.isObstacle && intersects(p, a.shape)) 
        {
            return true;
        }
    }
    // Loop around the entity
    if (entity.dimension) 
    {
        for (let i = 0; i < TWO_PI; i += TWO_PI / 12) 
        {
            let p =
            {
                x: entity.position.x + (entity.dimension.x * sin(i)),
                y: entity.position.y + (entity.dimension.x * cos(i))
            }
            for (let j = 0; j < areas.length; j++) 
            {
                let a = areas[j];
                if (a.isObstacle && intersects(p, a.shape))
                {
                    return true;
                }
            }
        }
    }
    return flag;
}

/** Returns whether a Troop (entity on a Map) intersects with another Troop */
function intersectsWithTroop(entity, troops)
{
    // Check if the troop's center intersects
    for (let j = 0; j < troops.length; j++) 
    {
        let t = troops[j];
        if (dist(t.position.x, t.position.y, entity.position.x, entity.position.y) < t.dimension.x) 
        {
            return true;
        }
    }
    // Check if the border of the troop does
    if (entity.dimension) 
    {
        for (let i = 0; i < TWO_PI; i += TWO_PI / 12) 
        {
            let p =
            {
                x: entity.position.x + ((entity.dimension.x + 10) * sin(i)),
                y: entity.position.y + ((entity.dimension.y + 10) * cos(i))
            }

            for (let j = 0; j < troops.length; j++) 
            {
                let t = troops[j];
                if (dist(t.position.x, t.position.y, entity.position.x, entity.position.y) < entity.dimension.x + t.dimension.x + 10)
                {
                    return true;
                }
            }
        }
    }
    return false;
}
/** Returns whether a Troop (entity on a Map) intersects with an Area that gives the "Difficult Terrain" condition */
function insersectsWithDifficultTerrain(point) 
{
    let flag = false;
    let areas = game.areas;
    areas.forEach(a => 
    {
        if (a.conditions && a.conditions[0].name == "Difficult Terrain")
        {
            if (intersects(point, a.shape))
            {
                flag = true;
            }
        }
    });
    return flag;
}

/** Returns the size vector of a given size category (Small-50/Medium-75/Big-100/Large-150/Huge-225/Gargantuan-300) */
function getDimensionFromSizeCategory(size) 
{
    switch (size) 
    {
        case "Small":
            return { "x": "50", "y": "50" }
        case "Medium":
            return { "x": "75", "y": "75" }
        case "Big":
            return { "x": "100", "y": "100" }
        case "Large":
            return { "x": "150", "y": "150" }
        case "Huge":
            return { "x": "225", "y": "225" }
        case "Gargantuan":
            return { "x": "300", "y": "300" }
    }
}

/** Takes in a size in clicks (map unit) and returns an object with the "value" "unit" (10000 => value:100, unit:m. | 100000 =>  value:1, unit:km.)*/
function getDistanceUnit(clickDistance) 
{
    let ret = {};
    if (clickDistance > 100 && clickDistance < 100000) 
    {
        ret = { "unit": "m", "value": floor(clickDistance / 100) }
    }
    else if (clickDistance >= 100000) 
    {
        ret = { "unit": "km", "value": floor(clickDistance / 100000) }
    }
    else 
    {
        ret = { "unit": "clicks", "value": clickDistance }
    }
    return ret;
}

/** Returns a String describing the amount of currency from a given amount. (0.01 => 1 Copper | 0.1 => 1 Silver | 15 => 15 Gold) */
function getCurrency(goldStandard) 
{
    if (goldStandard < 0.1) 
    {
        return `${(goldStandard * 100)} Copper`
    }
    if (goldStandard < 1) 
    {
        return `${goldStandard * 10} Silver`
    }
    if (goldStandard >= 1) 
    {
        return `${goldStandard} Gold`
    }
}

/** Takes in a timestamp and returns an object describing the time since then in various ways {value , unit , unitValue, uV, obj}  */
function getTimeSince(timestamp)
{
    let time = ``;
    time = Date.now() - timestamp;
    if (time / 60000 < 1) {
        time = round(time / 1000);
        return { "value": time, "unit": "minutes", "realUnit": "seconds", "unitValue": 0, "uV": 1, "obj": timestamp }
    }
    else if (time / (60000 * 60) < 1) {
        time = round(time / (1000 * 60));
        return { "value": time, "unit": "hours", "realUnit": "minutes", "unitValue": 0.01, "uV": 60, "obj": timestamp }
    }
    else if (time / (60000 * 60 * 24) < 1) {
        time = round(time / (1000 * 60 * 24));
        return { "value": time, "unit": "days", "realUnit": " x 24 minutes", "unitValue": 0.24, "uV": 60 * 60 }
    }
    else if (time / (60000 * 60 * 30 * 24) < 1) {
        time = round(time / (1000 * 60 * 24 * 30));
        return { "value": time, "unit": "months", "realUnit": " x 12 hours", "unitValue": (30 * 0.24), "uV": 24 * 60 * 60 }
    }
    else {
        time = round(time / (60000 * 60 * 24 * 360));
        return { "value": time, "unit": "years", "realUnit": " x 6 days", "unitValue": (360 * 0.24), "uV": 24 * 60 * 60 }
    }
}

/** Takes in a timestamp and return a String describing the "World Date & Time" for the Campaign mode / Server time */
function getTime(timestamp) 
{
    let t = timestamp - 1549843200;
    let time = ``;

    //ERA
    let EE = floor(t / (1000 * 60 * 60 * 24 * 360));
    t -= EE * (1000 * 60 * 60 * 24 * 360);
    //YEARS
    let YY = floor(t / (1000 * 60 * 24 * 360));
    t -= YY * (1000 * 60 * 24 * 360)
    //MONTHS
    let MM = floor(t / (1000 * 60 * 24 * 30));
    t -= MM * (1000 * 60 * 24 * 30)
    if (MM < 10) { MM = "0" + MM; }
    //DAYS
    let DD = round(t / (1000 * 60 * 24));
    t -= DD * (1000 * 60 * 24);
    DD++;
    if (DD < 10) { DD = "0" + DD; }
    //HOURS
    let hh = floor(t / (1000 * 60));
    t -= hh * (1000 * 60)
    hh = map(hh, -12, 12, 0, 24);
    if (hh < 10) { hh = "0" + hh; }
    //MINUTES
    let mm = floor(t / (1000));
    t -= mm * (1000)
    if (mm < 10) { mm = "0" + mm; }

    time += `Y${YY} - ${MM}/${DD} - ${hh}:${mm} `;
    return time;
}

const WORLD_DATA =
{
    "Sterotypes":
    [
        {
            "name": "Dragonid",
            "modifiers":
                [
                    { "type": "abilityScoreIncrease", "key": "Strength", "value": "2" },
                    { "type": "speed", "value": "900" },
                    { "type": "size", "value": "Medium" },
                    { "type": "armorClass", "value": { "base": 13, "ability": "Dexterity" } },
                    { "type": "pool", "value": { "Dragon Breath": 1 } },
                    { "type": "action", "value": { "name": "Dragon Breath", "uses": "-1", "pool": "Dragon Breath", "expandsPool": "true", "target": "Enemy", "reach": "900", "areaEffect": "450", "damage": "2d6", "damageType": "Any Element", "damageAbility": "None", "saveAbility": "Dexterity", "saveDC": "12" } },
                    { "type": "action", "value": { "name": "Collect Breath", "uses": "2", "target": "Self", "reach": "10", "areaEffect": "1", "condition": { "name": "Recharge", "duration": "0", "recharge": "Dragon Breath, 1" } } }
                ],
            "inventory":
                []
        },
        {
            "name": "Elf",
            "modifiers":
                [
                    { "type": "abilityScoreIncrease", "key": "Dexterity", "value": "2" },
                    { "type": "abilityScoreIncrease", "key": "Intelligence", "value": "1" },
                    { "type": "speed", "value": "1050" },
                    { "type": "size", "value": "Medium" },
                    { "type": "armorClass", "value": { "base": 10, "ability": "Dexterity" } },
                    { "type": "condition", "value": { "name": "Sleep Immunity", "duration": "-1", "immunities": "Sleep, " } },
                    { "type": "condition", "value": { "name": "Charm Advantage", "duration": "-1", "saveAdvantage": "Charmed" } },
                ],
            "inventory":
                []
        },
        {
            "name": "Dwarf",
            "modifiers":
                [
                    { "type": "abilityScoreIncrease", "key": "Constitution", "value": "2" },
                    { "type": "abilityScoreIncrease", "key": "Strength", "value": "1" },
                    { "type": "speed", "value": "750" },
                    { "type": "size", "value": "Small" },
                    { "type": "armorClass", "value": { "base": 10, "ability": "Dexterity" } },
                    { "type": "condition", "value": { "name": "Poison Reistance", "duration": "-1", "resistances": "Poison, ", "saveAdvantage": "Poisoned" } }
                ],
            "inventory":
                []

        },
        {
            "name": "Gnome",
            "modifiers":
                [
                    { "type": "abilityScoreIncrease", "key": "Intelligence", "value": "2" },
                    { "type": "speed", "value": "750" },
                    { "type": "size", "value": "Small" },
                    { "type": "armorClass", "value": { "base": 10, "ability": "Dexterity" } },
                    { "type": "condition", "value": { "name": "Save Intelligence", "duration": "-1", "saveAdvantage": "Intelligence" } },
                    { "type": "condition", "value": { "name": "Save Wisdom", "duration": "-1", "saveAdvantage": "Wisdom" } },
                    { "type": "condition", "value": { "name": "Save Charisma", "duration": "-1", "saveAdvantage": "Charisma" } },
                    { "type": "action", "value": { "name": "Illusion of a Slap", "uses": "-1", "target": "Enemy", "reach": "1800", "areaEffect": "1", "saveAbility": "Intelligence", "saveDC": "12", "saveCancelsDamage": "true", "damage": "1d6", "damageAbility": "Intelligence", "damageExtra": "0", "damageType": "Psychic" } }
                ],
            "inventory":
                []
        },
        {
            "name": "Halfling",
            "modifiers":
                [
                    { "type": "abilityScoreIncrease", "key": "Wisdom", "value": "2" },
                    { "type": "speed", "value": "750" },
                    { "type": "size", "value": "Small" },
                    { "type": "armorClass", "value": { "base": 10, "ability": "Dexterity" } },
                    { "type": "condition", "value": { "name": "Brave", "duration": "-1", "saveAdvantage": "Frightened" } },
                    { "type": "condition", "value": { "name": "Lucky", "duration": "-1", "rerollHit": "1" } },
                ],
            "inventory":
                []
        },
        {
            "name": "Celestial",
            "modifiers":
                [
                    { "type": "abilityScoreIncrease", "key": "Charisma", "value": "2" },
                    { "type": "speed", "value": "1050" },
                    { "type": "size", "value": "Medium" },
                    { "type": "armorClass", "value": { "base": 10, "ability": "Dexterity" } },
                    { "type": "condition", "value": { "name": "Celestial Resistances", "duration": "-1", "resistances": "Radiant, Necrotic, " } },
                    { "type": "action", "value": { "name": "Healing Touch", "target": "Ally", "uses": "1", "reach": "150", "areaEffect": "1", "damage": "-1d20", "damageAbility": "None" } },
                    { "type": "action", "value": { "name": "Unarmed Radiance", "target": "Enemy", "uses": "-1", "reach": "150", "areaEffect": "1", "toHit": "Charisma", "damage": "1d6", "damageAbility": "Charisma", "damageType": "Radiant" } }
                ],
            "inventory":
                []
        },
        {
            "name": "Human",
            "modifiers":
                [
                    { "type": "abilityScoreIncrease", "key": "Strength", "value": "1" },
                    { "type": "abilityScoreIncrease", "key": "Dexterity", "value": "1" },
                    { "type": "abilityScoreIncrease", "key": "Constitution", "value": "1" },
                    { "type": "abilityScoreIncrease", "key": "Intelligence", "value": "1" },
                    { "type": "abilityScoreIncrease", "key": "Wisdom", "value": "1" },
                    { "type": "abilityScoreIncrease", "key": "Charisma", "value": "1" },
                    { "type": "speed", "value": "900" },
                    { "type": "size", "value": "Medium" },
                    { "type": "armorClass", "value": { "base": 10, "ability": "Dexterity" } },
                ],
            "inventory":
                []
        }
    ],
    "Combat Encounters":
    [
        {
            "identifier": "00001",
            "areas": [
                {
                    "name": "",
                    "coloration": "#573b0cff",
                    "shape": "[{\"x\":-5,\"y\":4804},{\"x\":4804,\"y\":4804},{\"x\":4804,\"y\":-5},{\"x\":-5,\"y\":-5}]",
                    "position": {
                        "x": 2400,
                        "y": 2400
                    },
                    "radius": 3400,
                    "randomize": 0,
                    "pointsAmount": 4,
                    "animated": false
                },
                {
                    "name": "",
                    "coloration": "#0080009e",
                    "shape": "[{\"x\":2250,\"y\":4053},{\"x\":2668,\"y\":2805},{\"x\":2098,\"y\":2247},{\"x\":0,\"y\":1501},{\"x\":0,\"y\":4800},{\"x\":1799,\"y\":4800}]",
                    "position": {
                        "x": 1114,
                        "y": 3298
                    },
                    "radius": 50,
                    "randomize": 0,
                    "pointsAmount": 6,
                    "animated": false
                },
                {
                    "name": "Fire",
                    "coloration": "#f9c73f20",
                    "shape": "[{\"x\":3488,\"y\":4512},{\"x\":3909,\"y\":4503},{\"x\":4303,\"y\":4353},{\"x\":4620,\"y\":4065},{\"x\":4786,\"y\":3666},{\"x\":4780,\"y\":3234},{\"x\":4621,\"y\":2834},{\"x\":4317,\"y\":2526},{\"x\":3915,\"y\":2367},{\"x\":3484,\"y\":2368},{\"x\":3087,\"y\":2534},{\"x\":2780,\"y\":2835},{\"x\":2626,\"y\":3236},{\"x\":2613,\"y\":3666},{\"x\":2776,\"y\":4066},{\"x\":3093,\"y\":4357}]",
                    "position": {
                        "x": 3700,
                        "y": 3450
                    },
                    "radius": 1100,
                    "randomize": "0.05",
                    "pointsAmount": "16",
                    "animated": true
                },
                {
                    "name": "",
                    "coloration": "#fae0462c",
                    "shape": "[{\"x\":3594,\"y\":3945},{\"x\":3789,\"y\":3942},{\"x\":3971,\"y\":3871},{\"x\":4110,\"y\":3732},{\"x\":4175,\"y\":3549},{\"x\":4173,\"y\":3357},{\"x\":4104,\"y\":3177},{\"x\":3970,\"y\":3036},{\"x\":3790,\"y\":2955},{\"x\":3595,\"y\":2965},{\"x\":3421,\"y\":3047},{\"x\":3284,\"y\":3180},{\"x\":3201,\"y\":3355},{\"x\":3191,\"y\":3552},{\"x\":3267,\"y\":3736},{\"x\":3415,\"y\":3866}]",
                    "position": {
                        "x": 3692,
                        "y": 3453
                    },
                    "radius": 500,
                    "randomize": 0.05,
                    "pointsAmount": 16,
                    "animated": true
                },
                {
                    "name": "",
                    "coloration": "#fae04637",
                    "shape": "[{\"x\":3642,\"y\":3737},{\"x\":3757,\"y\":3737},{\"x\":3863,\"y\":3694},{\"x\":3945,\"y\":3614},{\"x\":3990,\"y\":3507},{\"x\":3987,\"y\":3392},{\"x\":3942,\"y\":3287},{\"x\":3863,\"y\":3204},{\"x\":3757,\"y\":3160},{\"x\":3642,\"y\":3159},{\"x\":3532,\"y\":3198},{\"x\":3445,\"y\":3280},{\"x\":3405,\"y\":3391},{\"x\":3406,\"y\":3508},{\"x\":3451,\"y\":3616},{\"x\":3534,\"y\":3696}]",
                    "position": {
                        "x": 3700,
                        "y": 3450
                    },
                    "radius": 300,
                    "randomize": 0.05,
                    "pointsAmount": 16,
                    "animated": true
                },
                {
                    "name": "",
                    "coloration": "#ff4e4135",
                    "shape": "[{\"x\":3670,\"y\":3600},{\"x\":3729,\"y\":3599},{\"x\":3783,\"y\":3574},{\"x\":3823,\"y\":3532},{\"x\":3845,\"y\":3478},{\"x\":3846,\"y\":3420},{\"x\":3824,\"y\":3366},{\"x\":3783,\"y\":3324},{\"x\":3730,\"y\":3298},{\"x\":3670,\"y\":3299},{\"x\":3614,\"y\":3321},{\"x\":3571,\"y\":3364},{\"x\":3553,\"y\":3420},{\"x\":3551,\"y\":3479},{\"x\":3573,\"y\":3534},{\"x\":3615,\"y\":3576}]",
                    "position": {
                        "x": 3700,
                        "y": 3450
                    },
                    "radius": 150,
                    "randomize": 0.05,
                    "pointsAmount": 16,
                    "animated": true
                },
                {
                    "name": "",
                    "coloration": "#a2121248",
                    "shape": "[{\"x\":3694,\"y\":3478},{\"x\":3705,\"y\":3478},{\"x\":3716,\"y\":3474},{\"x\":3724,\"y\":3466},{\"x\":3729,\"y\":3455},{\"x\":3729,\"y\":3444},{\"x\":3724,\"y\":3433},{\"x\":3716,\"y\":3425},{\"x\":3705,\"y\":3420},{\"x\":3694,\"y\":3420},{\"x\":3683,\"y\":3425},{\"x\":3674,\"y\":3433},{\"x\":3670,\"y\":3444},{\"x\":3671,\"y\":3455},{\"x\":3675,\"y\":3466},{\"x\":3683,\"y\":3474}]",
                    "position": {
                        "x": 3700,
                        "y": 3450
                    },
                    "radius": 30,
                    "randomize": 0.05,
                    "pointsAmount": 16,
                    "animated": true
                },
                {
                    "name": "Fire",
                    "coloration": "#f9c73f21",
                    "shape": "[{\"x\":3009,\"y\":2058},{\"x\":3391,\"y\":2061},{\"x\":3756,\"y\":1932},{\"x\":4033,\"y\":1657},{\"x\":4164,\"y\":1291},{\"x\":4168,\"y\":907},{\"x\":4020,\"y\":551},{\"x\":3756,\"y\":266},{\"x\":3397,\"y\":107},{\"x\":3002,\"y\":105},{\"x\":2643,\"y\":266},{\"x\":2364,\"y\":541},{\"x\":2233,\"y\":907},{\"x\":2236,\"y\":1291},{\"x\":2383,\"y\":1645},{\"x\":2646,\"y\":1928}]",
                    "position": {
                        "x": 3200,
                        "y": 1100
                    },
                    "radius": 1000,
                    "randomize": 0.05,
                    "pointsAmount": 16,
                    "animated": true
                },
                {
                    "name": "",
                    "coloration": "#fae0463b",
                    "shape": "[{\"x\":3112,\"y\":1539},{\"x\":3287,\"y\":1541},{\"x\":3445,\"y\":1467},{\"x\":3566,\"y\":1345},{\"x\":3631,\"y\":1185},{\"x\":3635,\"y\":1013},{\"x\":3571,\"y\":851},{\"x\":3452,\"y\":722},{\"x\":3287,\"y\":661},{\"x\":3111,\"y\":653},{\"x\":2946,\"y\":720},{\"x\":2820,\"y\":846},{\"x\":2755,\"y\":1011},{\"x\":2755,\"y\":1188},{\"x\":2824,\"y\":1350},{\"x\":2953,\"y\":1469}]",
                    "position": {
                        "x": 3200,
                        "y": 1100
                    },
                    "radius": 450,
                    "randomize": 0.05,
                    "pointsAmount": 16,
                    "animated": true
                },
                {
                    "name": "",
                    "coloration": "#fae04648",
                    "shape": "[{\"x\":3140,\"y\":1400},{\"x\":3259,\"y\":1400},{\"x\":3368,\"y\":1351},{\"x\":3454,\"y\":1269},{\"x\":3497,\"y\":1159},{\"x\":3496,\"y\":1041},{\"x\":3451,\"y\":932},{\"x\":3367,\"y\":849},{\"x\":3257,\"y\":810},{\"x\":3142,\"y\":810},{\"x\":3035,\"y\":853},{\"x\":2950,\"y\":933},{\"x\":2909,\"y\":1042},{\"x\":2905,\"y\":1158},{\"x\":2948,\"y\":1268},{\"x\":3030,\"y\":1353}]",
                    "position": {
                        "x": 3200,
                        "y": 1100
                    },
                    "radius": 300,
                    "randomize": 0.05,
                    "pointsAmount": 16,
                    "animated": true
                },
                {
                    "name": "",
                    "coloration": "#ff4e4133",
                    "shape": "[{\"x\":3171,\"y\":1244},{\"x\":3229,\"y\":1246},{\"x\":3284,\"y\":1226},{\"x\":3328,\"y\":1185},{\"x\":3349,\"y\":1129},{\"x\":3346,\"y\":1070},{\"x\":3322,\"y\":1017},{\"x\":3283,\"y\":974},{\"x\":3229,\"y\":951},{\"x\":3170,\"y\":951},{\"x\":3116,\"y\":975},{\"x\":3075,\"y\":1017},{\"x\":3054,\"y\":1071},{\"x\":3056,\"y\":1128},{\"x\":3077,\"y\":1182},{\"x\":3117,\"y\":1223}]",
                    "position": {
                        "x": 3200,
                        "y": 1100
                    },
                    "radius": 150,
                    "randomize": 0.05,
                    "pointsAmount": 16,
                    "animated": true
                },
                {
                    "name": "",
                    "coloration": "#a212124b",
                    "shape": "[{\"x\":3194,\"y\":1129},{\"x\":3205,\"y\":1129},{\"x\":3216,\"y\":1125},{\"x\":3225,\"y\":1117},{\"x\":3229,\"y\":1105},{\"x\":3228,\"y\":1094},{\"x\":3224,\"y\":1083},{\"x\":3216,\"y\":1075},{\"x\":3205,\"y\":1070},{\"x\":3194,\"y\":1070},{\"x\":3183,\"y\":1075},{\"x\":3175,\"y\":1083},{\"x\":3171,\"y\":1094},{\"x\":3170,\"y\":1105},{\"x\":3174,\"y\":1116},{\"x\":3183,\"y\":1125}]",
                    "position": {
                        "x": 3200,
                        "y": 1100
                    },
                    "radius": 30,
                    "randomize": 0.05,
                    "pointsAmount": 16,
                    "animated": true
                },
                {
                    "name": "Caverns, East",
                    "coloration": "#2b2b28ff",
                    "shape": "[{\"x\":3514,\"y\":2772},{\"x\":3608,\"y\":2953},{\"x\":3900,\"y\":3085},{\"x\":4198,\"y\":2944},{\"x\":4456,\"y\":3047},{\"x\":4807,\"y\":3354},{\"x\":4803,\"y\":1473},{\"x\":4504,\"y\":1473},{\"x\":4192,\"y\":1789},{\"x\":3541,\"y\":1957},{\"x\":3334,\"y\":2090},{\"x\":3323,\"y\":2225},{\"x\":3415,\"y\":2482}]",
                    "position": {
                        "x": 4194,
                        "y": 2376
                    },
                    "radius": 300,
                    "randomize": 0,
                    "pointsAmount": 13,
                    "animated": false,
                    "isObstacle": true
                },
                {
                    "name": "Caverns, South",
                    "coloration": "#2b2b28ff",
                    "shape": "[{\"x\":4801,\"y\":4799},{\"x\":4801,\"y\":3598},{\"x\":4443,\"y\":3990},{\"x\":4056,\"y\":4120},{\"x\":3739,\"y\":4158},{\"x\":3550,\"y\":4067},{\"x\":3439,\"y\":3856},{\"x\":3300,\"y\":3748},{\"x\":3300,\"y\":3002},{\"x\":2961,\"y\":2659},{\"x\":2663,\"y\":2811},{\"x\":2251,\"y\":4053},{\"x\":1800,\"y\":4801}]",
                    "position": {
                        "x": 3261,
                        "y": 4100
                    },
                    "radius": 300,
                    "randomize": 0,
                    "pointsAmount": 13,
                    "animated": false,
                    "isObstacle": true
                },
                {
                    "name": "Caverns, North",
                    "coloration": "#2b2b28ff",
                    "shape": "[{\"x\":2994,\"y\":744},{\"x\":3290,\"y\":598},{\"x\":3749,\"y\":745},{\"x\":4053,\"y\":747},{\"x\":4346,\"y\":1046},{\"x\":4506,\"y\":1487},{\"x\":4814,\"y\":1513},{\"x\":4798,\"y\":469},{\"x\":4797,\"y\":0},{\"x\":1,\"y\":0},{\"x\":0,\"y\":1499},{\"x\":449,\"y\":1801},{\"x\":1382,\"y\":1998},{\"x\":2090,\"y\":2244},{\"x\":2572,\"y\":2151},{\"x\":3000,\"y\":2067},{\"x\":3187,\"y\":1842},{\"x\":3343,\"y\":1714},{\"x\":3286,\"y\":1497},{\"x\":2845,\"y\":1348},{\"x\":2835,\"y\":1050}]",
                    "position": {
                        "x": 2119,
                        "y": 910
                    },
                    "radius": 300,
                    "randomize": 0,
                    "pointsAmount": 21,
                    "animated": false,
                    "isObstacle": true
                },
                {
                    "name": "Bushes",
                    "coloration": "#004000ce",
                    "shape": "[{\"x\":1340,\"y\":3760},{\"x\":1510,\"y\":3770},{\"x\":1630,\"y\":3750},{\"x\":1820,\"y\":3610},{\"x\":1810,\"y\":3420},{\"x\":1730,\"y\":3250},{\"x\":1590,\"y\":3190},{\"x\":1380,\"y\":3250},{\"x\":1260,\"y\":3280},{\"x\":1160,\"y\":3430},{\"x\":1160,\"y\":3560},{\"x\":1200,\"y\":3625},{\"x\":1280,\"y\":3685}]",
                    "position": {
                        "x": 1496,
                        "y": 3487
                    },
                    "radius": 314,
                    "randomize": "1.1",
                    "pointsAmount": "13",
                    "animated": false,
                    "isObstacle": false,
                    "conditions": [
                        {
                            "name": "Difficult Terrain",
                            "duration": 0,
                            "moveMod": -0.5
                        }
                    ]
                },
                {
                    "name": "Bushes",
                    "coloration": "#004000ce",
                    "shape": "[{\"x\":931,\"y\":2677},{\"x\":1050,\"y\":2620},{\"x\":1116,\"y\":2531},{\"x\":1200,\"y\":2480},{\"x\":1273,\"y\":2366},{\"x\":1247,\"y\":2228},{\"x\":1146,\"y\":2121},{\"x\":1000,\"y\":2030},{\"x\":806,\"y\":2030},{\"x\":604,\"y\":2127},{\"x\":530,\"y\":2340},{\"x\":639,\"y\":2536},{\"x\":805,\"y\":2619}]",
                    "position": {
                        "x": 899,
                        "y": 2330
                    },
                    "radius": 335,
                    "randomize": 1.1,
                    "pointsAmount": 13,
                    "animated": false,
                    "isObstacle": false,
                    "conditions": [
                        {
                            "name": "Difficult Terrain",
                            "duration": 0,
                            "moveMod": -0.5
                        }
                    ]
                }
            ],
            "groups": [
                {
                    "name": "Adventurers",
                    "color": "#8080c0",
                    "troops": [
                        {
                            "name": "Genji Takeda",
                            "stk": "#8080c0",
                            "position": {
                                "x": 1190,
                                "y": 3750
                            },
                            "dimension": {
                                "x": 75,
                                "y": 75
                            },
                            "isPlayer": false,
                            "abilityScores": {
                                "Strength": {
                                    "score": 9,
                                    "bonus": -1
                                },
                                "Dexterity": {
                                    "score": 16,
                                    "bonus": 3
                                },
                                "Constitution": {
                                    "score": 12,
                                    "bonus": 1
                                },
                                "Intelligence": {
                                    "score": 12,
                                    "bonus": 1
                                },
                                "Wisdom": {
                                    "score": 10,
                                    "bonus": 0
                                },
                                "Charisma": {
                                    "score": 14,
                                    "bonus": 2
                                }
                            },
                            "hitPoints": {
                                "dieAmount": 2,
                                "dieType": 10,
                                "bonus": 13,
                                "formula": "2d10+13"
                            },
                            "AC": "17",
                            "armorClass": 17,
                            "speed": 900,
                            "movement": 900,
                            "actionsPerTurn": 1,
                            "actions": [
                                {
                                    "name": "Dash",
                                    "target": "Self",
                                    "reach": 10,
                                    "areaEffect": 1,
                                    "uses": -1,
                                    "condition": {
                                        "name": "Dashing",
                                        "duration": 0,
                                        "moveMod": 1
                                    }
                                },
                                {
                                    "name": "Dodge",
                                    "target": "Self",
                                    "reach": 10,
                                    "areaEffect": 1,
                                    "uses": -1,
                                    "condition": {
                                        "name": "Dodging",
                                        "duration": 0,
                                        "disadvantageTarget": true
                                    }
                                },
                                {
                                    "name": "Help",
                                    "target": "Ally",
                                    "reach": 150,
                                    "areaEffect": 1,
                                    "uses": -1,
                                    "condition": {
                                        "name": "Helped by Genji Takeda",
                                        "duration": 1,
                                        "advantageHit": true
                                    }
                                },
                                {
                                    "name": "Katana",
                                    "damage": "1d8",
                                    "damageAbility": "Dexterity",
                                    "damageType": "Slashing",
                                    "toHit": "Dexterity",
                                    "toHitExtra": 2,
                                    "target": "Enemy",
                                    "uses": -1,
                                    "reach": 150,
                                    "areaEffect": 1
                                },
                                {
                                    "name": "Smite",
                                    "damage": "3d8",
                                    "damageAbility": "Dexterity",
                                    "damageType": "Radiant",
                                    "toHit": "Dexterity",
                                    "toHitExtra": 2,
                                    "target": "Enemy",
                                    "uses": -1,
                                    "pool": "Level 1 spell slots",
                                    "expandsPool": "true",
                                    "onSuccess": true,
                                    "reach": 150,
                                    "areaEffect": 1
                                },
                                {
                                    "name": "Lay on Hands",
                                    "damage": "-5",
                                    "target": "Ally",
                                    "uses": 3,
                                    "reach": 150,
                                    "areaEffect": 1
                                },
                                {
                                    "name": "Divine Protection",
                                    "target": "Ally",
                                    "uses": -1,
                                    "reach": 600,
                                    "areaEffect": 1,
                                    "pool": "Level 1 spell slots",
                                    "expandsPool": "true",
                                    "condition": {
                                        "name": "Protected ",
                                        "duration": -1,
                                        "disadvantageTarget": "true"
                                    }
                                },
                                {
                                    "name": "True Strike",
                                    "target": "Enemy",
                                    "uses": -1,
                                    "reach": 900,
                                    "areaEffect": 1,
                                    "condition": {
                                        "name": "Striked by Genji",
                                        "duration": 0,
                                        "advantageTarget": "true"
                                    }
                                },
                                {
                                    "name": "Command",
                                    "target": "Enemy",
                                    "uses": -1,
                                    "reach": 900,
                                    "areaEffect": 1,
                                    "pool": "Level 1 spell slots",
                                    "expandsPool": "true",
                                    "condition": {
                                        "name": "Commanded by Genji",
                                        "duration": 10,
                                        "save": "Wisdom",
                                        "saveDC": "12",
                                        "charm": "true"
                                    }
                                },
                                {
                                    "name": "Longbow",
                                    "damage": "1d8",
                                    "damageAbility": "Dexterity",
                                    "damageType": "Piercing",
                                    "toHit": "Dexterity",
                                    "toHitExtra": 4,
                                    "target": "Enemy",
                                    "uses": -1,
                                    "reach": 4500,
                                    "areaEffect": 1
                                }
                            ],
                            "conditions": [],
                            "pools": {
                                "Level 1 spell slots": 3
                            }
                        }
                    ]
                },
                {
                    "name": "Goblins",
                    "color": "#800040",
                    "troops": [
                        {
                            "name": "Goblin Archer",
                            "stk": "#800040",
                            "position": {
                                "x": 3000,
                                "y": 2552
                            },
                            "dimension": {
                                "x": 50,
                                "y": 50
                            },
                            "isPlayer": false,
                            "abilityScores": {
                                "Strength": {
                                    "score": 8,
                                    "bonus": -1
                                },
                                "Dexterity": {
                                    "score": 14,
                                    "bonus": 2
                                },
                                "Constitution": {
                                    "score": 10,
                                    "bonus": 0
                                },
                                "Intelligence": {
                                    "score": 10,
                                    "bonus": 0
                                },
                                "Wisdom": {
                                    "score": 8,
                                    "bonus": -1
                                },
                                "Charisma": {
                                    "score": 8,
                                    "bonus": -1
                                }
                            },
                            "hitPoints": {
                                "dieAmount": 2,
                                "dieType": 6,
                                "bonus": 0,
                                "formula": "2d6+0"
                            },
                            "AC": 13,
                            "armorClass": 13,
                            "speed": 900,
                            "movement": 900,
                            "actionsPerTurn": 1,
                            "actions": [
                                {
                                    "name": "Dash",
                                    "target": "Self",
                                    "reach": 10,
                                    "areaEffect": 1,
                                    "uses": -1,
                                    "condition": {
                                        "name": "Dashing",
                                        "duration": 0,
                                        "moveMod": 1,
                                        "damage": 0
                                    }
                                },
                                {
                                    "name": "Dodge",
                                    "target": "Self",
                                    "reach": 10,
                                    "areaEffect": 1,
                                    "uses": -1,
                                    "condition": {
                                        "name": "Dodging",
                                        "duration": 0,
                                        "disadvantageTarget": true
                                    }
                                },
                                {
                                    "name": "Help",
                                    "target": "Ally",
                                    "reach": 150,
                                    "areaEffect": 1,
                                    "uses": -1,
                                    "condition": {
                                        "name": "Helped by Goblin Archer",
                                        "duration": 1,
                                        "advantageHit": true
                                    }
                                },
                                {
                                    "name": "Dagger",
                                    "damage": "1d4",
                                    "damageAbility": "Dexterity",
                                    "damageType": "Slashing",
                                    "toHit": "Dexterity",
                                    "toHitExtra": 2,
                                    "target": "Enemy",
                                    "uses": -1,
                                    "reach": 150,
                                    "areaEffect": 1
                                },
                                {
                                    "name": "Shortbow",
                                    "damage": "1d6",
                                    "damageAbility": "Dexterity",
                                    "damageType": "Piercing",
                                    "toHit": "Dexterity",
                                    "toHitExtra": 2,
                                    "target": "Enemy",
                                    "uses": -1,
                                    "reach": 2400,
                                    "areaEffect": 1,
                                    "pool": "Arrows",
                                    "expandsPool": "true"
                                },
                                {
                                    "name": "Poison Vial",
                                    "target": "Point",
                                    "uses": -1,
                                    "pool": "Poison Vials",
                                    "expandsPool": "true",
                                    "reach": 900,
                                    "areaEffect": 300,
                                    "condition": {
                                        "name": "Poisoned",
                                        "duration": 5,
                                        "damage": "1d6",
                                        "save": "Constitution",
                                        "saveDC": 12
                                    }
                                }
                            ],
                            "conditions": [],
                            "pools": {
                                "Arrows": 10,
                                "Poison Vials": 1
                            }
                        },
                        {
                            "name": "Goblin Troop",
                            "stk": "#800040",
                            "position": {
                                "x": 3132,
                                "y": 2395
                            },
                            "dimension": {
                                "x": 50,
                                "y": 50
                            },
                            "isPlayer": false,
                            "abilityScores": {
                                "Strength": {
                                    "score": 8,
                                    "bonus": -1
                                },
                                "Dexterity": {
                                    "score": 14,
                                    "bonus": 2
                                },
                                "Constitution": {
                                    "score": 10,
                                    "bonus": 0
                                },
                                "Intelligence": {
                                    "score": 10,
                                    "bonus": 0
                                },
                                "Wisdom": {
                                    "score": 8,
                                    "bonus": -1
                                },
                                "Charisma": {
                                    "score": 8,
                                    "bonus": -1
                                }
                            },
                            "hitPoints": {
                                "dieAmount": 2,
                                "dieType": 6,
                                "bonus": 0,
                                "formula": "2d6+0"
                            },
                            "AC": 15,
                            "armorClass": 15,
                            "speed": 900,
                            "movement": 900,
                            "actionsPerTurn": 1,
                            "actions": [
                                {
                                    "name": "Dash",
                                    "target": "Self",
                                    "reach": 10,
                                    "areaEffect": 1,
                                    "uses": -1,
                                    "condition": {
                                        "name": "Dashing",
                                        "duration": 0,
                                        "moveMod": 1
                                    }
                                },
                                {
                                    "name": "Dodge",
                                    "target": "Self",
                                    "reach": 10,
                                    "areaEffect": 1,
                                    "uses": -1,
                                    "condition": {
                                        "name": "Dodging",
                                        "duration": 0,
                                        "disadvantageTarget": true
                                    }
                                },
                                {
                                    "name": "Help",
                                    "target": "Ally",
                                    "reach": 150,
                                    "areaEffect": 1,
                                    "uses": -1,
                                    "condition": {
                                        "name": "Helped by Goblin Troop",
                                        "duration": 1,
                                        "advantageHit": true
                                    }
                                },
                                {
                                    "name": "Scimitar",
                                    "damage": "1d6",
                                    "damageAbility": "Strength",
                                    "damageType": "Slashing",
                                    "toHit": "Dexterity",
                                    "toHitExtra": 2,
                                    "target": "Enemy",
                                    "uses": -1,
                                    "reach": 150,
                                    "areaEffect": 1
                                }
                            ],
                            "conditions": [],
                            "pools": {}
                        },
                        {
                            "name": "Goblin Boss",
                            "stk": "#800040",
                            "position": {
                                "x": 3300,
                                "y": 911
                            },
                            "dimension": {
                                "x": 60,
                                "y": 60
                            },
                            "isPlayer": false,
                            "abilityScores": {
                                "Strength": {
                                    "bonus": 0,
                                    "score": 10
                                },
                                "Dexterity": {
                                    "bonus": 2,
                                    "score": 14
                                },
                                "Constitution": {
                                    "bonus": 0,
                                    "score": 10
                                },
                                "Intelligence": {
                                    "bonus": 0,
                                    "score": 10
                                },
                                "Wisdom": {
                                    "bonus": -1,
                                    "score": 8
                                },
                                "Charisma": {
                                    "bonus": 0,
                                    "score": 10
                                }
                            },
                            "hitPoints": {
                                "dieAmount": 6,
                                "dieType": 6,
                                "bonus": 0,
                                "formula": "6d6+0"
                            },
                            "AC": 17,
                            "armorClass": 17,
                            "speed": 900,
                            "movement": 900,
                            "actionsPerTurn": 1,
                            "actions": [
                                {
                                    "name": "Dash",
                                    "target": "Self",
                                    "reach": 10,
                                    "areaEffect": 1,
                                    "uses": -1,
                                    "condition": {
                                        "name": "Dashing",
                                        "duration": 0,
                                        "moveMod": 1
                                    }
                                },
                                {
                                    "name": "Dodge",
                                    "target": "Self",
                                    "reach": 10,
                                    "areaEffect": 1,
                                    "uses": -1,
                                    "condition": {
                                        "name": "Dodging",
                                        "duration": 0,
                                        "disadvantageTarget": true
                                    }
                                },
                                {
                                    "name": "Help",
                                    "target": "Ally",
                                    "reach": 150,
                                    "areaEffect": 1,
                                    "uses": -1,
                                    "condition": {
                                        "name": "Helped by Goblin Boss",
                                        "duration": 1,
                                        "advantageHit": true
                                    }
                                },
                                {
                                    "name": "Scimitar",
                                    "damage": "1d6",
                                    "damageAbility": "Dexterity",
                                    "damageType": "Slashing",
                                    "toHit": "Dexterity",
                                    "toHitExtra": 2,
                                    "target": "Enemy",
                                    "uses": -1,
                                    "reach": 150,
                                    "areaEffect": 1
                                },
                                {
                                    "name": "Javelin (Thrown)",
                                    "damage": "1d6",
                                    "damageAbility": "Dexterity",
                                    "damageType": "Piercing",
                                    "toHit": "Dexterity",
                                    "toHitExtra": 2,
                                    "target": "Enemy",
                                    "uses": -1,
                                    "pool": "Javelins",
                                    "expandsPool": "true",
                                    "reach": 900,
                                    "areaEffect": 1
                                }
                            ],
                            "conditions": [],
                            "pools": {
                                "Javelins": 5
                            }
                        },
                        {
                            "name": "Goblin Troop",
                            "stk": "#800040",
                            "position": {
                                "x": 3296,
                                "y": 1212
                            },
                            "dimension": {
                                "x": 50,
                                "y": 50
                            },
                            "isPlayer": false,
                            "abilityScores": {
                                "Strength": {
                                    "score": 8,
                                    "bonus": -1
                                },
                                "Dexterity": {
                                    "score": 14,
                                    "bonus": 2
                                },
                                "Constitution": {
                                    "score": 10,
                                    "bonus": 0
                                },
                                "Intelligence": {
                                    "score": 10,
                                    "bonus": 0
                                },
                                "Wisdom": {
                                    "score": 8,
                                    "bonus": -1
                                },
                                "Charisma": {
                                    "score": 8,
                                    "bonus": -1
                                }
                            },
                            "hitPoints": {
                                "dieAmount": 2,
                                "dieType": 6,
                                "bonus": 0,
                                "formula": "2d6+0"
                            },
                            "AC": 15,
                            "armorClass": 15,
                            "speed": 900,
                            "movement": 900,
                            "actionsPerTurn": 1,
                            "actions": [
                                {
                                    "name": "Dash",
                                    "target": "Self",
                                    "reach": 10,
                                    "areaEffect": 1,
                                    "uses": -1,
                                    "condition": {
                                        "name": "Dashing",
                                        "duration": 0,
                                        "moveMod": 1
                                    }
                                },
                                {
                                    "name": "Dodge",
                                    "target": "Self",
                                    "reach": 10,
                                    "areaEffect": 1,
                                    "uses": -1,
                                    "condition": {
                                        "name": "Dodging",
                                        "duration": 0,
                                        "disadvantageTarget": true
                                    }
                                },
                                {
                                    "name": "Help",
                                    "target": "Ally",
                                    "reach": 150,
                                    "areaEffect": 1,
                                    "uses": -1,
                                    "condition": {
                                        "name": "Helped by Goblin Troop",
                                        "duration": 1,
                                        "advantageHit": true
                                    }
                                },
                                {
                                    "name": "Scimitar",
                                    "damage": "1d6",
                                    "damageAbility": "Strength",
                                    "damageType": "Slashing",
                                    "toHit": "Dexterity",
                                    "toHitExtra": 2,
                                    "target": "Enemy",
                                    "uses": -1,
                                    "reach": 150,
                                    "areaEffect": 1
                                }
                            ],
                            "conditions": [],
                            "pools": {}
                        },
                        {
                            "name": "Goblin Troop",
                            "stk": "#800040",
                            "position": {
                                "x": 3450,
                                "y": 1053
                            },
                            "dimension": {
                                "x": 50,
                                "y": 50
                            },
                            "isPlayer": false,
                            "abilityScores": {
                                "Strength": {
                                    "score": 8,
                                    "bonus": -1
                                },
                                "Dexterity": {
                                    "score": 14,
                                    "bonus": 2
                                },
                                "Constitution": {
                                    "score": 10,
                                    "bonus": 0
                                },
                                "Intelligence": {
                                    "score": 10,
                                    "bonus": 0
                                },
                                "Wisdom": {
                                    "score": 8,
                                    "bonus": -1
                                },
                                "Charisma": {
                                    "score": 8,
                                    "bonus": -1
                                }
                            },
                            "initiativeBonus": 2,
                            "hitPoints": {
                                "dieAmount": 2,
                                "dieType": 6,
                                "bonus": 0,
                                "formula": "2d6+0"
                            },
                            "AC": 15,
                            "armorClass": 15,
                            "speed": 900,
                            "movement": 900,
                            "actionsPerTurn": 1,
                            "actions": [
                                {
                                    "name": "Dash",
                                    "target": "Self",
                                    "reach": 10,
                                    "areaEffect": 1,
                                    "uses": -1,
                                    "condition": {
                                        "name": "Dashing",
                                        "duration": 0,
                                        "moveMod": 1
                                    }
                                },
                                {
                                    "name": "Dodge",
                                    "target": "Self",
                                    "reach": 10,
                                    "areaEffect": 1,
                                    "uses": -1,
                                    "condition": {
                                        "name": "Dodging",
                                        "duration": 0,
                                        "disadvantageTarget": true
                                    }
                                },
                                {
                                    "name": "Help",
                                    "target": "Ally",
                                    "reach": 150,
                                    "areaEffect": 1,
                                    "uses": -1,
                                    "condition": {
                                        "name": "Helped by Goblin Troop",
                                        "duration": 1,
                                        "advantageHit": true
                                    }
                                },
                                {
                                    "name": "Scimitar",
                                    "damage": "1d6",
                                    "damageAbility": "Strength",
                                    "damageType": "Slashing",
                                    "toHit": "Dexterity",
                                    "toHitExtra": 2,
                                    "target": "Enemy",
                                    "uses": -1,
                                    "reach": 150,
                                    "areaEffect": 1
                                }
                            ],
                            "conditions": [],
                            "pools": {}
                        },
                        {
                            "name": "Goblin Archer",
                            "stk": "#800040",
                            "position": {
                                "x": 3000,
                                "y": 1044
                            },
                            "dimension": {
                                "x": 50,
                                "y": 50
                            },
                            "isPlayer": false,
                            "abilityScores": {
                                "Strength": {
                                    "score": 8,
                                    "bonus": -1
                                },
                                "Dexterity": {
                                    "score": 14,
                                    "bonus": 2
                                },
                                "Constitution": {
                                    "score": 10,
                                    "bonus": 0
                                },
                                "Intelligence": {
                                    "score": 10,
                                    "bonus": 0
                                },
                                "Wisdom": {
                                    "score": 8,
                                    "bonus": -1
                                },
                                "Charisma": {
                                    "score": 8,
                                    "bonus": -1
                                }
                            },
                            "initiativeBonus": 2,
                            "hitPoints": {
                                "dieAmount": 2,
                                "dieType": 6,
                                "bonus": 0,
                                "formula": "2d6+0"
                            },
                            "AC": 13,
                            "armorClass": 13,
                            "speed": 900,
                            "movement": 900,
                            "actionsPerTurn": 1,
                            "actions": [
                                {
                                    "name": "Dash",
                                    "target": "Self",
                                    "reach": 10,
                                    "areaEffect": 1,
                                    "uses": -1,
                                    "condition": {
                                        "name": "Dashing",
                                        "duration": 0,
                                        "moveMod": 1,
                                        "damage": 0
                                    }
                                },
                                {
                                    "name": "Dodge",
                                    "target": "Self",
                                    "reach": 10,
                                    "areaEffect": 1,
                                    "uses": -1,
                                    "condition": {
                                        "name": "Dodging",
                                        "duration": 0,
                                        "disadvantageTarget": true
                                    }
                                },
                                {
                                    "name": "Help",
                                    "target": "Ally",
                                    "reach": 150,
                                    "areaEffect": 1,
                                    "uses": -1,
                                    "condition": {
                                        "name": "Helped by Goblin Archer",
                                        "duration": 1,
                                        "advantageHit": true
                                    }
                                },
                                {
                                    "name": "Dagger",
                                    "damage": "1d4",
                                    "damageAbility": "Dexterity",
                                    "damageType": "Slashing",
                                    "toHit": "Dexterity",
                                    "toHitExtra": 2,
                                    "target": "Enemy",
                                    "uses": -1,
                                    "reach": 150,
                                    "areaEffect": 1
                                },
                                {
                                    "name": "Shortbow",
                                    "damage": "1d6",
                                    "damageAbility": "Dexterity",
                                    "damageType": "Piercing",
                                    "toHit": "Dexterity",
                                    "toHitExtra": 2,
                                    "target": "Enemy",
                                    "uses": -1,
                                    "reach": 2400,
                                    "areaEffect": 1,
                                    "pool": "Arrows"
                                },
                                {
                                    "name": "Poison Vial",
                                    "target": "Point",
                                    "uses": -1,
                                    "pool": "Poison Vials",
                                    "expandsPool": "true",
                                    "reach": 900,
                                    "areaEffect": 300,
                                    "condition": {
                                        "name": "Poisoned",
                                        "duration": 5,
                                        "damage": "1d6",
                                        "save": "Constitution",
                                        "saveDC": 12
                                    }
                                }
                            ],
                            "conditions": [],
                            "pools": {
                                "Arrows": 20,
                                "Poison Vials": 1
                            }
                        }
                    ]
                }
            ],
            "name": "Goblin's Caverns",
            "mapSize": 4800,
            "description": ""
        }
    ],
    "Scripted Interactions":
    [
        {
            "identifier": "00001",
            "name": "Visiting Velio ",
            "text": "The village of Velio is a quiet place. ",
            "options":
                [
                    { "text": "Visit Smithy", "leadsToVendor": "00001" },
                    { "text": "Visit the Village Elder", "leadsToInteraction": "00002" },

                    //{"text" : "Lead to Combat Encounter", "leadsToCombat" : "00001"},
                    { "text": "Leave", "leadsToCampaign": true },
                ]
        },
        {
            "identifier": "00002",
            "name": "Vielo's Elder",
            "text": "The village elder is an old woman with bright blue eyes. She stares at you for a moment before asking : <br/> - What is this about ?",
            "options":
                [
                    { "text": "Exit", "leadsToInteraction": "00001" },
                ]
        },
    ],
    "Entities":
    [

    ],
    "Vendors":
    [
        {
            "identifier": 00001, "gold": 1000, "items": [
                { "name": "Ring Mail", "cost": "30", "slots": "Body, ", "modifiers": [{ "type": "armorClass", "value": { "base": 14 } }] },
                { "name": "Shield", "slots": "Left Hand, Right Hand, ", "cost": 10, "modifiers": [{ "type": "armorClassBonus", "value": 2 }] },
                { "name": "Hide Armor", "cost": "10", "slots": "Body, ", "modifiers": [{ "type": "armorClass", "value": { "base": 12, "ability": "Dexterity", "maximum": 2 } }] },
                { "name": "Shortbow Arrows", "slots": "Consumable, ", "modifiers": [{ "type": "pool", "value": { "Shortbow Ammunition": 5 } }], "cost": 0.5 },
                { "name": "Shortbow", "slots": "Both Hands, ", "modifiers": [{ "type": "action", "value": { "name": "Shortbow (Two-Handed)", "uses": "-1", "pool": "Shortbow Ammunition", "expandsPool": "true", "target": "Enemy", "areaEffect": "1", "toHit": "Dexterity", "damage": "1d6", "damageAbility": "Dexterity", "damageType": "Piercing", "reach": "2400" } }, { "type": "pool", "value": { "Shortbow": 1 } }, { "type": "pool", "value": { "Shortbow Ammunition": 10 } }], "cost": 6 },
                { "name": "Subtle Shortsword", "slots": "Left Hand, Right Hand, ", "modifiers": [{ "type": "action", "value": { "name": "Shortsword", "uses": "-1", "pool": "Shortsword", "target": "Enemy", "areaEffect": "1", "toHit": "Dexterity", "damage": "1d6", "damageAbility": "Dexterity", "damageType": "Piercing", "reach": "150" } }, { "type": "pool", "value": { "Shortsword": 1 } }], "cost": 10 },
                { "name": "Longsword", "slots": "Left Hand, Right Hand, Both Hands, ", "modifiers": [{ "type": "action", "value": { "name": "Longsword (Two-Handed)", "uses": "-1", "pool": "Longsword", "target": "Enemy", "areaEffect": "1", "toHit": "Strength", "damage": "1d10", "damageAbility": "Strength", "damageType": "Slashing", "reach": "150" } }, { "type": "action", "value": { "name": "Longsword", "uses": "-1", "pool": "Longsword", "target": "Enemy", "areaEffect": "1", "toHit": "Strength", "damage": "1d8", "damageAbility": "Strength", "damageType": "Slashing", "reach": "150" } }, { "type": "pool", "value": { "Longsword": 1 } }], "cost": 12 },
                { "name": "Maul", "slots": "Both Hands, ", "modifiers": [{ "type": "action", "value": { "name": "Maul (Two-Handed)", "uses": "-1", "pool": "Maul", "target": "Enemy", "areaEffect": "1", "toHit": "Strength", "damage": "2d6", "damageAbility": "Strength", "damageType": "Bludgeoning", "reach": "150" } }, { "type": "pool", "value": { "Maul": 1 } }], "cost": 15 },
                { "name": "Helmet of Minor Constitution", "slots": "Forehead, ", "cost": 104, "modifiers": [{ "type": "abilityScoreIncrease", "key": "Constitution", "value": 2 }] },
                { "name": "Helmet of Minor Spellcasting", "slots": "Forehead, ", "cost": 174, "modifiers": [{ "type": "pool", "value": { "Cantrips": 1, "First Level Spells": 1 } }, { "type": "action", "value": { "name": "Fiery Hands", "uses": "-1", "pool": "Cantrips", "target": "Enemy", "areaEffect": "1", "toHit": "None", "damage": "1d10", "damageType": "Fire", "reach": "150" } }, { "type": "action", "value": { "name": "Disruption", "uses": "-1", "pool": "Cantrips", "target": "Enemy", "areaEffect": "1", "saveAbility": "Charisma", "saveDC": 12, "saveCancelsDamage": "true", "damage": "1d4", "damageType": "Psychic", "reach": "150", "condition": { "name": "Perturbed", "duration": "1", "saveDisadvantage": "Wisdom" } } }, { "type": "action", "value": { "name": "Command", "uses": "-1", "pool": "First Level Spells", "expandsPool": "true", "target": "Enemy", "areaEffect": "1", "reach": "150", "condition": { "name": "Commanded", "save": "Wisdom", "saveDC": 12, "duration": "1", "charm": "true" } } }] },
                { "name": "Necrotic Morningstar", "slots": "Left Hand, Right Hand, ", "modifiers": [{ "type": "action", "value": { "name": "Morningstar", "uses": "-1", "pool": "Morningstar", "target": "Enemy", "areaEffect": "1", "toHit": "Strength", "damage": "2d8", "damageAbility": "Strength", "damageType": "Necrotic", "isVampiric": "true", "reach": "150" } }, { "type": "pool", "value": { "Morningstar": 1 } }], "cost": 207 }
            ]
        }
    ],
    "worldMap":
    [
        { "name": "Stillwater Plains", "isDestination": "true", "quests": [], "radius": 1000000, "coloration": { "levels": [56, 102, 0, 255] }, "shape": [{ "x": 1866025, "y": 500000 }, { "x": 1866025, "y": 1500000 }, { "x": 1000000, "y": 2000000 }, { "x": 133974, "y": 1500000 }, { "x": 133974, "y": 500000 }, { "x": 999999, "y": 0 }] },
        { "name": "Gelbala", "isDestination": "true", "quests": [], "vendors": [], "radius": 30000, "shape": [{ "x": 1206636, "y": 1037296 }, { "x": 1206636, "y": 1055917 }, { "x": 1195690, "y": 1070982 }, { "x": 1177981, "y": 1076737 }, { "x": 1160271, "y": 1070982 }, { "x": 1149325, "y": 1055917 }, { "x": 1149325, "y": 1037296 }, { "x": 1160271, "y": 1022231 }, { "x": 1177981, "y": 1016477 }, { "x": 1195690, "y": 1022231 }] },
        { "name": "Vielo Village", "isDestination": "true", "quests": [{ "name": "Visiting Vielo", "identifier": 00001 }], "vendors": [], "radius": 70000, "shape": [{ "x": 959957, "y": 1204649 }, { "x": 959957, "y": 1247304 }, { "x": 934885, "y": 1281812 }, { "x": 894319, "y": 1294993 }, { "x": 853752, "y": 1281812 }, { "x": 828680, "y": 1247304 }, { "x": 828680, "y": 1204649 }, { "x": 853752, "y": 1170141 }, { "x": 894319, "y": 1156961 }, { "x": 934885, "y": 1170141 }] },
        { "name": "Goblin's Camp", "isHidden": "true", "quests": [], "radius": 20000, "shape": [{ "x": 1518019, "y": 1191322 }, { "x": 1518019, "y": 1208677 }, { "x": 1504450, "y": 1219498 }, { "x": 1487530, "y": 1215636 }, { "x": 1480000, "y": 1200000 }, { "x": 1487530, "y": 1184363 }, { "x": 1504450, "y": 1180501 }] },
        { "name": "End Of The World", "radius": 1000000, "shape": [{ "x": 2732050, "y": 2000000 }, { "x": 2732050, "y": 3000000 }, { "x": 1866025, "y": 3500000 }, { "x": 1000000, "y": 3000000 }, { "x": 999999, "y": 2000000 }, { "x": 1866025, "y": 1500000 }], "quests": [{ "name": "Congrats." }] },
        { "name": "End Of The World", "radius": 1000000, "shape": [{ "x": 1000000, "y": 2000000 }, { "x": 1000000, "y": 3000000 }, { "x": 133974, "y": 3500000 }, { "x": -732051, "y": 3000000 }, { "x": -732051, "y": 2000000 }, { "x": 133974, "y": 1500000 }], "quests": [{ "name": "Congrats." }] },
        { "name": "End Of The World", "radius": 1000000, "shape": [{ "x": 2732050, "y": -1000000 }, { "x": 2732050, "y": -1 }, { "x": 1866025, "y": 500000 }, { "x": 1000000, "y": 0 }, { "x": 999999, "y": -1000000 }, { "x": 1866025, "y": -1500000 }], "quests": [{ "name": "Congrats." }] },
        { "name": "End Of The World", "radius": 1000000, "shape": [{ "x": 1000000, "y": -1000000 }, { "x": 1000000, "y": -1 }, { "x": 133974, "y": 500000 }, { "x": -732051, "y": 0 }, { "x": -732051, "y": -1000000 }, { "x": 133974, "y": -1500000 }], "quests": [{ "name": "Congrats." }] },
        { "name": "End Of The World", "radius": 1000000, "shape": [{ "x": 3598076, "y": 500000 }, { "x": 3598076, "y": 1500000 }, { "x": 2732050, "y": 2000000 }, { "x": 1866025, "y": 1500000 }, { "x": 1866025, "y": 500000 }, { "x": 2732050, "y": 0 }], "quests": [{ "name": "Congrats." }] },
        { "name": "End Of The World", "radius": 1000000, "shape": [{ "x": 133974, "y": 500000 }, { "x": 133974, "y": 1500000 }, { "x": -732051, "y": 2000000 }, { "x": -1598077, "y": 1500000 }, { "x": -1598077, "y": 500000 }, { "x": -732051, "y": 0 }], "quests": [{ "name": "Congrats." }] }
    ]
}

const DEFAULT_DATA =
{
    "Default": 
    {
        "isActive": true,
        "actions": 
        [
            {
                "name": "Unarmed Strike",
                "damage": "1",
                "damageAbility": "Strength",
                "damageType": "Bludgeoning",
                "toHit": "Strength",
                "target": "Enemy",
                "reach": 150,
                "areaEffect": 1,
                "uses": -1
            },
            {
                "name": "Second Wind",
                "damage": "-1d10",
                "damageAbility": "None",
                "damageExtra": "1",
                "target": "Self",
                "uses": "1",
                "reach": 10,
                "areaEffect": "1",
                "condition": {
                    "name": "Bonus action",
                    "duration": "0",
                    "additional": "addAction",
                    "addAction": "1"
                }
            },
            {
                "name": "Maul",
                "damage": "2d6",
                "damageAbility": "Strength",
                "damageType": "Bludgeoning",
                "toHit": "Strength",
                "toHitExtra": "2",
                "target": "Enemy",
                "uses": "-1",
                "reach": 300,
                "areaEffect": "1",
                "condition": {
                    "name": "Great Weapon Master",
                    "duration": "-1",
                    "notDealt": true,
                    "rerollDamage": "1, 2"
                }
            },
            {
                "name": "Javelin (Thrown)",
                "damage": "1d6",
                "damageAbility": "Strength",
                "damageType": "Piercing",
                "toHit": "Strength",
                "toHitExtra": "2",
                "target": "Enemy",
                "uses": "-1",
                "reach": 900,
                "areaEffect": "1",
                "pool": "Javelins",
                "expandsPool": true
            },
            {
                "name": "Warhammer",
                "damage": "1d8",
                "damageAbility": "Strength",
                "damageType": "Bludgeoning",
                "toHit": "Strength",
                "toHitExtra": "2",
                "target": "Enemy",
                "uses": "-1",
                "reach": 150,
                "areaEffect": "1"
            },
            {
                "name": "Light Crossbow",
                "damage": "1d8",
                "damageAbility": "Dexterity",
                "damageType": "Piercing",
                "toHit": "Dexterity",
                "toHitExtra": "2",
                "target": "Enemy",
                "uses": "-1",
                "reach": 2400,
                "areaEffect": "1",
                "pool": "Loaded Crossbow Bolts",
                "expandsPool": true
            },
            {
                "name": "Load Crossbow",
                "target": "Self",
                "uses": "-1",
                "pool": "Crossbow Bolts",
                "expandsPool": true,
                "reach": 10,
                "areaEffect": "1",
                "condition": {
                    "name": "Recharge",
                    "duration": "0",
                    "recharge": "Loaded Crossbow Bolts, 1"
                }
            },
            {
                "name": "Spare The Dying",
                "damage": "-1d1",
                "target": "Ally",
                "targetsUnconcious": true,
                "uses": "-1",
                "onSuccess": false,
                "reach": 150,
                "areaEffect": "1"
            },
            {
                "name": "Sacred Flame",
                "damage": "1d8",
                "damageType": "Radiant",
                "saveSkill": "Dexterity",
                "saveDC": "13",
                "saveCancelsDamage": true,
                "target": "Enemy",
                "uses": "-1",
                "reach": 1800,
                "areaEffect": "1"
            },
            {
                "name": "Toll The Dead",
                "damage": "1d8",
                "damageType": "Necrotic",
                "saveSkill": "Wisdom",
                "saveDC": "13",
                "saveCancelsDamage": true,
                "target": "Enemy",
                "uses": "-1",
                "reach": 1800,
                "areaEffect": "1"
            },
            {
                "name": "Cure Wounds",
                "damage": "-1d8",
                "damageAbility": "Wisdom",
                "target": "Ally",
                "uses": "-1",
                "reach": 300,
                "areaEffect": "1",
                "pool": "Level 1 spell slots",
                "expandsPool": true
            },
            {
                "name": "Bless",
                "target": "Ally",
                "uses": "-1",
                "reach": 10,
                "areaEffect": 900,
                "pool": "Level 1 spell slots",
                "expandsPool": true,
                "condition": {
                    "name": "Blessed by Clerga",
                    "duration": "10",
                    "disadvantageTarget": true,
                    "advantageSave": "Wisdom"
                }
            },
            {
                "name": "Command",
                "saveSkill": "Wisdom",
                "saveDC": "13",
                "target": "Enemy",
                "uses": "-1",
                "reach": 1800,
                "areaEffect": "1",
                "pool": "Level 1 spell slots",
                "expandsPool": true,
                "condition": {
                    "name": "Commanded by Clerga",
                    "duration": "1",
                    "charm": "true"
                }
            },
            {
                "name": "Guiding Bolt",
                "damage": "4d6",
                "damageType": "Radiant",
                "toHit": "Wisdom",
                "toHitExtra": "2",
                "target": "Enemy",
                "uses": "-1",
                "reach": 3600,
                "areaEffect": "1",
                "pool": "Level 1 spell slots",
                "expandsPool": true,
                "condition": {
                    "name": "Guided by Clerga",
                    "duration": "1",
                    "advantageTarget": "true"
                }
            },
            {
                "name": "Dash",
                "target": "Self",
                "reach": 10,
                "areaEffect": 1,
                "uses": -1,
                "condition": {
                    "name": "Dashing",
                    "duration": 0,
                    "moveMod": 1
                }
            },
            {
                "name": "Dodge",
                "target": "Self",
                "reach": 10,
                "areaEffect": 1,
                "uses": -1,
                "condition": {
                    "name": "Dodging",
                    "duration": 0,
                    "disadvantageTarget": true
                }
            },
            {
                "name": "Help",
                "target": "Ally",
                "reach": 150,
                "areaEffect": 1,
                "uses": -1,
                "condition": {
                    "name": "Helped by Goblin Boss",
                    "duration": 1,
                    "advantageHit": true
                }
            },
            {
                "name": "Scimitar",
                "damage": "1d6",
                "damageAbility": "Dexterity",
                "damageType": "Slashing",
                "toHit": "Dexterity",
                "toHitExtra": 2,
                "target": "Enemy",
                "uses": -1,
                "reach": 150,
                "areaEffect": 1
            },
            {
                "name": "Scimitar",
                "damage": "1d6",
                "damageAbility": "Strength",
                "damageType": "Slashing",
                "toHit": "Dexterity",
                "toHitExtra": 2,
                "target": "Enemy",
                "uses": -1,
                "reach": 150,
                "areaEffect": 1
            },
            {
                "name": "Dagger",
                "damage": "1d4",
                "damageAbility": "Dexterity",
                "damageType": "Slashing",
                "toHit": "Dexterity",
                "toHitExtra": 2,
                "target": "Enemy",
                "uses": -1,
                "reach": 150,
                "areaEffect": 1
            },
            {
                "name": "Shortbow",
                "damage": "1d6",
                "damageAbility": "Dexterity",
                "damageType": "Piercing",
                "toHit": "Dexterity",
                "toHitExtra": 2,
                "target": "Enemy",
                "uses": -1,
                "reach": 2400,
                "areaEffect": 1,
                "pool": "Arrows"
            },
            {
                "name": "Poison Vial",
                "target": "Point",
                "uses": -1,
                "pool": "Poison Vials",
                "expandsPool": "true",
                "reach": 900,
                "areaEffect": 300,
                "condition": {
                    "name": "Poisoned",
                    "duration": 5,
                    "damage": "1d6",
                    "save": "Constitution",
                    "saveDC": 12
                }
            },
            {
                "name": "Katana",
                "damage": "1d8",
                "damageAbility": "Dexterity",
                "damageType": "Slashing",
                "toHit": "Dexterity",
                "toHitExtra": 2,
                "target": "Enemy",
                "uses": -1,
                "reach": 150,
                "areaEffect": 1
            },
            {
                "name": "Smite",
                "damage": "3d8",
                "damageAbility": "Dexterity",
                "damageType": "Radiant",
                "toHit": "Dexterity",
                "toHitExtra": 2,
                "target": "Enemy",
                "uses": -1,
                "pool": "Level 1 spell slots",
                "expandsPool": "true",
                "onSuccess": true,
                "reach": 150,
                "areaEffect": 1
            },
            {
                "name": "Lay on Hands",
                "damage": "-5",
                "target": "Ally",
                "uses": 3,
                "reach": 150,
                "areaEffect": 1
            },
            {
                "name": "Divine Protection",
                "target": "Ally",
                "uses": -1,
                "reach": 600,
                "areaEffect": 1,
                "pool": "Level 1 spell slots",
                "expandsPool": "true",
                "condition": {
                    "name": "Protected ",
                    "duration": -1,
                    "disadvantageTarget": "true"
                }
            },
            {
                "name": "True Strike",
                "target": "Enemy",
                "uses": -1,
                "reach": 900,
                "areaEffect": 1,
                "condition": {
                    "name": "Striked by Genji",
                    "duration": 0,
                    "advantageTarget": "true"
                }
            },
            {
                "name": "Longbow",
                "damage": "1d8",
                "damageAbility": "Dexterity",
                "damageType": "Piercing",
                "toHit": "Dexterity",
                "toHitExtra": 4,
                "target": "Enemy",
                "uses": -1,
                "reach": 4500,
                "areaEffect": 1
            },
            {
                "name": "Javelin",
                "damage": "1d6",
                "damageAbility": "Strength",
                "damageExtra": "0",
                "damageType": "Piercing",
                "toHit": "Strength",
                "toHitExtra": "2",
                "target": "Enemy",
                "uses": "-1",
                "reach": "900",
                "areaEffect": "1"
            },
            {
                "name": "Battleaxe",
                "damage": "1d8",
                "damageAbility": "Strength",
                "damageExtra": "0",
                "damageType": "Slashing",
                "toHit": "Strength",
                "toHitExtra": "2",
                "target": "Enemy",
                "uses": "-1",
                "reach": 300,
                "areaEffect": "1"
            },
            {
                "name": "Handaxe",
                "damage": "1d6",
                "damageAbility": "Strength",
                "damageExtra": "0",
                "damageType": "Slashing",
                "toHit": "Strength",
                "toHitExtra": "2",
                "target": "Enemy",
                "uses": "-1",
                "reach": 750,
                "areaEffect": "1"
            },
            {
                "name": "Rage",
                "target": "Self",
                "uses": "-1",
                "reach": 100,
                "areaEffect": "1",
                "condition": {
                    "name": "Enraged",
                    "duration": "10",
                    "resistances": "Slashing, Piercing, Bludgeoning, ",
                    "additional": "damageBonus",
                    "damageBonus": "2"
                }
            },
            {
                "name": "Bite",
                "damage": "1d4",
                "damageAbility": "Dexterity",
                "damageType": "Piercing",
                "toHit": "Dexterity",
                "toHitExtra": "2",
                "target": "Enemy",
                "uses": "-1",
                "reach": 150,
                "areaEffect": "1",
                "timestamp": 1550522150657
            },
            {
                "name": "Sleep Gaze",
                "target": "Enemy",
                "uses": "-1",
                "reach": 900,
                "areaEffect": "1",
                "condition": {
                    "name": "Asleep",
                    "duration": -1,
                    "save": "Wisdom",
                    "saveDC": 10,
                    "skipTurn": true,
                    "timestamp": 1550522150660
                },
                "timestamp": 1550522150663
            },
            {
                "name": "Claws",
                "damage": "2d10",
                "damageAbility": "Strength",
                "damageType": "Slashing",
                "toHit": "Strength",
                "toHitExtra": "2",
                "target": "Enemy",
                "uses": "-1",
                "reach": 150,
                "areaEffect": "1",
                "timestamp": 1550522353640
            },
            {
                "name": "Dagger",
                "damage": "1d4",
                "damageAbility": "Strength",
                "damageType": "Slashing",
                "toHit": "Strength",
                "toHitExtra": "2",
                "target": "Enemy",
                "uses": "-1",
                "reach": 150,
                "areaEffect": "1",
                "timestamp": 1550522353644
            },
            {
                "name": "Charm Person",
                "target": "Enemy",
                "uses": "-1",
                "reach": 900,
                "areaEffect": "1",
                "pool": "Spells",
                "condition": {
                    "name": "Charmed by Lamia",
                    "duration": 5,
                    "save": "Wisdom",
                    "saveDC": 13,
                    "charm": true,
                    "timestamp": 1550522353647
                },
                "expandsPool": "true",
                "addCost": "2",
                "timestamp": 1550522353650
            },
            {
                "name": "Intoxicating Touch",
                "toHit": "Strength",
                "toHitExtra": "2",
                "target": "Enemy",
                "uses": "-1",
                "reach": 150,
                "areaEffect": "1",
                "condition": {
                    "name": "Intoxicated by Lamia",
                    "duration": 5,
                    "additional": "saveDisadvantage",
                    "saveDisadvantage": "Wisdom",
                    "timestamp": 1550522353654
                },
                "timestamp": 1550522353657
            },
            {
                "name": "Tail",
                "damage": "2d8",
                "damageAbility": "Strength",
                "damageType": "Slashing",
                "toHit": "Strength",
                "toHitExtra": "5",
                "target": "Enemy",
                "uses": "-1",
                "reach": "450",
                "areaEffect": "1",
                "timestamp": 1550545867062,
                "condition": {
                    "name": "Dodging",
                    "duration": 0,
                    "disadvantageTarget": true,
                    "timestamp": 1550545867028
                }
            }
        ],
        "encounters": 
        [
            {
                "areas": [
                    {
                        "name": "",
                        "coloration": "#573b0cff",
                        "shape": "[{\"x\":-5,\"y\":4804},{\"x\":4804,\"y\":4804},{\"x\":4804,\"y\":-5},{\"x\":-5,\"y\":-5}]",
                        "position": {
                            "x": 2400,
                            "y": 2400
                        },
                        "radius": 3400,
                        "randomize": 0,
                        "pointsAmount": 4,
                        "animated": false
                    },
                    {
                        "name": "",
                        "coloration": "#0080009e",
                        "shape": "[{\"x\":2250,\"y\":4053},{\"x\":2668,\"y\":2805},{\"x\":2098,\"y\":2247},{\"x\":0,\"y\":1501},{\"x\":0,\"y\":4800},{\"x\":1799,\"y\":4800}]",
                        "position": {
                            "x": 1114,
                            "y": 3298
                        },
                        "radius": 50,
                        "randomize": 0,
                        "pointsAmount": 6,
                        "animated": false
                    },
                    {
                        "name": "Fire",
                        "coloration": "#f9c73f20",
                        "shape": "[{\"x\":3488,\"y\":4512},{\"x\":3909,\"y\":4503},{\"x\":4303,\"y\":4353},{\"x\":4620,\"y\":4065},{\"x\":4786,\"y\":3666},{\"x\":4780,\"y\":3234},{\"x\":4621,\"y\":2834},{\"x\":4317,\"y\":2526},{\"x\":3915,\"y\":2367},{\"x\":3484,\"y\":2368},{\"x\":3087,\"y\":2534},{\"x\":2780,\"y\":2835},{\"x\":2626,\"y\":3236},{\"x\":2613,\"y\":3666},{\"x\":2776,\"y\":4066},{\"x\":3093,\"y\":4357}]",
                        "position": {
                            "x": 3700,
                            "y": 3450
                        },
                        "radius": 1100,
                        "randomize": "0.05",
                        "pointsAmount": "16",
                        "animated": true
                    },
                    {
                        "name": "",
                        "coloration": "#fae0462c",
                        "shape": "[{\"x\":3594,\"y\":3945},{\"x\":3789,\"y\":3942},{\"x\":3971,\"y\":3871},{\"x\":4110,\"y\":3732},{\"x\":4175,\"y\":3549},{\"x\":4173,\"y\":3357},{\"x\":4104,\"y\":3177},{\"x\":3970,\"y\":3036},{\"x\":3790,\"y\":2955},{\"x\":3595,\"y\":2965},{\"x\":3421,\"y\":3047},{\"x\":3284,\"y\":3180},{\"x\":3201,\"y\":3355},{\"x\":3191,\"y\":3552},{\"x\":3267,\"y\":3736},{\"x\":3415,\"y\":3866}]",
                        "position": {
                            "x": 3692,
                            "y": 3453
                        },
                        "radius": 500,
                        "randomize": 0.05,
                        "pointsAmount": 16,
                        "animated": true
                    },
                    {
                        "name": "",
                        "coloration": "#fae04637",
                        "shape": "[{\"x\":3642,\"y\":3737},{\"x\":3757,\"y\":3737},{\"x\":3863,\"y\":3694},{\"x\":3945,\"y\":3614},{\"x\":3990,\"y\":3507},{\"x\":3987,\"y\":3392},{\"x\":3942,\"y\":3287},{\"x\":3863,\"y\":3204},{\"x\":3757,\"y\":3160},{\"x\":3642,\"y\":3159},{\"x\":3532,\"y\":3198},{\"x\":3445,\"y\":3280},{\"x\":3405,\"y\":3391},{\"x\":3406,\"y\":3508},{\"x\":3451,\"y\":3616},{\"x\":3534,\"y\":3696}]",
                        "position": {
                            "x": 3700,
                            "y": 3450
                        },
                        "radius": 300,
                        "randomize": 0.05,
                        "pointsAmount": 16,
                        "animated": true
                    },
                    {
                        "name": "",
                        "coloration": "#ff4e4135",
                        "shape": "[{\"x\":3670,\"y\":3600},{\"x\":3729,\"y\":3599},{\"x\":3783,\"y\":3574},{\"x\":3823,\"y\":3532},{\"x\":3845,\"y\":3478},{\"x\":3846,\"y\":3420},{\"x\":3824,\"y\":3366},{\"x\":3783,\"y\":3324},{\"x\":3730,\"y\":3298},{\"x\":3670,\"y\":3299},{\"x\":3614,\"y\":3321},{\"x\":3571,\"y\":3364},{\"x\":3553,\"y\":3420},{\"x\":3551,\"y\":3479},{\"x\":3573,\"y\":3534},{\"x\":3615,\"y\":3576}]",
                        "position": {
                            "x": 3700,
                            "y": 3450
                        },
                        "radius": 150,
                        "randomize": 0.05,
                        "pointsAmount": 16,
                        "animated": true
                    },
                    {
                        "name": "",
                        "coloration": "#a2121248",
                        "shape": "[{\"x\":3694,\"y\":3478},{\"x\":3705,\"y\":3478},{\"x\":3716,\"y\":3474},{\"x\":3724,\"y\":3466},{\"x\":3729,\"y\":3455},{\"x\":3729,\"y\":3444},{\"x\":3724,\"y\":3433},{\"x\":3716,\"y\":3425},{\"x\":3705,\"y\":3420},{\"x\":3694,\"y\":3420},{\"x\":3683,\"y\":3425},{\"x\":3674,\"y\":3433},{\"x\":3670,\"y\":3444},{\"x\":3671,\"y\":3455},{\"x\":3675,\"y\":3466},{\"x\":3683,\"y\":3474}]",
                        "position": {
                            "x": 3700,
                            "y": 3450
                        },
                        "radius": 30,
                        "randomize": 0.05,
                        "pointsAmount": 16,
                        "animated": true
                    },
                    {
                        "name": "Fire",
                        "coloration": "#f9c73f21",
                        "shape": "[{\"x\":3009,\"y\":2058},{\"x\":3391,\"y\":2061},{\"x\":3756,\"y\":1932},{\"x\":4033,\"y\":1657},{\"x\":4164,\"y\":1291},{\"x\":4168,\"y\":907},{\"x\":4020,\"y\":551},{\"x\":3756,\"y\":266},{\"x\":3397,\"y\":107},{\"x\":3002,\"y\":105},{\"x\":2643,\"y\":266},{\"x\":2364,\"y\":541},{\"x\":2233,\"y\":907},{\"x\":2236,\"y\":1291},{\"x\":2383,\"y\":1645},{\"x\":2646,\"y\":1928}]",
                        "position": {
                            "x": 3200,
                            "y": 1100
                        },
                        "radius": 1000,
                        "randomize": 0.05,
                        "pointsAmount": 16,
                        "animated": true
                    },
                    {
                        "name": "",
                        "coloration": "#fae0463b",
                        "shape": "[{\"x\":3112,\"y\":1539},{\"x\":3287,\"y\":1541},{\"x\":3445,\"y\":1467},{\"x\":3566,\"y\":1345},{\"x\":3631,\"y\":1185},{\"x\":3635,\"y\":1013},{\"x\":3571,\"y\":851},{\"x\":3452,\"y\":722},{\"x\":3287,\"y\":661},{\"x\":3111,\"y\":653},{\"x\":2946,\"y\":720},{\"x\":2820,\"y\":846},{\"x\":2755,\"y\":1011},{\"x\":2755,\"y\":1188},{\"x\":2824,\"y\":1350},{\"x\":2953,\"y\":1469}]",
                        "position": {
                            "x": 3200,
                            "y": 1100
                        },
                        "radius": 450,
                        "randomize": 0.05,
                        "pointsAmount": 16,
                        "animated": true
                    },
                    {
                        "name": "",
                        "coloration": "#fae04648",
                        "shape": "[{\"x\":3140,\"y\":1400},{\"x\":3259,\"y\":1400},{\"x\":3368,\"y\":1351},{\"x\":3454,\"y\":1269},{\"x\":3497,\"y\":1159},{\"x\":3496,\"y\":1041},{\"x\":3451,\"y\":932},{\"x\":3367,\"y\":849},{\"x\":3257,\"y\":810},{\"x\":3142,\"y\":810},{\"x\":3035,\"y\":853},{\"x\":2950,\"y\":933},{\"x\":2909,\"y\":1042},{\"x\":2905,\"y\":1158},{\"x\":2948,\"y\":1268},{\"x\":3030,\"y\":1353}]",
                        "position": {
                            "x": 3200,
                            "y": 1100
                        },
                        "radius": 300,
                        "randomize": 0.05,
                        "pointsAmount": 16,
                        "animated": true
                    },
                    {
                        "name": "",
                        "coloration": "#ff4e4133",
                        "shape": "[{\"x\":3171,\"y\":1244},{\"x\":3229,\"y\":1246},{\"x\":3284,\"y\":1226},{\"x\":3328,\"y\":1185},{\"x\":3349,\"y\":1129},{\"x\":3346,\"y\":1070},{\"x\":3322,\"y\":1017},{\"x\":3283,\"y\":974},{\"x\":3229,\"y\":951},{\"x\":3170,\"y\":951},{\"x\":3116,\"y\":975},{\"x\":3075,\"y\":1017},{\"x\":3054,\"y\":1071},{\"x\":3056,\"y\":1128},{\"x\":3077,\"y\":1182},{\"x\":3117,\"y\":1223}]",
                        "position": {
                            "x": 3200,
                            "y": 1100
                        },
                        "radius": 150,
                        "randomize": 0.05,
                        "pointsAmount": 16,
                        "animated": true
                    },
                    {
                        "name": "",
                        "coloration": "#a212124b",
                        "shape": "[{\"x\":3194,\"y\":1129},{\"x\":3205,\"y\":1129},{\"x\":3216,\"y\":1125},{\"x\":3225,\"y\":1117},{\"x\":3229,\"y\":1105},{\"x\":3228,\"y\":1094},{\"x\":3224,\"y\":1083},{\"x\":3216,\"y\":1075},{\"x\":3205,\"y\":1070},{\"x\":3194,\"y\":1070},{\"x\":3183,\"y\":1075},{\"x\":3175,\"y\":1083},{\"x\":3171,\"y\":1094},{\"x\":3170,\"y\":1105},{\"x\":3174,\"y\":1116},{\"x\":3183,\"y\":1125}]",
                        "position": {
                            "x": 3200,
                            "y": 1100
                        },
                        "radius": 30,
                        "randomize": 0.05,
                        "pointsAmount": 16,
                        "animated": true
                    },
                    {
                        "name": "Caverns, East",
                        "coloration": "#2b2b28ff",
                        "shape": "[{\"x\":3514,\"y\":2772},{\"x\":3608,\"y\":2953},{\"x\":3900,\"y\":3085},{\"x\":4198,\"y\":2944},{\"x\":4456,\"y\":3047},{\"x\":4807,\"y\":3354},{\"x\":4803,\"y\":1473},{\"x\":4504,\"y\":1473},{\"x\":4192,\"y\":1789},{\"x\":3541,\"y\":1957},{\"x\":3334,\"y\":2090},{\"x\":3323,\"y\":2225},{\"x\":3415,\"y\":2482}]",
                        "position": {
                            "x": 4194,
                            "y": 2376
                        },
                        "radius": 300,
                        "randomize": 0,
                        "pointsAmount": 13,
                        "animated": false,
                        "isObstacle": true
                    },
                    {
                        "name": "Caverns, South",
                        "coloration": "#2b2b28ff",
                        "shape": "[{\"x\":4801,\"y\":4799},{\"x\":4801,\"y\":3598},{\"x\":4443,\"y\":3990},{\"x\":4056,\"y\":4120},{\"x\":3739,\"y\":4158},{\"x\":3550,\"y\":4067},{\"x\":3439,\"y\":3856},{\"x\":3300,\"y\":3748},{\"x\":3300,\"y\":3002},{\"x\":2961,\"y\":2659},{\"x\":2663,\"y\":2811},{\"x\":2251,\"y\":4053},{\"x\":1800,\"y\":4801}]",
                        "position": {
                            "x": 3261,
                            "y": 4100
                        },
                        "radius": 300,
                        "randomize": 0,
                        "pointsAmount": 13,
                        "animated": false,
                        "isObstacle": true
                    },
                    {
                        "name": "Caverns, North",
                        "coloration": "#2b2b28ff",
                        "shape": "[{\"x\":2994,\"y\":744},{\"x\":3290,\"y\":598},{\"x\":3749,\"y\":745},{\"x\":4053,\"y\":747},{\"x\":4346,\"y\":1046},{\"x\":4506,\"y\":1487},{\"x\":4814,\"y\":1513},{\"x\":4798,\"y\":469},{\"x\":4797,\"y\":0},{\"x\":1,\"y\":0},{\"x\":0,\"y\":1499},{\"x\":449,\"y\":1801},{\"x\":1382,\"y\":1998},{\"x\":2090,\"y\":2244},{\"x\":2572,\"y\":2151},{\"x\":3000,\"y\":2067},{\"x\":3187,\"y\":1842},{\"x\":3343,\"y\":1714},{\"x\":3286,\"y\":1497},{\"x\":2845,\"y\":1348},{\"x\":2835,\"y\":1050}]",
                        "position": {
                            "x": 2119,
                            "y": 910
                        },
                        "radius": 300,
                        "randomize": 0,
                        "pointsAmount": 21,
                        "animated": false,
                        "isObstacle": true
                    },
                    {
                        "name": "Bushes",
                        "coloration": "#004000ce",
                        "shape": "[{\"x\":1340,\"y\":3760},{\"x\":1510,\"y\":3770},{\"x\":1630,\"y\":3750},{\"x\":1820,\"y\":3610},{\"x\":1810,\"y\":3420},{\"x\":1730,\"y\":3250},{\"x\":1590,\"y\":3190},{\"x\":1380,\"y\":3250},{\"x\":1260,\"y\":3280},{\"x\":1160,\"y\":3430},{\"x\":1160,\"y\":3560},{\"x\":1200,\"y\":3625},{\"x\":1280,\"y\":3685}]",
                        "position": {
                            "x": 1496,
                            "y": 3487
                        },
                        "radius": 314,
                        "randomize": "1.1",
                        "pointsAmount": "13",
                        "animated": false,
                        "isObstacle": false,
                        "conditions": [
                            {
                                "name": "Difficult Terrain",
                                "duration": 0,
                                "moveMod": -0.5
                            }
                        ]
                    },
                    {
                        "name": "Bushes",
                        "coloration": "#004000ce",
                        "shape": "[{\"x\":931,\"y\":2677},{\"x\":1050,\"y\":2620},{\"x\":1116,\"y\":2531},{\"x\":1200,\"y\":2480},{\"x\":1273,\"y\":2366},{\"x\":1247,\"y\":2228},{\"x\":1146,\"y\":2121},{\"x\":1000,\"y\":2030},{\"x\":806,\"y\":2030},{\"x\":604,\"y\":2127},{\"x\":530,\"y\":2340},{\"x\":639,\"y\":2536},{\"x\":805,\"y\":2619}]",
                        "position": {
                            "x": 899,
                            "y": 2330
                        },
                        "radius": 335,
                        "randomize": 1.1,
                        "pointsAmount": 13,
                        "animated": false,
                        "isObstacle": false,
                        "conditions": [
                            {
                                "name": "Difficult Terrain",
                                "duration": 0,
                                "moveMod": -0.5
                            }
                        ]
                    }
                ],
                "groups": [
                    {
                        "name": "Adventurers",
                        "color": "#8080c0",
                        "troops": [
                            {
                                "name": "Genji Takeda",
                                "stk": "#8080c0",
                                "position": {
                                    "x": 1190,
                                    "y": 3750
                                },
                                "dimension": {
                                    "x": 75,
                                    "y": 75
                                },
                                "isPlayer": false,
                                "abilityScores": {
                                    "Strength": {
                                        "score": 9,
                                        "bonus": -1
                                    },
                                    "Dexterity": {
                                        "score": 16,
                                        "bonus": 3
                                    },
                                    "Constitution": {
                                        "score": 12,
                                        "bonus": 1
                                    },
                                    "Intelligence": {
                                        "score": 12,
                                        "bonus": 1
                                    },
                                    "Wisdom": {
                                        "score": 10,
                                        "bonus": 0
                                    },
                                    "Charisma": {
                                        "score": 14,
                                        "bonus": 2
                                    }
                                },
                                "hitPoints": {
                                    "dieAmount": 2,
                                    "dieType": 10,
                                    "bonus": 13,
                                    "formula": "2d10+13"
                                },
                                "AC": "17",
                                "armorClass": 17,
                                "speed": 900,
                                "movement": 900,
                                "actionsPerTurn": 1,
                                "actions": [
                                    {
                                        "name": "Dash",
                                        "target": "Self",
                                        "reach": 10,
                                        "areaEffect": 1,
                                        "uses": -1,
                                        "condition": {
                                            "name": "Dashing",
                                            "duration": 0,
                                            "moveMod": 1
                                        }
                                    },
                                    {
                                        "name": "Dodge",
                                        "target": "Self",
                                        "reach": 10,
                                        "areaEffect": 1,
                                        "uses": -1,
                                        "condition": {
                                            "name": "Dodging",
                                            "duration": 0,
                                            "disadvantageTarget": true
                                        }
                                    },
                                    {
                                        "name": "Help",
                                        "target": "Ally",
                                        "reach": 150,
                                        "areaEffect": 1,
                                        "uses": -1,
                                        "condition": {
                                            "name": "Helped by Genji Takeda",
                                            "duration": 1,
                                            "advantageHit": true
                                        }
                                    },
                                    {
                                        "name": "Katana",
                                        "damage": "1d8",
                                        "damageAbility": "Dexterity",
                                        "damageType": "Slashing",
                                        "toHit": "Dexterity",
                                        "toHitExtra": 2,
                                        "target": "Enemy",
                                        "uses": -1,
                                        "reach": 150,
                                        "areaEffect": 1
                                    },
                                    {
                                        "name": "Smite",
                                        "damage": "3d8",
                                        "damageAbility": "Dexterity",
                                        "damageType": "Radiant",
                                        "toHit": "Dexterity",
                                        "toHitExtra": 2,
                                        "target": "Enemy",
                                        "uses": -1,
                                        "pool": "Level 1 spell slots",
                                        "expandsPool": "true",
                                        "onSuccess": true,
                                        "reach": 150,
                                        "areaEffect": 1
                                    },
                                    {
                                        "name": "Lay on Hands",
                                        "damage": "-5",
                                        "target": "Ally",
                                        "uses": 3,
                                        "reach": 150,
                                        "areaEffect": 1
                                    },
                                    {
                                        "name": "Divine Protection",
                                        "target": "Ally",
                                        "uses": -1,
                                        "reach": 600,
                                        "areaEffect": 1,
                                        "pool": "Level 1 spell slots",
                                        "expandsPool": "true",
                                        "condition": {
                                            "name": "Protected ",
                                            "duration": -1,
                                            "disadvantageTarget": "true"
                                        }
                                    },
                                    {
                                        "name": "True Strike",
                                        "target": "Enemy",
                                        "uses": -1,
                                        "reach": 900,
                                        "areaEffect": 1,
                                        "condition": {
                                            "name": "Striked by Genji",
                                            "duration": 0,
                                            "advantageTarget": "true"
                                        }
                                    },
                                    {
                                        "name": "Command",
                                        "target": "Enemy",
                                        "uses": -1,
                                        "reach": 900,
                                        "areaEffect": 1,
                                        "pool": "Level 1 spell slots",
                                        "expandsPool": "true",
                                        "condition": {
                                            "name": "Commanded by Genji",
                                            "duration": 10,
                                            "save": "Wisdom",
                                            "saveDC": "12",
                                            "charm": "true"
                                        }
                                    },
                                    {
                                        "name": "Longbow",
                                        "damage": "1d8",
                                        "damageAbility": "Dexterity",
                                        "damageType": "Piercing",
                                        "toHit": "Dexterity",
                                        "toHitExtra": 4,
                                        "target": "Enemy",
                                        "uses": -1,
                                        "reach": 4500,
                                        "areaEffect": 1
                                    }
                                ],
                                "conditions": [],
                                "pools": {
                                    "Level 1 spell slots": 3
                                }
                            }
                        ]
                    },
                    {
                        "name": "Goblins",
                        "color": "#800040",
                        "troops": [
                            {
                                "name": "Goblin Archer",
                                "stk": "#800040",
                                "position": {
                                    "x": 3000,
                                    "y": 2552
                                },
                                "dimension": {
                                    "x": 50,
                                    "y": 50
                                },
                                "isPlayer": false,
                                "abilityScores": {
                                    "Strength": {
                                        "score": 8,
                                        "bonus": -1
                                    },
                                    "Dexterity": {
                                        "score": 14,
                                        "bonus": 2
                                    },
                                    "Constitution": {
                                        "score": 10,
                                        "bonus": 0
                                    },
                                    "Intelligence": {
                                        "score": 10,
                                        "bonus": 0
                                    },
                                    "Wisdom": {
                                        "score": 8,
                                        "bonus": -1
                                    },
                                    "Charisma": {
                                        "score": 8,
                                        "bonus": -1
                                    }
                                },
                                "hitPoints": {
                                    "dieAmount": 2,
                                    "dieType": 6,
                                    "bonus": 0,
                                    "formula": "2d6+0"
                                },
                                "AC": 13,
                                "armorClass": 13,
                                "speed": 900,
                                "movement": 900,
                                "actionsPerTurn": 1,
                                "actions": [
                                    {
                                        "name": "Dash",
                                        "target": "Self",
                                        "reach": 10,
                                        "areaEffect": 1,
                                        "uses": -1,
                                        "condition": {
                                            "name": "Dashing",
                                            "duration": 0,
                                            "moveMod": 1,
                                            "damage": 0
                                        }
                                    },
                                    {
                                        "name": "Dodge",
                                        "target": "Self",
                                        "reach": 10,
                                        "areaEffect": 1,
                                        "uses": -1,
                                        "condition": {
                                            "name": "Dodging",
                                            "duration": 0,
                                            "disadvantageTarget": true
                                        }
                                    },
                                    {
                                        "name": "Help",
                                        "target": "Ally",
                                        "reach": 150,
                                        "areaEffect": 1,
                                        "uses": -1,
                                        "condition": {
                                            "name": "Helped by Goblin Archer",
                                            "duration": 1,
                                            "advantageHit": true
                                        }
                                    },
                                    {
                                        "name": "Dagger",
                                        "damage": "1d4",
                                        "damageAbility": "Dexterity",
                                        "damageType": "Slashing",
                                        "toHit": "Dexterity",
                                        "toHitExtra": 2,
                                        "target": "Enemy",
                                        "uses": -1,
                                        "reach": 150,
                                        "areaEffect": 1
                                    },
                                    {
                                        "name": "Shortbow",
                                        "damage": "1d6",
                                        "damageAbility": "Dexterity",
                                        "damageType": "Piercing",
                                        "toHit": "Dexterity",
                                        "toHitExtra": 2,
                                        "target": "Enemy",
                                        "uses": -1,
                                        "reach": 2400,
                                        "areaEffect": 1,
                                        "pool": "Arrows",
                                        "expandsPool": "true"
                                    },
                                    {
                                        "name": "Poison Vial",
                                        "target": "Point",
                                        "uses": -1,
                                        "pool": "Poison Vials",
                                        "expandsPool": "true",
                                        "reach": 900,
                                        "areaEffect": 300,
                                        "condition": {
                                            "name": "Poisoned",
                                            "duration": 5,
                                            "damage": "1d6",
                                            "save": "Constitution",
                                            "saveDC": 12
                                        }
                                    }
                                ],
                                "conditions": [],
                                "pools": {
                                    "Arrows": 10,
                                    "Poison Vials": 1
                                }
                            },
                            {
                                "name": "Goblin Troop",
                                "stk": "#800040",
                                "position": {
                                    "x": 3132,
                                    "y": 2395
                                },
                                "dimension": {
                                    "x": 50,
                                    "y": 50
                                },
                                "isPlayer": false,
                                "abilityScores": {
                                    "Strength": {
                                        "score": 8,
                                        "bonus": -1
                                    },
                                    "Dexterity": {
                                        "score": 14,
                                        "bonus": 2
                                    },
                                    "Constitution": {
                                        "score": 10,
                                        "bonus": 0
                                    },
                                    "Intelligence": {
                                        "score": 10,
                                        "bonus": 0
                                    },
                                    "Wisdom": {
                                        "score": 8,
                                        "bonus": -1
                                    },
                                    "Charisma": {
                                        "score": 8,
                                        "bonus": -1
                                    }
                                },
                                "hitPoints": {
                                    "dieAmount": 2,
                                    "dieType": 6,
                                    "bonus": 0,
                                    "formula": "2d6+0"
                                },
                                "AC": 15,
                                "armorClass": 15,
                                "speed": 900,
                                "movement": 900,
                                "actionsPerTurn": 1,
                                "actions": [
                                    {
                                        "name": "Dash",
                                        "target": "Self",
                                        "reach": 10,
                                        "areaEffect": 1,
                                        "uses": -1,
                                        "condition": {
                                            "name": "Dashing",
                                            "duration": 0,
                                            "moveMod": 1
                                        }
                                    },
                                    {
                                        "name": "Dodge",
                                        "target": "Self",
                                        "reach": 10,
                                        "areaEffect": 1,
                                        "uses": -1,
                                        "condition": {
                                            "name": "Dodging",
                                            "duration": 0,
                                            "disadvantageTarget": true
                                        }
                                    },
                                    {
                                        "name": "Help",
                                        "target": "Ally",
                                        "reach": 150,
                                        "areaEffect": 1,
                                        "uses": -1,
                                        "condition": {
                                            "name": "Helped by Goblin Troop",
                                            "duration": 1,
                                            "advantageHit": true
                                        }
                                    },
                                    {
                                        "name": "Scimitar",
                                        "damage": "1d6",
                                        "damageAbility": "Strength",
                                        "damageType": "Slashing",
                                        "toHit": "Dexterity",
                                        "toHitExtra": 2,
                                        "target": "Enemy",
                                        "uses": -1,
                                        "reach": 150,
                                        "areaEffect": 1
                                    }
                                ],
                                "conditions": [],
                                "pools": {}
                            },
                            {
                                "name": "Goblin Boss",
                                "stk": "#800040",
                                "position": {
                                    "x": 3300,
                                    "y": 911
                                },
                                "dimension": {
                                    "x": 60,
                                    "y": 60
                                },
                                "isPlayer": false,
                                "abilityScores": {
                                    "Strength": {
                                        "bonus": 0,
                                        "score": 10
                                    },
                                    "Dexterity": {
                                        "bonus": 2,
                                        "score": 14
                                    },
                                    "Constitution": {
                                        "bonus": 0,
                                        "score": 10
                                    },
                                    "Intelligence": {
                                        "bonus": 0,
                                        "score": 10
                                    },
                                    "Wisdom": {
                                        "bonus": -1,
                                        "score": 8
                                    },
                                    "Charisma": {
                                        "bonus": 0,
                                        "score": 10
                                    }
                                },
                                "hitPoints": {
                                    "dieAmount": 6,
                                    "dieType": 6,
                                    "bonus": 0,
                                    "formula": "6d6+0"
                                },
                                "AC": 17,
                                "armorClass": 17,
                                "speed": 900,
                                "movement": 900,
                                "actionsPerTurn": 1,
                                "actions": [
                                    {
                                        "name": "Dash",
                                        "target": "Self",
                                        "reach": 10,
                                        "areaEffect": 1,
                                        "uses": -1,
                                        "condition": {
                                            "name": "Dashing",
                                            "duration": 0,
                                            "moveMod": 1
                                        }
                                    },
                                    {
                                        "name": "Dodge",
                                        "target": "Self",
                                        "reach": 10,
                                        "areaEffect": 1,
                                        "uses": -1,
                                        "condition": {
                                            "name": "Dodging",
                                            "duration": 0,
                                            "disadvantageTarget": true
                                        }
                                    },
                                    {
                                        "name": "Help",
                                        "target": "Ally",
                                        "reach": 150,
                                        "areaEffect": 1,
                                        "uses": -1,
                                        "condition": {
                                            "name": "Helped by Goblin Boss",
                                            "duration": 1,
                                            "advantageHit": true
                                        }
                                    },
                                    {
                                        "name": "Scimitar",
                                        "damage": "1d6",
                                        "damageAbility": "Dexterity",
                                        "damageType": "Slashing",
                                        "toHit": "Dexterity",
                                        "toHitExtra": 2,
                                        "target": "Enemy",
                                        "uses": -1,
                                        "reach": 150,
                                        "areaEffect": 1
                                    },
                                    {
                                        "name": "Javelin (Thrown)",
                                        "damage": "1d6",
                                        "damageAbility": "Dexterity",
                                        "damageType": "Piercing",
                                        "toHit": "Dexterity",
                                        "toHitExtra": 2,
                                        "target": "Enemy",
                                        "uses": -1,
                                        "pool": "Javelins",
                                        "expandsPool": "true",
                                        "reach": 900,
                                        "areaEffect": 1
                                    }
                                ],
                                "conditions": [],
                                "pools": {
                                    "Javelins": 5
                                }
                            },
                            {
                                "name": "Goblin Troop",
                                "stk": "#800040",
                                "position": {
                                    "x": 3296,
                                    "y": 1212
                                },
                                "dimension": {
                                    "x": 50,
                                    "y": 50
                                },
                                "isPlayer": false,
                                "abilityScores": {
                                    "Strength": {
                                        "score": 8,
                                        "bonus": -1
                                    },
                                    "Dexterity": {
                                        "score": 14,
                                        "bonus": 2
                                    },
                                    "Constitution": {
                                        "score": 10,
                                        "bonus": 0
                                    },
                                    "Intelligence": {
                                        "score": 10,
                                        "bonus": 0
                                    },
                                    "Wisdom": {
                                        "score": 8,
                                        "bonus": -1
                                    },
                                    "Charisma": {
                                        "score": 8,
                                        "bonus": -1
                                    }
                                },
                                "hitPoints": {
                                    "dieAmount": 2,
                                    "dieType": 6,
                                    "bonus": 0,
                                    "formula": "2d6+0"
                                },
                                "AC": 15,
                                "armorClass": 15,
                                "speed": 900,
                                "movement": 900,
                                "actionsPerTurn": 1,
                                "actions": [
                                    {
                                        "name": "Dash",
                                        "target": "Self",
                                        "reach": 10,
                                        "areaEffect": 1,
                                        "uses": -1,
                                        "condition": {
                                            "name": "Dashing",
                                            "duration": 0,
                                            "moveMod": 1
                                        }
                                    },
                                    {
                                        "name": "Dodge",
                                        "target": "Self",
                                        "reach": 10,
                                        "areaEffect": 1,
                                        "uses": -1,
                                        "condition": {
                                            "name": "Dodging",
                                            "duration": 0,
                                            "disadvantageTarget": true
                                        }
                                    },
                                    {
                                        "name": "Help",
                                        "target": "Ally",
                                        "reach": 150,
                                        "areaEffect": 1,
                                        "uses": -1,
                                        "condition": {
                                            "name": "Helped by Goblin Troop",
                                            "duration": 1,
                                            "advantageHit": true
                                        }
                                    },
                                    {
                                        "name": "Scimitar",
                                        "damage": "1d6",
                                        "damageAbility": "Strength",
                                        "damageType": "Slashing",
                                        "toHit": "Dexterity",
                                        "toHitExtra": 2,
                                        "target": "Enemy",
                                        "uses": -1,
                                        "reach": 150,
                                        "areaEffect": 1
                                    }
                                ],
                                "conditions": [],
                                "pools": {}
                            },
                            {
                                "name": "Goblin Troop",
                                "stk": "#800040",
                                "position": {
                                    "x": 3450,
                                    "y": 1053
                                },
                                "dimension": {
                                    "x": 50,
                                    "y": 50
                                },
                                "isPlayer": false,
                                "abilityScores": {
                                    "Strength": {
                                        "score": 8,
                                        "bonus": -1
                                    },
                                    "Dexterity": {
                                        "score": 14,
                                        "bonus": 2
                                    },
                                    "Constitution": {
                                        "score": 10,
                                        "bonus": 0
                                    },
                                    "Intelligence": {
                                        "score": 10,
                                        "bonus": 0
                                    },
                                    "Wisdom": {
                                        "score": 8,
                                        "bonus": -1
                                    },
                                    "Charisma": {
                                        "score": 8,
                                        "bonus": -1
                                    }
                                },
                                "initiativeBonus": 2,
                                "hitPoints": {
                                    "dieAmount": 2,
                                    "dieType": 6,
                                    "bonus": 0,
                                    "formula": "2d6+0"
                                },
                                "AC": 15,
                                "armorClass": 15,
                                "speed": 900,
                                "movement": 900,
                                "actionsPerTurn": 1,
                                "actions": [
                                    {
                                        "name": "Dash",
                                        "target": "Self",
                                        "reach": 10,
                                        "areaEffect": 1,
                                        "uses": -1,
                                        "condition": {
                                            "name": "Dashing",
                                            "duration": 0,
                                            "moveMod": 1
                                        }
                                    },
                                    {
                                        "name": "Dodge",
                                        "target": "Self",
                                        "reach": 10,
                                        "areaEffect": 1,
                                        "uses": -1,
                                        "condition": {
                                            "name": "Dodging",
                                            "duration": 0,
                                            "disadvantageTarget": true
                                        }
                                    },
                                    {
                                        "name": "Help",
                                        "target": "Ally",
                                        "reach": 150,
                                        "areaEffect": 1,
                                        "uses": -1,
                                        "condition": {
                                            "name": "Helped by Goblin Troop",
                                            "duration": 1,
                                            "advantageHit": true
                                        }
                                    },
                                    {
                                        "name": "Scimitar",
                                        "damage": "1d6",
                                        "damageAbility": "Strength",
                                        "damageType": "Slashing",
                                        "toHit": "Dexterity",
                                        "toHitExtra": 2,
                                        "target": "Enemy",
                                        "uses": -1,
                                        "reach": 150,
                                        "areaEffect": 1
                                    }
                                ],
                                "conditions": [],
                                "pools": {}
                            },
                            {
                                "name": "Goblin Archer",
                                "stk": "#800040",
                                "position": {
                                    "x": 3000,
                                    "y": 1044
                                },
                                "dimension": {
                                    "x": 50,
                                    "y": 50
                                },
                                "isPlayer": false,
                                "abilityScores": {
                                    "Strength": {
                                        "score": 8,
                                        "bonus": -1
                                    },
                                    "Dexterity": {
                                        "score": 14,
                                        "bonus": 2
                                    },
                                    "Constitution": {
                                        "score": 10,
                                        "bonus": 0
                                    },
                                    "Intelligence": {
                                        "score": 10,
                                        "bonus": 0
                                    },
                                    "Wisdom": {
                                        "score": 8,
                                        "bonus": -1
                                    },
                                    "Charisma": {
                                        "score": 8,
                                        "bonus": -1
                                    }
                                },
                                "initiativeBonus": 2,
                                "hitPoints": {
                                    "dieAmount": 2,
                                    "dieType": 6,
                                    "bonus": 0,
                                    "formula": "2d6+0"
                                },
                                "AC": 13,
                                "armorClass": 13,
                                "speed": 900,
                                "movement": 900,
                                "actionsPerTurn": 1,
                                "actions": [
                                    {
                                        "name": "Dash",
                                        "target": "Self",
                                        "reach": 10,
                                        "areaEffect": 1,
                                        "uses": -1,
                                        "condition": {
                                            "name": "Dashing",
                                            "duration": 0,
                                            "moveMod": 1,
                                            "damage": 0
                                        }
                                    },
                                    {
                                        "name": "Dodge",
                                        "target": "Self",
                                        "reach": 10,
                                        "areaEffect": 1,
                                        "uses": -1,
                                        "condition": {
                                            "name": "Dodging",
                                            "duration": 0,
                                            "disadvantageTarget": true
                                        }
                                    },
                                    {
                                        "name": "Help",
                                        "target": "Ally",
                                        "reach": 150,
                                        "areaEffect": 1,
                                        "uses": -1,
                                        "condition": {
                                            "name": "Helped by Goblin Archer",
                                            "duration": 1,
                                            "advantageHit": true
                                        }
                                    },
                                    {
                                        "name": "Dagger",
                                        "damage": "1d4",
                                        "damageAbility": "Dexterity",
                                        "damageType": "Slashing",
                                        "toHit": "Dexterity",
                                        "toHitExtra": 2,
                                        "target": "Enemy",
                                        "uses": -1,
                                        "reach": 150,
                                        "areaEffect": 1
                                    },
                                    {
                                        "name": "Shortbow",
                                        "damage": "1d6",
                                        "damageAbility": "Dexterity",
                                        "damageType": "Piercing",
                                        "toHit": "Dexterity",
                                        "toHitExtra": 2,
                                        "target": "Enemy",
                                        "uses": -1,
                                        "reach": 2400,
                                        "areaEffect": 1,
                                        "pool": "Arrows"
                                    },
                                    {
                                        "name": "Poison Vial",
                                        "target": "Point",
                                        "uses": -1,
                                        "pool": "Poison Vials",
                                        "expandsPool": "true",
                                        "reach": 900,
                                        "areaEffect": 300,
                                        "condition": {
                                            "name": "Poisoned",
                                            "duration": 5,
                                            "damage": "1d6",
                                            "save": "Constitution",
                                            "saveDC": 12
                                        }
                                    }
                                ],
                                "conditions": [],
                                "pools": {
                                    "Arrows": 20,
                                    "Poison Vials": 1
                                }
                            }
                        ]
                    }
                ],
                "name": "Goblin's Caverns",
                "mapSize": 4800,
                "description": ""
            }
        ],
        "maps": [],
        "troops": 
        [
            {
                "name": "Goblin Chieftain",
                "type": "goblinoïd",
                "dimension": {
                    "x": "75",
                    "y": "75"
                },
                "size": "Medium",
                "abilityScores": {
                    "Strength": {
                        "bonus": 0,
                        "score": 10
                    },
                    "Dexterity": {
                        "bonus": 2,
                        "score": 14
                    },
                    "Constitution": {
                        "bonus": 0,
                        "score": 10
                    },
                    "Intelligence": {
                        "bonus": 0,
                        "score": 10
                    },
                    "Wisdom": {
                        "bonus": -1,
                        "score": 8
                    },
                    "Charisma": {
                        "bonus": 0,
                        "score": 10
                    }
                },
                "hitPoints": {
                    "dieAmount": 6,
                    "dieType": 6,
                    "bonus": 0,
                    "formula": "6d6+0"
                },
                "AC": 17,
                "armorClass": 17,
                "speed": 900,
                "movement": 900,
                "actionsPerTurn": 1,
                "actions": [
                    {
                        "name": "Dash",
                        "target": "Self",
                        "reach": 10,
                        "areaEffect": 1,
                        "uses": -1,
                        "condition": {
                            "name": "Dashing",
                            "duration": 0,
                            "moveMod": 1
                        }
                    },
                    {
                        "name": "Dodge",
                        "target": "Self",
                        "reach": 10,
                        "areaEffect": 1,
                        "uses": -1,
                        "condition": {
                            "name": "Dodging",
                            "duration": 0,
                            "disadvantageTarget": true
                        }
                    },
                    {
                        "name": "Help",
                        "target": "Ally",
                        "reach": 150,
                        "areaEffect": 1,
                        "uses": -1,
                        "condition": {
                            "name": "Helped by Goblin Boss",
                            "duration": 1,
                            "advantageHit": true
                        }
                    },
                    {
                        "name": "Scimitar",
                        "damage": "1d6",
                        "damageAbility": "Dexterity",
                        "damageType": "Slashing",
                        "toHit": "Dexterity",
                        "toHitExtra": 2,
                        "target": "Enemy",
                        "uses": -1,
                        "reach": 150,
                        "areaEffect": 1
                    },
                    {
                        "name": "Javelin (Thrown)",
                        "damage": "1d6",
                        "damageAbility": "Dexterity",
                        "damageType": "Piercing",
                        "toHit": "Dexterity",
                        "toHitExtra": 2,
                        "target": "Enemy",
                        "uses": -1,
                        "pool": "Javelins",
                        "expandsPool": "true",
                        "reach": 900,
                        "areaEffect": 1
                    }
                ],
                "conditions": [],
                "pools": {
                    "Javelins": 5
                }
            },
            {
                "name": "Goblin Troop",
                "type": "goblinoïd",
                "dimension": {
                    "x": "50",
                    "y": "50"
                },
                "size": "Small",
                "abilityScores": {
                    "Strength": {
                        "score": 8,
                        "bonus": -1
                    },
                    "Dexterity": {
                        "score": 14,
                        "bonus": 2
                    },
                    "Constitution": {
                        "score": 10,
                        "bonus": 0
                    },
                    "Intelligence": {
                        "score": 10,
                        "bonus": 0
                    },
                    "Wisdom": {
                        "score": 8,
                        "bonus": -1
                    },
                    "Charisma": {
                        "score": 8,
                        "bonus": -1
                    }
                },
                "hitPoints": {
                    "dieAmount": 2,
                    "dieType": 6,
                    "bonus": 0,
                    "formula": "2d6+0"
                },
                "AC": 15,
                "armorClass": 15,
                "speed": 900,
                "movement": 900,
                "actionsPerTurn": 1,
                "actions": [
                    {
                        "name": "Dash",
                        "target": "Self",
                        "reach": 10,
                        "areaEffect": 1,
                        "uses": -1,
                        "condition": {
                            "name": "Dashing",
                            "duration": 0,
                            "moveMod": 1
                        }
                    },
                    {
                        "name": "Dodge",
                        "target": "Self",
                        "reach": 10,
                        "areaEffect": 1,
                        "uses": -1,
                        "condition": {
                            "name": "Dodging",
                            "duration": 0,
                            "disadvantageTarget": true
                        }
                    },
                    {
                        "name": "Help",
                        "target": "Ally",
                        "reach": 150,
                        "areaEffect": 1,
                        "uses": -1,
                        "condition": {
                            "name": "Helped by Goblin Troop",
                            "duration": 1,
                            "advantageHit": true
                        }
                    },
                    {
                        "name": "Scimitar",
                        "damage": "1d6",
                        "damageAbility": "Strength",
                        "damageType": "Slashing",
                        "toHit": "Dexterity",
                        "toHitExtra": 2,
                        "target": "Enemy",
                        "uses": -1,
                        "reach": 150,
                        "areaEffect": 1
                    }
                ],
                "conditions": [],
                "pools": {}
            },
            {
                "name": "Goblin Archer",
                "type": "goblinoïd",
                "dimension": {
                    "x": "50",
                    "y": "50"
                },
                "size": "Small",
                "abilityScores": {
                    "Strength": {
                        "score": 8,
                        "bonus": -1
                    },
                    "Dexterity": {
                        "score": 14,
                        "bonus": 2
                    },
                    "Constitution": {
                        "score": 10,
                        "bonus": 0
                    },
                    "Intelligence": {
                        "score": 10,
                        "bonus": 0
                    },
                    "Wisdom": {
                        "score": 8,
                        "bonus": -1
                    },
                    "Charisma": {
                        "score": 8,
                        "bonus": -1
                    }
                },
                "initiativeBonus": 2,
                "hitPoints": {
                    "dieAmount": 2,
                    "dieType": 6,
                    "bonus": 0,
                    "formula": "2d6+0"
                },
                "AC": 13,
                "armorClass": 13,
                "speed": 900,
                "movement": 900,
                "actionsPerTurn": 1,
                "actions": [
                    {
                        "name": "Dash",
                        "target": "Self",
                        "reach": 10,
                        "areaEffect": 1,
                        "uses": -1,
                        "condition": {
                            "name": "Dashing",
                            "duration": 0,
                            "moveMod": 1,
                            "damage": 0
                        }
                    },
                    {
                        "name": "Dodge",
                        "target": "Self",
                        "reach": 10,
                        "areaEffect": 1,
                        "uses": -1,
                        "condition": {
                            "name": "Dodging",
                            "duration": 0,
                            "disadvantageTarget": true
                        }
                    },
                    {
                        "name": "Help",
                        "target": "Ally",
                        "reach": 150,
                        "areaEffect": 1,
                        "uses": -1,
                        "condition": {
                            "name": "Helped by Goblin Archer",
                            "duration": 1,
                            "advantageHit": true
                        }
                    },
                    {
                        "name": "Dagger",
                        "damage": "1d4",
                        "damageAbility": "Dexterity",
                        "damageType": "Slashing",
                        "toHit": "Dexterity",
                        "toHitExtra": 2,
                        "target": "Enemy",
                        "uses": -1,
                        "reach": 150,
                        "areaEffect": 1
                    },
                    {
                        "name": "Shortbow",
                        "damage": "1d6",
                        "damageAbility": "Dexterity",
                        "damageType": "Piercing",
                        "toHit": "Dexterity",
                        "toHitExtra": 2,
                        "target": "Enemy",
                        "uses": -1,
                        "reach": 2400,
                        "areaEffect": 1,
                        "pool": "Arrows"
                    },
                    {
                        "name": "Poison Vial",
                        "target": "Point",
                        "uses": -1,
                        "pool": "Poison Vials",
                        "expandsPool": "true",
                        "reach": 900,
                        "areaEffect": 300,
                        "condition": {
                            "name": "Poisoned",
                            "duration": 5,
                            "damage": "1d6",
                            "save": "Constitution",
                            "saveDC": 12
                        }
                    }
                ],
                "conditions": [],
                "pools": {
                    "Arrows": 20,
                    "Poison Vials": 1
                }
            },
            {
                "name": "Jackalwere",
                "source": "Default",
                "type": "humanoïd",
                "dimension": {
                    "x": "75",
                    "y": "75"
                },
                "size": "Medium",
                "armorClass": "12",
                "hitPoints": {
                    "dieAmount": "4",
                    "dieType": "8",
                    "bonus": "0",
                    "formula": "4d8+0"
                },
                "abilityScores": {
                    "Strength": {
                        "score": "11",
                        "bonus": "0"
                    },
                    "Dexterity": {
                        "score": "15",
                        "bonus": "2"
                    },
                    "Constitution": {
                        "score": "11",
                        "bonus": "0"
                    },
                    "Intelligence": {
                        "score": "13",
                        "bonus": "1"
                    },
                    "Wisdom": {
                        "score": "11",
                        "bonus": "0"
                    },
                    "Charisma": {
                        "score": "10",
                        "bonus": "0"
                    }
                },
                "speed": 1200,
                "actionsPerTurn": "1",
                "turnsAmount": "1",
                "pools": {},
                "actions": [
                    {
                        "name": "Bite",
                        "damage": "1d4",
                        "damageAbility": "Dexterity",
                        "damageType": "Piercing",
                        "toHit": "Dexterity",
                        "toHitExtra": "2",
                        "target": "Enemy",
                        "uses": "-1",
                        "reach": 150,
                        "areaEffect": "1",
                        "timestamp": 1550522150657
                    },
                    {
                        "name": "Sleep Gaze",
                        "target": "Enemy",
                        "uses": "-1",
                        "reach": 900,
                        "areaEffect": "1",
                        "condition": {
                            "name": "Asleep",
                            "duration": -1,
                            "save": "Wisdom",
                            "saveDC": 10,
                            "skipTurn": true,
                            "timestamp": 1550522150660
                        },
                        "timestamp": 1550522150663
                    }
                ],
                "conditions": [
                    {
                        "name": "Lycanthropy",
                        "damage": "0",
                        "resistances": "",
                        "vulnerabilities": "",
                        "immunities": "Slashing, Piercing, Bludgeoning",
                        "duration": -1
                    }
                ],
                "timestamp": 1550522150665
            },
            {
                "name": "Lamia",
                "source": "Default",
                "type": "monstrosity",
                "dimension": {
                    "x": "100",
                    "y": "100"
                },
                "size": "Big",
                "armorClass": "13",
                "hitPoints": {
                    "dieAmount": "13",
                    "dieType": "10",
                    "bonus": "26",
                    "formula": "13d10+26"
                },
                "abilityScores": {
                    "Strength": {
                        "score": "16",
                        "bonus": "3"
                    },
                    "Dexterity": {
                        "score": "13",
                        "bonus": "1"
                    },
                    "Constitution": {
                        "score": "15",
                        "bonus": "2"
                    },
                    "Intelligence": {
                        "score": "14",
                        "bonus": "2"
                    },
                    "Wisdom": {
                        "score": "15",
                        "bonus": "2"
                    },
                    "Charisma": {
                        "score": "16",
                        "bonus": "3"
                    }
                },
                "speed": 900,
                "actionsPerTurn": "2",
                "turnsAmount": "1",
                "pools": {
                    "Spells": 3
                },
                "actions": [
                    {
                        "name": "Claws",
                        "damage": "2d10",
                        "damageAbility": "Strength",
                        "damageType": "Slashing",
                        "toHit": "Strength",
                        "toHitExtra": "2",
                        "target": "Enemy",
                        "uses": "-1",
                        "reach": 150,
                        "areaEffect": "1",
                        "timestamp": 1550522353640
                    },
                    {
                        "name": "Dagger",
                        "damage": "1d4",
                        "damageAbility": "Strength",
                        "damageType": "Slashing",
                        "toHit": "Strength",
                        "toHitExtra": "2",
                        "target": "Enemy",
                        "uses": "-1",
                        "reach": 150,
                        "areaEffect": "1",
                        "timestamp": 1550522353644
                    },
                    {
                        "name": "Charm Person",
                        "target": "Enemy",
                        "uses": "-1",
                        "reach": 900,
                        "areaEffect": "1",
                        "pool": "Spells",
                        "condition": {
                            "name": "Charmed by Lamia",
                            "duration": 5,
                            "save": "Wisdom",
                            "saveDC": 13,
                            "charm": true,
                            "timestamp": 1550522353647
                        },
                        "expandsPool": "true",
                        "addCost": "2",
                        "timestamp": 1550522353650
                    },
                    {
                        "name": "Intoxicating Touch",
                        "toHit": "Strength",
                        "toHitExtra": "2",
                        "target": "Enemy",
                        "uses": "-1",
                        "reach": 150,
                        "areaEffect": "1",
                        "condition": {
                            "name": "Intoxicated by Lamia",
                            "duration": 5,
                            "additional": "saveDisadvantage",
                            "saveDisadvantage": "Wisdom",
                            "timestamp": 1550522353654
                        },
                        "timestamp": 1550522353657
                    }
                ],
                "conditions": [],
                "timestamp": 1550522353659
            },
            {
                "name": "Palarga",
                "type": "humanoïd (Bugbear)",
                "dimension": {
                    "x": "75",
                    "y": "75"
                },
                "size": "Medium",
                "abilityScores": {
                    "Strength": {
                        "score": 9,
                        "bonus": -1
                    },
                    "Dexterity": {
                        "score": 16,
                        "bonus": 3
                    },
                    "Constitution": {
                        "score": 12,
                        "bonus": 1
                    },
                    "Intelligence": {
                        "score": 12,
                        "bonus": 1
                    },
                    "Wisdom": {
                        "score": 10,
                        "bonus": 0
                    },
                    "Charisma": {
                        "score": 14,
                        "bonus": 2
                    }
                },
                "hitPoints": {
                    "dieAmount": 2,
                    "dieType": 10,
                    "bonus": 13,
                    "formula": "2d10+13"
                },
                "AC": "17",
                "armorClass": 17,
                "speed": 900,
                "movement": 900,
                "actionsPerTurn": 1,
                "actions": [
                    {
                        "name": "Dash",
                        "target": "Self",
                        "reach": 10,
                        "areaEffect": 1,
                        "uses": -1,
                        "condition": {
                            "name": "Dashing",
                            "duration": 0,
                            "moveMod": 1
                        }
                    },
                    {
                        "name": "Dodge",
                        "target": "Self",
                        "reach": 10,
                        "areaEffect": 1,
                        "uses": -1,
                        "condition": {
                            "name": "Dodging",
                            "duration": 0,
                            "disadvantageTarget": true
                        }
                    },
                    {
                        "name": "Help",
                        "target": "Ally",
                        "reach": 150,
                        "areaEffect": 1,
                        "uses": -1,
                        "condition": {
                            "name": "Helped by Palarga",
                            "duration": 1,
                            "advantageHit": true
                        }
                    },
                    {
                        "name": "Katana",
                        "damage": "1d8",
                        "damageAbility": "Dexterity",
                        "damageType": "Slashing",
                        "toHit": "Dexterity",
                        "toHitExtra": 2,
                        "target": "Enemy",
                        "uses": -1,
                        "reach": 150,
                        "areaEffect": 1
                    },
                    {
                        "name": "Smite",
                        "damage": "3d8",
                        "damageAbility": "Dexterity",
                        "damageType": "Radiant",
                        "toHit": "Dexterity",
                        "toHitExtra": 2,
                        "target": "Enemy",
                        "uses": -1,
                        "pool": "Level 1 spell slots",
                        "expandsPool": "true",
                        "onSuccess": true,
                        "reach": 150,
                        "areaEffect": 1
                    },
                    {
                        "name": "Lay on Hands",
                        "damage": "-5",
                        "target": "Ally",
                        "uses": 3,
                        "reach": 150,
                        "areaEffect": 1
                    },
                    {
                        "name": "Divine Protection",
                        "target": "Ally",
                        "uses": -1,
                        "reach": 600,
                        "areaEffect": 1,
                        "pool": "Level 1 spell slots",
                        "expandsPool": "true",
                        "condition": {
                            "name": "Protected ",
                            "duration": -1,
                            "disadvantageTarget": "true"
                        }
                    },
                    {
                        "name": "True Strike",
                        "target": "Enemy",
                        "uses": -1,
                        "reach": 900,
                        "areaEffect": 1,
                        "condition": {
                            "name": "Striked by Genji",
                            "duration": 0,
                            "advantageTarget": "true"
                        }
                    },
                    {
                        "name": "Command",
                        "target": "Enemy",
                        "uses": -1,
                        "reach": 900,
                        "areaEffect": 1,
                        "pool": "Level 1 spell slots",
                        "expandsPool": "true",
                        "condition": {
                            "name": "Commanded by Genji",
                            "duration": 10,
                            "save": "Wisdom",
                            "saveDC": "12",
                            "charm": "true"
                        }
                    },
                    {
                        "name": "Longbow",
                        "damage": "1d8",
                        "damageAbility": "Dexterity",
                        "damageType": "Piercing",
                        "toHit": "Dexterity",
                        "toHitExtra": 4,
                        "target": "Enemy",
                        "uses": -1,
                        "reach": 4500,
                        "areaEffect": 1
                    }
                ],
                "conditions": [],
                "pools": {
                    "Level 1 spell slots": 3
                }
            },
            {
                "name": "Barga",
                "source": "Default",
                "type": "humanoïd (Bugbear)",
                "dimension": {
                    "x": "75",
                    "y": "75"
                },
                "size": "Medium",
                "armorClass": "17",
                "hitPoints": {
                    "dieAmount": "14",
                    "dieType": "1",
                    "bonus": "0",
                    "formula": "14d1+0"
                },
                "abilityScores": {
                    "Strength": {
                        "score": "18",
                        "bonus": "4"
                    },
                    "Dexterity": {
                        "score": "16",
                        "bonus": "3"
                    },
                    "Constitution": {
                        "score": "14",
                        "bonus": "2"
                    },
                    "Intelligence": {
                        "score": "12",
                        "bonus": "1"
                    },
                    "Wisdom": {
                        "score": "14",
                        "bonus": "2"
                    },
                    "Charisma": {
                        "score": "12",
                        "bonus": "1"
                    }
                },
                "speed": "900",
                "actionsPerTurn": "1",
                "turnsAmount": "1",
                "pools": {
                    "Rages": "2"
                },
                "actions": [
                    {
                        "name": "Javelin",
                        "damage": "1d6",
                        "damageAbility": "Strength",
                        "damageExtra": "0",
                        "damageType": "Piercing",
                        "toHit": "Strength",
                        "toHitExtra": "2",
                        "target": "Enemy",
                        "uses": "-1",
                        "reach": "900",
                        "areaEffect": "1"
                    },
                    {
                        "name": "Battleaxe",
                        "damage": "1d8",
                        "damageAbility": "Strength",
                        "damageExtra": "0",
                        "damageType": "Slashing",
                        "toHit": "Strength",
                        "toHitExtra": "2",
                        "target": "Enemy",
                        "uses": "-1",
                        "reach": 300,
                        "areaEffect": "1"
                    },
                    {
                        "name": "Handaxe",
                        "damage": "1d6",
                        "damageAbility": "Strength",
                        "damageExtra": "0",
                        "damageType": "Slashing",
                        "toHit": "Strength",
                        "toHitExtra": "2",
                        "target": "Enemy",
                        "uses": "-1",
                        "reach": 750,
                        "areaEffect": "1"
                    },
                    {
                        "name": "Rage",
                        "target": "Self",
                        "uses": "-1",
                        "reach": 100,
                        "areaEffect": "1",
                        "condition": {
                            "name": "Enraged",
                            "duration": "10",
                            "resistances": "Slashing, Piercing, Bludgeoning, ",
                            "additional": "damageBonus",
                            "damageBonus": "2"
                        }
                    }
                ],
                "conditions": []
            },
            {
                "name": "Firga",
                "source": "Default",
                "type": "humanoïd (Bugbear)",
                "dimension": {
                    "x": "75",
                    "y": "75"
                },
                "size": "Medium",
                "armorClass": "18",
                "hitPoints": {
                    "dieAmount": "12",
                    "dieType": "1",
                    "bonus": "0",
                    "formula": "12d1+0"
                },
                "abilityScores": {
                    "Strength": {
                        "score": "18",
                        "bonus": "4"
                    },
                    "Dexterity": {
                        "score": "16",
                        "bonus": "3"
                    },
                    "Constitution": {
                        "score": "14",
                        "bonus": "2"
                    },
                    "Intelligence": {
                        "score": "12",
                        "bonus": "1"
                    },
                    "Wisdom": {
                        "score": "14",
                        "bonus": "2"
                    },
                    "Charisma": {
                        "score": "12",
                        "bonus": "1"
                    }
                },
                "speed": 900,
                "actionsPerTurn": "1",
                "turnsAmount": "1",
                "pools": {
                    "Javelins": 5
                },
                "actions": [
                    {
                        "name": "Second Wind",
                        "damage": "-1d10",
                        "damageAbility": "None",
                        "damageExtra": "1",
                        "target": "Self",
                        "uses": "1",
                        "reach": 10,
                        "areaEffect": "1",
                        "condition": {
                            "name": "Bonus action",
                            "duration": 0,
                            "additional": "addAction",
                            "addAction": 1,
                            "timestamp": 1550546154919
                        }
                    },
                    {
                        "name": "Maul",
                        "damage": "2d6",
                        "damageAbility": "Strength",
                        "damageType": "Bludgeoning",
                        "toHit": "Strength",
                        "toHitExtra": "2",
                        "target": "Enemy",
                        "uses": "-1",
                        "reach": 300,
                        "areaEffect": "1",
                        "condition": {
                            "name": "Great Weapon Master",
                            "duration": -1,
                            "notDealt": true,
                            "rerollDamage": 1,
                            "timestamp": 1550546154965
                        }
                    },
                    {
                        "name": "Javelin (Thrown)",
                        "damage": "1d6",
                        "damageAbility": "Strength",
                        "damageType": "Piercing",
                        "toHit": "Strength",
                        "toHitExtra": "2",
                        "target": "Enemy",
                        "uses": "-1",
                        "reach": 900,
                        "areaEffect": "1",
                        "pool": "Javelins",
                        "expandsPool": true
                    }
                ],
                "conditions": [],
                "timestamp": 1550546155007
            },
            {
                "name": "Clerga",
                "source": "Default",
                "type": "humanoïd (Bugbear)",
                "dimension": {
                    "x": "75",
                    "y": "75"
                },
                "size": "Medium",
                "armorClass": "18",
                "hitPoints": {
                    "dieAmount": "10",
                    "dieType": "1",
                    "bonus": "0",
                    "formula": "10d1+0"
                },
                "abilityScores": {
                    "Strength": {
                        "score": "14",
                        "bonus": "2"
                    },
                    "Dexterity": {
                        "score": "16",
                        "bonus": "3"
                    },
                    "Constitution": {
                        "score": "14",
                        "bonus": "2"
                    },
                    "Intelligence": {
                        "score": "14",
                        "bonus": "2"
                    },
                    "Wisdom": {
                        "score": "16",
                        "bonus": "3"
                    },
                    "Charisma": {
                        "score": "12",
                        "bonus": "1"
                    }
                },
                "speed": 900,
                "actionsPerTurn": "1",
                "turnsAmount": "1",
                "pools": {
                    "Loaded Crossbow Bolts": 1,
                    "Crossbow Bolts": 10,
                    "Level 1 spell slots": 2
                },
                "actions": [
                    {
                        "name": "Warhammer",
                        "damage": "1d8",
                        "damageAbility": "Strength",
                        "damageType": "Bludgeoning",
                        "toHit": "Strength",
                        "toHitExtra": "2",
                        "target": "Enemy",
                        "uses": "-1",
                        "reach": 150,
                        "areaEffect": "1"
                    },
                    {
                        "name": "Light Crossbow",
                        "damage": "1d8",
                        "damageAbility": "Dexterity",
                        "damageType": "Piercing",
                        "toHit": "Dexterity",
                        "toHitExtra": "2",
                        "target": "Enemy",
                        "uses": "-1",
                        "reach": 2400,
                        "areaEffect": "1",
                        "pool": "Loaded Crossbow Bolts",
                        "expandsPool": true
                    },
                    {
                        "name": "Load Crossbow",
                        "target": "Self",
                        "uses": "-1",
                        "pool": "Crossbow Bolts",
                        "expandsPool": true,
                        "reach": 10,
                        "areaEffect": "1",
                        "condition": {
                            "name": "Recharge",
                            "duration": 0,
                            "recharge": "Loaded Crossbow Bolts, 1",
                            "timestamp": 1550546173283
                        }
                    },
                    {
                        "name": "Spare The Dying",
                        "damage": "-1d1",
                        "target": "Ally",
                        "targetsUnconcious": true,
                        "uses": "-1",
                        "onSuccess": false,
                        "reach": 150,
                        "areaEffect": "1"
                    },
                    {
                        "name": "Sacred Flame",
                        "damage": "1d8",
                        "damageType": "Radiant",
                        "saveAbility": "Dexterity",
                        "saveDC": "13",
                        "saveCancelsDamage": true,
                        "target": "Enemy",
                        "uses": "-1",
                        "reach": 1800,
                        "areaEffect": "1"
                    },
                    {
                        "name": "Toll The Dead",
                        "damage": "1d8",
                        "damageType": "Necrotic",
                        "saveAbility": "Wisdom",
                        "saveDC": "13",
                        "saveCancelsDamage": true,
                        "target": "Enemy",
                        "uses": "-1",
                        "reach": 1800,
                        "areaEffect": "1"
                    },
                    {
                        "name": "Cure Wounds",
                        "damage": "-1d8",
                        "damageAbility": "Wisdom",
                        "target": "Ally",
                        "uses": "-1",
                        "reach": 300,
                        "areaEffect": "1",
                        "pool": "Level 1 spell slots",
                        "expandsPool": true
                    },
                    {
                        "name": "Bless",
                        "target": "Ally",
                        "uses": "-1",
                        "reach": 10,
                        "areaEffect": 900,
                        "pool": "Level 1 spell slots",
                        "expandsPool": true,
                        "condition": {
                            "name": "Blessed by Clerga",
                            "duration": 10,
                            "disadvantageTarget": true,
                            "saveAdvantage": "Wisdom",
                            "timestamp": 1550546173359
                        }
                    },
                    {
                        "name": "Command",
                        "saveAbility": "Wisdom",
                        "saveDC": "13",
                        "target": "Enemy",
                        "uses": "-1",
                        "reach": 1800,
                        "areaEffect": "1",
                        "pool": "Level 1 spell slots",
                        "expandsPool": true,
                        "condition": {
                            "name": "Commanded by Clerga",
                            "duration": 1,
                            "charm": true,
                            "timestamp": 1550546173390
                        }
                    },
                    {
                        "name": "Guiding Bolt",
                        "damage": "4d6",
                        "damageType": "Radiant",
                        "toHit": "Wisdom",
                        "toHitExtra": "2",
                        "target": "Enemy",
                        "uses": "-1",
                        "reach": 3600,
                        "areaEffect": "1",
                        "pool": "Level 1 spell slots",
                        "expandsPool": true,
                        "condition": {
                            "name": "Guided by Clerga",
                            "duration": 1,
                            "advantageTarget": true,
                            "timestamp": 1550546173421
                        }
                    }
                ],
                "conditions": [],
                "timestamp": 1550546173443
            },
            {
                "name": "Adult Dragon",
                "source": "Default",
                "type": "dragon",
                "dimension": {
                    "x": "225",
                    "y": "225"
                },
                "size": "Huge",
                "armorClass": "19",
                "hitPoints": {
                    "dieAmount": "17",
                    "dieType": "12",
                    "bonus": "85",
                    "formula": "17d12+85"
                },
                "abilityScores": {
                    "Strength": {
                        "score": "23",
                        "bonus": "6"
                    },
                    "Dexterity": {
                        "score": "14",
                        "bonus": "2"
                    },
                    "Constitution": {
                        "score": "21",
                        "bonus": "5"
                    },
                    "Intelligence": {
                        "score": "14",
                        "bonus": "2"
                    },
                    "Wisdom": {
                        "score": "13",
                        "bonus": "1"
                    },
                    "Charisma": {
                        "score": "17",
                        "bonus": "3"
                    }
                },
                "speed": 1200,
                "actionsPerTurn": "3",
                "turnsAmount": "1",
                "pools": {},
                "actions": [
                    {
                        "name": "Claws",
                        "damage": "2d6",
                        "damageAbility": "Strength",
                        "damageType": "Slashing",
                        "toHit": "Strength",
                        "toHitExtra": "5",
                        "target": "Enemy",
                        "uses": "-1",
                        "reach": "150",
                        "areaEffect": "1",
                        "condition": {}
                    },
                    {
                        "name": "Tail",
                        "damage": "2d8",
                        "damageAbility": "Strength",
                        "damageType": "Slashing",
                        "toHit": "Strength",
                        "toHitExtra": "5",
                        "target": "Enemy",
                        "uses": "-1",
                        "reach": "450",
                        "areaEffect": "1",
                        "timestamp": 1550545867062,
                        "condition": {
                            "name": "Dodging",
                            "duration": 0,
                            "disadvantageTarget": true,
                            "timestamp": 1550545867028
                        }
                    },
                    {
                        "name": "Bite",
                        "damage": "2d10",
                        "damageAbility": "Strength",
                        "damageType": "Slashing",
                        "toHit": "Strength",
                        "toHitExtra": "5",
                        "target": "Enemy",
                        "uses": "-1",
                        "reach": "300",
                        "areaEffect": "1",
                        "condition": {}
                    }
                ],
                "conditions": [
                    {
                        "name": "Resistance",
                        "damage": "0",
                        "resistances": "Piercing, Slashing, Bludgeoning, Fire, Acid, Poison, Lightning",
                        "vulnerabilities": "",
                        "immunities": "",
                        "duration": -1
                    }
                ],
                "timestamp": 1550546057870
            }
        ],
        "conditions": 
        [
            {
                "name": "Asleep",
                "duration": -1,
                "save": "Wisdom",
                "saveDC": 10,
                "skipTurn": true,
                "timestamp": 1550522150660
            },
            {
                "name": "Charmed by Lamia",
                "duration": 5,
                "save": "Wisdom",
                "saveDC": 13,
                "charm": true,
                "timestamp": 1550522353647
            },
            {
                "name": "Intoxicated by Lamia",
                "duration": 5,
                "additional": "saveDisadvantage",
                "saveDisadvantage": "Wisdom",
                "timestamp": 1550522353654
            },
            {
                "name": "Dodging",
                "duration": 0,
                "disadvantageTarget": true,
                "timestamp": 1550545867028
            },
            {
                "name": "Bonus action",
                "duration": 0,
                "additional": "addAction",
                "addAction": 1,
                "timestamp": 1550546154919
            },
            {
                "name": "Great Weapon Master",
                "duration": -1,
                "notDealt": true,
                "rerollDamage": 1,
                "timestamp": 1550546154965
            },
            {
                "name": "Recharge",
                "duration": 0,
                "recharge": "Loaded Crossbow Bolts, 1",
                "timestamp": 1550546173283
            },
            {
                "name": "Blessed by Clerga",
                "duration": 10,
                "disadvantageTarget": true,
                "saveAdvantage": "Wisdom",
                "timestamp": 1550546173359
            },
            {
                "name": "Commanded by Clerga",
                "duration": 1,
                "charm": true,
                "timestamp": 1550546173390
            },
            {
                "name": "Guided by Clerga",
                "duration": 1,
                "advantageTarget": true,
                "timestamp": 1550546173421
            }
        ]
    }
}

