const SERVER = "./" //"./" //"file:///C:/Users/Robin/Projects/[STUFF]/TRPG/client/"; // "http://localhost:6006/"; // "https://trpgproto.glitch.me/";

/** Disable Context Menu */
document.oncontextmenu = function(event){if(event.preventDefault != undefined){event.preventDefault();}if(event.stopPropagation != undefined){event.stopPropagation();};}

/** File Reader config with JSON reading */
const contentReader = new FileReader();
contentReader.onload = (data) => {localStorageUtil.readJSONFromInput(data);}
/** File Reader config with JSON reading */
const campaignReader = new FileReader();
campaignReader.onload = (data) => {localStorageUtil.readCampaignJSON(data);}


/* Utility functions for the LocalData utility class.*/
const localStorageUtil = 
{
    readJSONFromInput : function (event)
    {
        let currentStorage = LocalData.getLocalStorage();
        var result = JSON.parse(event.target.result);
        for (let newKey in result)
        {
            let flag = true;
            for(let key in currentStorage)
            {
                if(key == newKey)
                {
                    flag = false;
                }
            }
            if(flag)
            {
                currentStorage[newKey] = result[newKey];
            }
        }
        var formatted = JSON.stringify(currentStorage, null, 4);
        localStorage.content = formatted;
        writeContentList();
        return true;
    },
    readCampaignJSON : function (event)
    {
        var result = JSON.parse(event.target.result);
        var formatted = JSON.stringify(result, null, 4);
        localStorage.campaign = formatted;
        return true;
    },
    getDefaultContent : function ()
    {
        let c = DEFAULT_DATA;
        return c;
    },
    getCampaign : function()
    {
        let c = CAMPAIGN_DATA;
        return c;
    }
}

/**LocalData is a set of static functions to manipulate the localStorage.content of the user.*/
class LocalData
{
    /**LocalData.getLocalStorage() returns the current localStorage.content data
     * @return Object with either the current localStorage.content or the Default one (setting it if need be). */
    static getLocalStorage()
    {
        if(localStorage.content == "{}" || localStorage.content == undefined)
        {
            let c = localStorageUtil.getDefaultContent();
            localStorage.content = JSON.stringify(c);
            return c;
        }
        else
        {
            return JSON.parse(localStorage.content);
        }    
    }

    static get(filter, value)
    {
        let data = LocalData.getLocalStorage();
        let ret = {};
        if(value == "All")
            ret = [];

        // Look in each Source File
        for(let sourceContent in data)
        {
            // If we search for "source" - value, return the source
            if(filter == "source" && sourceContent == value )
            {
                return data[sourceContent];
            }
            // If we search for a given key and it is present in the source file, add the Source File to return.
            else if(!value && data[sourceContent][filter])
            {
                ret[sourceContent] = {};
                ret[sourceContent] = data[sourceContent];
            }
            // If we search for filter - "All", return an array of all things in any Active Source that have the filter key.
            else if(value == "All" && data[sourceContent][filter] && data[sourceContent].isActive)
            {
                for(let i = 0; i < data[sourceContent][filter].length; i++)
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
        if(data[source] == undefined) // Create the source if we don't have it
        {
            LocalData.createSource(source);
            data = LocalData.getLocalStorage();
        }
        if(data[source][key] == undefined) // Create the key if we don't have it
        {
            data[source][key] = [];
        }

        // Allow to have multiple names that are identical, but add timestamp to everything
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
        if(data[name])
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
        if(data[name])
        {
            data[name] = undefined;
        }

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


class CampaignData 
{
    static getCampaignData()
    {
        if(localStorage.campaign == "{}" || localStorage.campaign == undefined)
        {
            let c = localStorageUtil.getCampaign();
            localStorage.campaign = JSON.stringify(c);
            return c;
        }
        else
        {
            return JSON.parse(localStorage.campaign);
        }    
    }
    static get(filter, value)
    {
        let data = CampaignData.getCampaignData();
        if(!value)
            return data[filter];
        else
            return data[filter][value];
    }
    /**LocalData.storeToLocal() returns the current localStorage.content data
     * @param fileInput <input type="files" onchange="LocalData.storeToLocal(this.files)"/> */
     static storeToLocal(fileInput)
     {
         fileReader.readAsText(fileInput.item(0));
     }
}
/* Utility functions for the user triggered mouse events.*/
const eventManagement = 
{
    eventPath : function (el)
    {
        var path = [];

        while (el) 
        {
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
    restrictToCanvas : function (event)
    {
        if(!event) { event = window.event; }

        // Prevent camera zoom when hovering menus
        if(eventManagement.eventPath(event.target)[1] == document.querySelector('body'))
        {
            return true;
        }
        return false;
    }
}

/**RANDOM 
 * GLOBAL 
 * STUFF */

/** Turn the rgb value into a Hex value understood by <input type="color" /> */
function rgbToHex(r, g, b)
{
    let componentToHex = (c) => { var hex = c.toString(16); return hex.length == 1 ? "0" + hex : hex; }
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
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
    xmlHttp.onreadystatechange = function() 
    {
        if(xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            callback(xmlHttp.responseText)};
        } 
        xmlHttp.open("GET", theUrl, true); xmlHttp.send(null);
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
/** Is the Vector withing a Shape (Array of objects with a position attribute) ?
 * I can't seem to recall where I found this code. Likely it came from Coding Train Slack with some pimping by yours truly*/
function intersects(vector, shape)
{
    let s = clone(shape);
    s[shape.length] = shape[0];
    let wn = 0;
    for(let i = 0; i < s.length -1; i++)
    {
        let vec1 = createVector(s[i].x, s[i].y);
        let vec2 = createVector(s[i+1].x, s[i+1].y);
        if (vec2.y <= vector.y)
        {
            if (vec1.y > vector.y)
            {
                if (isLeft([vec2.x, vec2.y], [vec1.x, vec1.y], [vector.x,vector.y]) > 0)
                {
                    wn++;
                }
            }
        } 
        else 
        {
            if (vec1.y <= vector.y)
            {
                if (isLeft([vec2.x, vec2.y], [vec1.x, vec1.y], [vector.x,vector.y]) < 0)
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
    var res = ( (P1[0] - P0[0]) * (P2[1] - P0[1])
                - (P2[0] -  P0[0]) * (P1[1] - P0[1]) );
    return res;
}
function getDistanceUnit(clickDistance)
{
    let ret = {};
    if(clickDistance > 100 && clickDistance < 100000)
    {
        ret = {"unit" : "m", "value" : floor(clickDistance / 100) }
    }
    else if(clickDistance >= 100000)
    {
        ret = {"unit" : "km", "value" : floor(clickDistance / 100000) }
    }
    else
    {
        ret = {"unit" : "clicks" , "value" : clickDistance}
    }
    return ret;
}
function getCurrency(goldStandard)
{
    if(goldStandard < 0.1)
    {
        return `${goldStandard * 100} Copper`
    }
    if(goldStandard < 1)
    {
        return `${goldStandard * 10} Silver`
    }
    if(goldStandard > 1)
    {
        return `${goldStandard} Gold`
    }
}
function getTimeSince(object)
{
    let time = ``;
    if(object.timestamp)
    {
        time = Date.now() - object.timestamp;
        if(time / 60000 < 1)
        {
            time = round(time / 1000);
            return {"value" :  time, "unit" : "seconds", "unitValue" : 0, "uV" : 1, "obj" : object.timestamp}
        }
        else if(time / (60000 * 60) < 1)
        {
            time = round(time / 60000);
            return {"value" :  time, "unit" : "minutes", "unitValue" : 0.01 , "uV" : 60, "obj" : object.timestamp}
        }
        else if (time / (60000 * 60 * 24) < 1)
        {
            time = round(time / (60000 * 60) );
            return {"value" :  time, "unit" : "hours" , "unitValue" : 0.6, "uV" : 60*60}
        }
        else
        {
            time = round(time / (60000 * 60 * 24) );
            return {"value" : time, "unit" : "days", "unitValue" : (0.6 * 24) , "uV" : 24*60*60}
        }
    }
    return time;
}
/** DOM functionality. I believe that's used for like the tabs in the Game page, but I'm not even 100% sure... */
function toggleTab(id, state)
{
    let elt = document.querySelector(`#${id}Tab`);
    if(!state)
    {
        if(elt.style.display == "none")
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


const CAMPAIGN_DATA = 
{
    "name" : "Your Group",
    "position" : { "x" : "1250000", "y" : "1250000"},
    "state" : "Idle",
    "startedTime" : 1550119700000,
    "timestamp" : 1550119700000,
    "points" : 
    {
        "experience" : "0",
        "gold" : "0",
        "renown" : "0",
    },
    "party" : 
    [
        {
            "name":"Nobs",
            "position" :{"x":"0","y":"0"},
            "dimension":{"x":"75","y":"75"},
            "hitPoints":{"dieAmount":"1","dieType":"6","bonus":"0"},
            "armorClass":"10",
            "speed":"900",
            "actionsPerTurn":"1",
            "actions":
            [
                {"name":"Dash","target":"Self","reach":"10","areaEffect":"1","uses":"-1","condition":{"name":"Dashing","duration":"0","moveMod":"1","damage":"0"}},
                {"name":"Dodge","target":"Self","reach":"10","areaEffect":"1","uses":"-1","condition":{"name":"Dodging","duration":"0","disadvantageTarget":"true"}},
                {"name":"Help","target":"Ally","reach":"150","areaEffect":"1","uses":"-1","condition":{"name":"Helped by Nobs","duration":"1","advantageHit":"true"}},
                {"name":"Unarmed Strike","damage":"1","damageAbility":"Strength","damageType":"Bludgeoning","toHit":"Strength","toHitExtra":"2","target":"Enemy","reach":"150","areaEffect":"1","uses":"-1"}
            ],
            "conditions":[],
            "pools":{}
        }
    ],
    "inventory" : 
    [

    ]
};

const DEFAULT_DATA = 
{
    "Default" : 
    {
        isActive : true,
        "encounters" : 
        [
            {
                "timestamp": 1550187999727,
                "areas": [
                    {
                        "name": "",
                        "coloration": {
                            "r": 87,
                            "g": 59,
                            "b": 12,
                            "a": 255
                        },
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
                        "coloration": {
                            "r": 0,
                            "g": 128,
                            "b": 0,
                            "a": 158
                        },
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
                        "coloration": {
                            "r": 249,
                            "g": 199,
                            "b": 63,
                            "a": 32
                        },
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
                        "coloration": {
                            "r": 250,
                            "g": 224,
                            "b": 70,
                            "a": 44
                        },
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
                        "coloration": {
                            "r": 250,
                            "g": 224,
                            "b": 70,
                            "a": 55
                        },
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
                        "coloration": {
                            "r": 255,
                            "g": 78,
                            "b": 65,
                            "a": 53
                        },
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
                        "coloration": {
                            "r": 162,
                            "g": 18,
                            "b": 18,
                            "a": 72
                        },
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
                        "coloration": {
                            "r": 249,
                            "g": 199,
                            "b": 63,
                            "a": 33
                        },
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
                        "coloration": {
                            "r": 250,
                            "g": 224,
                            "b": 70,
                            "a": 59
                        },
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
                        "coloration": {
                            "r": 250,
                            "g": 224,
                            "b": 70,
                            "a": 72
                        },
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
                        "coloration": {
                            "r": 255,
                            "g": 78,
                            "b": 65,
                            "a": 51
                        },
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
                        "coloration": {
                            "r": 162,
                            "g": 18,
                            "b": 18,
                            "a": 75
                        },
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
                        "coloration": {
                            "r": 43,
                            "g": 43,
                            "b": 40,
                            "a": 255
                        },
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
                        "coloration": {
                            "r": 43,
                            "g": 43,
                            "b": 40,
                            "a": 255
                        },
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
                        "coloration": {
                            "r": 43,
                            "g": 43,
                            "b": 40,
                            "a": 255
                        },
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
                        "coloration": {
                            "r": 0,
                            "g": 64,
                            "b": 0,
                            "a": 206
                        },
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
                        "coloration": {
                            "r": 0,
                            "g": 64,
                            "b": 0,
                            "a": 206
                        },
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
                                "stk": {
                                    "r": 128,
                                    "g": 128,
                                    "b": 192,
                                    "a": 255
                                },
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
                                            "moveMod": 1,
                                        },
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
                                            "disadvantageTarget": true,
                                        },
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
                                            "advantageHit": true,
                                        },
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
                                        "expandsPool" : "true",
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
                                        "expandsPool" : "true",
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
                                        "expandsPool" : "true",
                                        "condition": {
                                            "name": "Commanded by Genji",
                                            "duration": 10,
                                            "save" : "Wisdom",
                                            "saveDC" : "12",
                                            "charm" : "true"
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
                                "stk": {
                                    "r": 128,
                                    "g": 0,
                                    "b": 64,
                                    "a": 255
                                },
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
                                        },
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
                                            "disadvantageTarget": true,
                                        },
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
                                            "advantageHit": true,
                                        },
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
                                        "expandsPool" : "true"
                                    },
                                    {
                                        "name": "Poison Vial",
                                        "target": "Point",
                                        "uses": -1,
                                        "pool" : "Poison Vials",
                                        "expandsPool" : "true",
                                        "reach": 900,
                                        "areaEffect": 300,
                                        "condition": {
                                            "name": "Poisoned",
                                            "duration": 5,
                                            "damage": "1d6",
                                            "save": "Constitution",
                                            "saveDC": 12,
                                        }
                                    }
                                ],
                                "conditions": [],
                                "pools": {
                                    "Arrows": 10,
                                    "Poison Vials" : 1
                                }
                            },
                            {
                                "name": "Goblin Troop",
                                "stk": {
                                    "r": 128,
                                    "g": 0,
                                    "b": 64,
                                    "a": 255
                                },
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
                                            "moveMod": 1,
                                        },
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
                                            "disadvantageTarget": true,
                                        },
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
                                            "advantageHit": true,
                                        },
                                    },
                                    {
                                        "name": "Swimitar",
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
                                "stk": {
                                    "r": 128,
                                    "g": 0,
                                    "b": 64,
                                    "a": 255
                                },
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
                                            "moveMod": 1,
                                        },
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
                                            "disadvantageTarget": true,
                                        },
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
                                            "advantageHit": true,
                                        },
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
                                        "pool" : "Javelins",
                                        "expandsPool" : "true",
                                        "reach": 900,
                                        "areaEffect": 1
                                    }
                                ],
                                "conditions": [],
                                "pools": {
                                    "Javelins" : 5
                                }
                            },
                            {
                                "name": "Goblin Troop",
                                "stk": {
                                    "r": 128,
                                    "g": 0,
                                    "b": 64,
                                    "a": 255
                                },
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
                                            "moveMod": 1,
                                        },
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
                                            "disadvantageTarget": true,
                                        },
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
                                            "advantageHit": true,
                                        },
                                    },
                                    {
                                        "name": "Swimitar",
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
                                "stk": {
                                    "r": 128,
                                    "g": 0,
                                    "b": 64,
                                    "a": 255
                                },
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
                                            "moveMod": 1,
                                        },
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
                                            "disadvantageTarget": true,
                                        },
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
                                            "advantageHit": true,
                                        },
                                    },
                                    {
                                        "name": "Swimitar",
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
                                "stk": {
                                    "r": 128,
                                    "g": 0,
                                    "b": 64,
                                    "a": 255
                                },
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
                                        },
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
                                            "disadvantageTarget": true,
                                        },
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
                                            "advantageHit": true,
                                        },
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
                                        "pool" : "Poison Vials",
                                        "expandsPool" : "true",
                                        "reach": 900,
                                        "areaEffect": 300,
                                        "condition": {
                                            "name": "Poisoned",
                                            "duration": 5,
                                            "damage": "1d6",
                                            "save": "Constitution",
                                            "saveDC": 12,
                                        }
                                    }
                                ],
                                "conditions": [],
                                "pools": {
                                    "Arrows": 20,
                                    "Poison Vials" : 1
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
        "maps" : 
        [

        ],
        "troops" : 
        [
            {
                "timestamp" : 1550187999727,
                "name": "Barga",
                "source": "Default",
                "type": "humanoïd (Bugbear)",
                "dimension": {"x": "75", "y" : "75"},
                "size": "Medium",
                "armorClass": "17",
                "hitPoints": 
                {
                  "dieAmount": "14",
                  "dieType": "1",
                  "bonus": "0",
                  "formula": "14d1+0"
                },
                "abilityScores": 
                {
                  "Strength": 
                  {
                    "score": "18",
                    "bonus": "4"
                  },
                  "Dexterity": 
                  {
                    "score": "16",
                    "bonus": "3"
                  },
                  "Constitution": 
                  {
                    "score": "14",
                    "bonus": "2"
                  },
                  "Intelligence": 
                  {
                    "score": "12",
                    "bonus": "1"
                  },
                  "Wisdom": 
                  {
                    "score": "14",
                    "bonus": "2"
                  },
                  "Charisma": 
                  {
                    "score": "12",
                    "bonus": "1"
                  }
                },
                "speed": "900",
                "actionsPerTurn": "1",
                "turnsAmount": "1",
                "pools": 
                {
                  "Rages": "2"
                },
                "actions": 
                [
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
                    "condition": 
                    {
                      "name": "Enraged",
                      "duration": "10",
                      "resistances": "Slashing, Piercing, Bludgeoning, ",
                      "additional": "damageBonus",
                      "damageBonus": "2"
                    }
                  }
                ],
                "conditions": []
              }
        ],
        "races" :
        [
            {
                "name" : "Dragonid",
                "modifiers" : 
                [ 
                    {"type" : "abilityScore", "key" : "Strength", "value" : "2"},
                    {"type" : "armorClass", "value" : {"base" : 13, "ability" : "Dexterity"}},
                    {"type" : "pool", "value" : {"Dragon Breath" : 1}},
                    {
                        "type" : "action",
                        "value" : 
                        {
                            "name" : "Dragon Breath",
                            "uses" : "-1",
                            "pool" : "Dragon Breath",
                            "expandsPool" : "true",
                            "target" : "Enemy",
                            "reach" : "900",
                            "areaEffect" : "450",
                            "damage" : "2d6",
                            "damageType" : "Any Element",
                            "damageAbility" : "None",
                            "saveAbility" : "Dexterity",
                            "saveDC" : "12"
                        }
                    },
                    {
                        "type" : "action",
                        "value" : 
                        {
                            "name" : "Collect Breath",
                            "uses" : "2",
                            "target" : "Self",
                            "reach" : "10",
                            "areaEffect" : "1",
                            "condition" : 
                            {
                                "name": "Recharge",
                                "duration": "0",
                                "recharge": "Dragon Breath, 1"
                            }
                        }
                    }
                ]
            },
            {
                "name" : "Elf",
                "modifiers" : 
                [
                    {"type" : "abilityScore", "key" : "Dexterity", "value" : "2"},
                    {"type" : "speed", "value" : "1050"},
                    {"type" : "condition", "value" : {"name" : "Sleep Immunity", "duration" : "-1", "immunities" : "Sleep, "}},
                    {"type" : "condition", "value" : {"name" : "Charm Advantage", "duration" : "-1", "saveAdvantage" : "Charmed"}},
                    {
                        "type" : "action", 
                        "value" : 
                        {
                            "name" : "Elven Sword",
                            "target" : "Enemy",
                            "uses" : "-1",
                            "reach" : "150",
                            "areaEffect" : "1",
                            "damage" : "1d8",
                            "damageAbility" : "Dexterity",
                            "damageExtra" : "0",
                            "damageType" : "Slashing",
                            "toHit" : "Dexterity",
                            "toHitExtra" : "0"
                        }
                    }
                ]
            },
            {
                "name" : "Dwarf",
                "modifiers" : 
                [
                    {"type" : "abilityScore", "key" : "Constitution", "value" : "2"},
                    {"type" : "speed", "value" : "750"},
                    {"type" : "armorClass", "value" : {"base" : "16"}},
                    {"type" : "size", "value" : "Small"},
                    {"type" : "pool", "value" : {"Handaxes" : 2} },
                    {
                        "type" : "action", 
                        "value" : 
                        {
                            "name" : "Handaxe Thrown",
                            "target" : "Enemy",
                            "uses": "-1",
                            "pool" : "Handaxes",
                            "expandsPool" : "true",
                            "reach": "900",
                            "areaEffect": "1",
                            "damage" : "1d6",
                            "damageAbility" : "Strength",
                            "damageExtra" : "0",
                            "damageType" : "Slashing",
                            "toHit" : "Strength",
                            "toHitExtra" : "0",
                        }
                    },
                    {
                        "type" : "action", 
                        "value" : 
                        {
                            "name" : "Handaxe",
                            "target" : "Enemy",
                            "uses": "-1",
                            "reach": "150",
                            "areaEffect": "1",
                            "damage" : "1d6",
                            "damageAbility" : "Strength",
                            "damageExtra" : "0",
                            "damageType" : "Slashing",
                            "toHit" : "Strength",
                            "toHitExtra" : "0",
                            "pool" : "Handaxes"
                        }
                    },
                    {
                        "type" : "condition",
                        "value" : 
                        {
                            "name" : "Poison Reistance",
                            "duration" : "-1",
                            "resistances" : "Poison, ",
                            "saveAdvantage" : "Poisoned"
                        }
                    }
                ]
                    
            },
            {
                "name" : "Gnome",
                "modifiers" : 
                [
                    {"type" : "abilityScore", "key" : "Intelligence", "value" : "2"},
                    {"type" : "speed", "value" : "750"},
                    {"type" : "condition", "value" : {"name" : "Save Intelligence", "duration" : "-1", "saveAdvantage" : "Intelligence"}},
                    {"type" : "condition", "value" : {"name" : "Save Wisdom", "duration" : "-1", "saveAdvantage" : "Wisdom"}},
                    {"type" : "condition", "value" : {"name" : "Save Charisma", "duration" : "-1", "saveAdvantage" : "Charisma"}},
                    {
                        "type" : "action",
                        "value" : 
                        {
                            "name" : "Illusion of a Slap",
                            "uses" : "-1",
                            "target" : "Enemy",
                            "reach" : "1800",
                            "areaEffect" : "1",
                            "saveAbility" : "Intelligence",
                            "saveDC" : "12",
                            "saveCancelsDamage" : "true",
                            "damage" : "1d6",
                            "damageAbility" : "Intelligence",
                            "damageExtra" : "0",
                            "damageType" : "Psychic",
                        }
                    }
                ]
            },
            {
                "name" : "Halfling",
                "modifiers" : 
                [
                    {"type" : "abilityScore", "key" : "Wisdom", "value" : "2"},
                    {"type" : "speed", "value" : "750"},
                    {"type" : "condition",  "value" : {"name" : "Brave","duration" : "-1","saveAdvantage" : "Frightened"} },
                    {"type" : "condition", "value" : { "name" : "Lucky", "duration" : "-1", "rerollHit" : "1" } },
                    {
                        "type" : "action",
                        "value" : 
                        {
                            "name" : "Sling",
                            "uses" : "-1",
                            "reach" : "900",
                            "areaEffect" : "1",
                            "toHit": "Dexterity",
                            "toHitExtra" : "0",
                            "damage" : "1d6",
                            "damageAbility" : "Dexterity",
                            "damageExtra" : "0",
                            "damageType" : "Bludgeoning",
                        }
                    }
                ]
            },
            {
                "name" : "Celestial",
                "modifiers" : 
                [
                    {"type" : "abilityScore", "key" : "Charisma", "value" : "2"},
                    {"type" : "speed", "value" : "1050"},
                    {"type" : "condition", "value" : {"name" : "Celestial Resistances","duration" : "-1", "resistances" : "Radiant, Necrotic, "}},
                    {
                        "type" : "action",
                        "value" : 
                        {
                            "name" : "Healing Touch",
                            "target" : "Ally",
                            "uses" : "1",
                            "reach" : "150",
                            "areaEffect" : "1",
                            "damage" : "-1d20",
                            "damageAbility" : "None",
                        }
                    },
                    {
                        "type" : "action",
                        "value" : 
                        {
                            "name" : "Unarmed Radiance",
                            "target" : "Enemy",
                            "uses" : "-1",
                            "reach" : "150",
                            "areaEffect" : "1",
                            "toHit" : "Strength",
                            "toHitExtra" : "0",
                            "damage" : "1d6",
                            "damageAbility" : "Charisma",
                            "damageExtra" : "0",
                            "damageType" : "Radiant",
                        }
                    }
                ]
            },
            {
                "name" : "Human",
                "modifiers" : 
                [
                    {"type" : "abilityScore", "key" : "Strength", "value" : "1"},
                    {"type" : "abilityScore", "key" : "Dexterity", "value" : "1"},
                    {"type" : "abilityScore", "key" : "Constitution", "value" : "1"},
                    {"type" : "abilityScore", "key" : "Intelligence", "value" : "1"},
                    {"type" : "abilityScore", "key" : "Wisdom", "value" : "1"},
                    {"type" : "abilityScore", "key" : "Charisma", "value" : "1"},
                    {
                        "type" : "action", 
                        "value" : 
                        {
                            "name" : "Crossbow",
                            "uses" : "-1",
                            "pool" : "Loaded Crossbow Bolts",
                            "expandsPool" : "true",
                            "target" : "Enemy",
                            "reach" : "150",
                            "areaEffect" : "1",
                            "toHit" : "Strength",
                            "toHitExtra" : "0",
                            "damage" : "1d10",
                            "damageAbility" : "Strength",
                            "damageExtra" : "0",
                            "damageType" : "Slashing"
                        }
                    },
                    {
                        "type" : "action", 
                        "value" : 
                        {
                            "name" : "Load Crossbow",
                            "uses" : "-1",
                            "pool" : "Crossbow Bolts",
                            "expandsPool" : "true",
                            "target" : "Self",
                            "reach" : "10",
                            "areaEffect" : "1",
                            "condition" : 
                            {
                                "name" : "Loading",
                                "duration" : "0",
                                "recharge" : "Loaded Crossbow Bolts, 1"
                            }
                        }
                    },
                    {"type" : "pool", "value" : {"Loaded Crossbow Bolt" : "1"}},
                    {"type" : "pool", "value" : {"Crossbow Bolts" : "10"}},
                ]
            },
            {
                "name" : "Half-Elf",
                "modifiers" : 
                [
                    {
                        "type" : "selection", 
                        "amount" : "2", 
                        "list" : 
                        [
                            {"name" : "Strength Bonus", "value": {"type" : "abilityScore", "key" : "Strength", "value" : "2"}},
                            {"name" : "Dexterity Bonus", "value": {"type" : "abilityScore", "key" : "Dexterity", "value" : "2"}},
                            {"name" : "Constitution Bonus", "value": {"type" : "abilityScore", "key" : "Constitution", "value" : "2"}},
                            {"name" : "Intelligence Bonus", "value": {"type" : "abilityScore", "key" : "Intelligence", "value" : "2"}},
                            {"name" : "Wisdom Bonus", "value": {"type" : "abilityScore", "key" : "Wisdom", "value" : "2"}},
                            {"name" : "Charisma Bonus", "value": {"type" : "abilityScore", "key" : "Charisma", "value" : "2"}},
                        ]
                    },
                    {
                        "type" : "selection",
                        "amount" : 1,
                        "canDuplicate" : "true",
                        "list" : 
                        [
                            {
                                "name" : "Strong Bow", 
                                "values" : 
                                [
                                    {"type" : "pool", "value" : {"Arrows": 10}},
                                    {
                                        "type" : "action", 
                                        "value" : 
                                        {
                                            "name" : "Elven Bow",
                                            "target" : "Enemy",
                                            "uses" : "-1",
                                            "pool" : "Arrows",
                                            "expandsPool" : "true",
                                            "reach" : "2400",
                                            "areaEffect" : "1",
                                            "damage" : "1d8",
                                            "damageAbility" : "Strength",
                                            "damageExtra" : "0",
                                            "damageType" : "Piercing",
                                            "toHit" : "Strength",
                                            "toHitExtra" : "0"
                                        }
                                    }
                                ]
                            },
                            {
                                "name" : "Subtle Bow", 
                                "values" : 
                                [
                                    {"type" : "pool", "value" : {"Arrows": 10}},
                                    {
                                        "type" : "action", 
                                        "value" : 
                                        {
                                            "name" : "Elven Bow",
                                            "target" : "Enemy",
                                            "uses" : "-1",
                                            "pool" : "Arrows",
                                            "expandsPool" : "true",
                                            "reach" : "2400",
                                            "areaEffect" : "1",
                                            "damage" : "1d8",
                                            "damageAbility" : "Dexterity",
                                            "damageExtra" : "0",
                                            "damageType" : "Piercing",
                                            "toHit" : "Dexterity",
                                            "toHitExtra" : "0"
                                        }
                                    }
                                ]
                            },
                            {
                                "name" : "Strong Sword", 
                                "values" : 
                                [
                                    {
                                        "type" : "action", 
                                        "value" : 
                                        {
                                            "name" : "Elven Sword",
                                            "target" : "Enemy",
                                            "uses" : "-1",
                                            "reach" : "150",
                                            "areaEffect" : "1",
                                            "damage" : "1d8",
                                            "damageAbility" : "Strength",
                                            "damageExtra" : "0",
                                            "damageType" : "Slashing",
                                            "toHit" : "Strength",
                                            "toHitExtra" : "0"
                                        }
                                    }
                                ]
                            },
                            {
                                "name" : "Subtle Sword", 
                                "values" : 
                                [
                                    {
                                        "type" : "action", 
                                        "value" : 
                                        {
                                            "name" : "Elven Sword",
                                            "target" : "Enemy",
                                            "uses" : "-1",
                                            "reach" : "150",
                                            "areaEffect" : "1",
                                            "damage" : "1d8",
                                            "damageAbility" : "Dexterity",
                                            "damageExtra" : "0",
                                            "damageType" : "Slashing",
                                            "toHit" : "Dexterity",
                                            "toHitExtra" : "0"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
    }
}