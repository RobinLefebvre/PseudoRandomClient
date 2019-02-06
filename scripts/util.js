const SERVER = "http://localhost:6006/"; //"file:///C:/Users/Robin/Projets/[STUFF]/TRPG/client/"; // "http://localhost:6006/"; // "https://trpgproto.glitch.me/";

/** Disable Context Menu */
document.oncontextmenu = function(event){if(event.preventDefault != undefined){event.preventDefault();}if(event.stopPropagation != undefined){event.stopPropagation();};}

/** File Reader preset with JSON reading */
const fileReader = new FileReader();
fileReader.onload = (data) => {localStorageUtil.readJSONFromInput(data);}


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

    getDefaultContent : function ()
    {
        let c = {};
        c["Default"] = {};
        c["Default"].isActive = true;
        c["Default"].encounters = [];
        let enc =[{"areas":[{"name":"","coloration":{"r":87,"g":59,"b":12,"a":255},"shape":"[{\"x\":-5,\"y\":4804},{\"x\":4804,\"y\":4804},{\"x\":4804,\"y\":-5},{\"x\":-5,\"y\":-5}]","position":{"x":2400,"y":2400},"radius":3400,"randomize":0,"pointsAmount":4,"animated":false},{"name":"","coloration":{"r":0,"g":128,"b":0,"a":158},"shape":"[{\"x\":2250,\"y\":4053},{\"x\":2668,\"y\":2805},{\"x\":2098,\"y\":2247},{\"x\":0,\"y\":1501},{\"x\":0,\"y\":4800},{\"x\":1799,\"y\":4800}]","position":{"x":1114,"y":3298},"radius":50,"randomize":0,"pointsAmount":6,"animated":false},{"name":"Fire","coloration":{"r":249,"g":199,"b":63,"a":32},"shape":"[{\"x\":3485,\"y\":4529},{\"x\":3912,\"y\":4520},{\"x\":4305,\"y\":4356},{\"x\":4624,\"y\":4067},{\"x\":4779,\"y\":3664},{\"x\":4771,\"y\":3236},{\"x\":4605,\"y\":2845},{\"x\":4305,\"y\":2544},{\"x\":3914,\"y\":2369},{\"x\":3483,\"y\":2359},{\"x\":3095,\"y\":2545},{\"x\":2799,\"y\":2848},{\"x\":2617,\"y\":3234},{\"x\":2615,\"y\":3665},{\"x\":2785,\"y\":4060},{\"x\":3089,\"y\":4363}]","position":{"x":3700,"y":3450},"radius":1100,"randomize":"0.05","pointsAmount":"16","animated":true},{"name":"","coloration":{"r":250,"g":224,"b":70,"a":44},"shape":"[{\"x\":3593,\"y\":3947},{\"x\":3790,\"y\":3945},{\"x\":3969,\"y\":3868},{\"x\":4104,\"y\":3728},{\"x\":4177,\"y\":3549},{\"x\":4177,\"y\":3356},{\"x\":4099,\"y\":3180},{\"x\":3968,\"y\":3039},{\"x\":3789,\"y\":2962},{\"x\":3593,\"y\":2957},{\"x\":3413,\"y\":3035},{\"x\":3280,\"y\":3178},{\"x\":3203,\"y\":3355},{\"x\":3194,\"y\":3552},{\"x\":3275,\"y\":3731},{\"x\":3416,\"y\":3864}]","position":{"x":3692,"y":3453},"radius":500,"randomize":0.05,"pointsAmount":16,"animated":true},{"name":"","coloration":{"r":250,"g":224,"b":70,"a":55},"shape":"[{\"x\":3641,\"y\":3745},{\"x\":3758,\"y\":3743},{\"x\":3865,\"y\":3698},{\"x\":3947,\"y\":3615},{\"x\":3991,\"y\":3507},{\"x\":3992,\"y\":3391},{\"x\":3947,\"y\":3284},{\"x\":3866,\"y\":3200},{\"x\":3758,\"y\":3157},{\"x\":3641,\"y\":3156},{\"x\":3534,\"y\":3201},{\"x\":3454,\"y\":3285},{\"x\":3406,\"y\":3391},{\"x\":3403,\"y\":3508},{\"x\":3449,\"y\":3617},{\"x\":3533,\"y\":3698}]","position":{"x":3700,"y":3450},"radius":300,"randomize":0.05,"pointsAmount":16,"animated":true},{"name":"","coloration":{"r":255,"g":78,"b":65,"a":53},"shape":"[{\"x\":3670,\"y\":3597},{\"x\":3729,\"y\":3598},{\"x\":3782,\"y\":3574},{\"x\":3825,\"y\":3533},{\"x\":3848,\"y\":3479},{\"x\":3847,\"y\":3420},{\"x\":3825,\"y\":3366},{\"x\":3782,\"y\":3325},{\"x\":3729,\"y\":3301},{\"x\":3670,\"y\":3302},{\"x\":3616,\"y\":3325},{\"x\":3575,\"y\":3367},{\"x\":3555,\"y\":3421},{\"x\":3556,\"y\":3478},{\"x\":3577,\"y\":3532},{\"x\":3616,\"y\":3574}]","position":{"x":3700,"y":3450},"radius":150,"randomize":0.05,"pointsAmount":16,"animated":true},{"name":"","coloration":{"r":162,"g":18,"b":18,"a":72},"shape":"[{\"x\":3694,\"y\":3479},{\"x\":3705,\"y\":3479},{\"x\":3716,\"y\":3474},{\"x\":3724,\"y\":3466},{\"x\":3729,\"y\":3455},{\"x\":3729,\"y\":3444},{\"x\":3725,\"y\":3433},{\"x\":3716,\"y\":3425},{\"x\":3705,\"y\":3421},{\"x\":3694,\"y\":3420},{\"x\":3683,\"y\":3425},{\"x\":3675,\"y\":3433},{\"x\":3671,\"y\":3444},{\"x\":3670,\"y\":3455},{\"x\":3675,\"y\":3466},{\"x\":3683,\"y\":3474}]","position":{"x":3700,"y":3450},"radius":30,"randomize":0.05,"pointsAmount":16,"animated":true},{"name":"Fire","coloration":{"r":249,"g":199,"b":63,"a":33},"shape":"[{\"x\":3002,\"y\":2093},{\"x\":3396,\"y\":2089},{\"x\":3754,\"y\":1929},{\"x\":4027,\"y\":1652},{\"x\":4179,\"y\":1294},{\"x\":4163,\"y\":908},{\"x\":4006,\"y\":561},{\"x\":3749,\"y\":277},{\"x\":3395,\"y\":116},{\"x\":3003,\"y\":113},{\"x\":2637,\"y\":257},{\"x\":2360,\"y\":539},{\"x\":2200,\"y\":901},{\"x\":2208,\"y\":1297},{\"x\":2367,\"y\":1656},{\"x\":2649,\"y\":1924}]","position":{"x":3200,"y":1100},"radius":1000,"randomize":0.05,"pointsAmount":16,"animated":true},{"name":"","coloration":{"r":250,"g":224,"b":70,"a":59},"shape":"[{\"x\":3111,\"y\":1545},{\"x\":3287,\"y\":1542},{\"x\":3447,\"y\":1470},{\"x\":3565,\"y\":1344},{\"x\":3639,\"y\":1187},{\"x\":3646,\"y\":1011},{\"x\":3578,\"y\":846},{\"x\":3448,\"y\":727},{\"x\":3287,\"y\":662},{\"x\":3111,\"y\":654},{\"x\":2947,\"y\":721},{\"x\":2821,\"y\":846},{\"x\":2761,\"y\":1012},{\"x\":2760,\"y\":1187},{\"x\":2827,\"y\":1348},{\"x\":2947,\"y\":1478}]","position":{"x":3200,"y":1100},"radius":450,"randomize":0.05,"pointsAmount":16,"animated":true},{"name":"","coloration":{"r":250,"g":224,"b":70,"a":72},"shape":"[{\"x\":3142,\"y\":1391},{\"x\":3257,\"y\":1389},{\"x\":3366,\"y\":1349},{\"x\":3453,\"y\":1269},{\"x\":3492,\"y\":1158},{\"x\":3491,\"y\":1042},{\"x\":3444,\"y\":936},{\"x\":3365,\"y\":852},{\"x\":3258,\"y\":803},{\"x\":3141,\"y\":803},{\"x\":3033,\"y\":851},{\"x\":2952,\"y\":934},{\"x\":2901,\"y\":1040},{\"x\":2901,\"y\":1159},{\"x\":2946,\"y\":1269},{\"x\":3034,\"y\":1347}]","position":{"x":3200,"y":1100},"radius":300,"randomize":0.05,"pointsAmount":16,"animated":true},{"name":"","coloration":{"r":255,"g":78,"b":65,"a":51},"shape":"[{\"x\":3170,\"y\":1246},{\"x\":3229,\"y\":1246},{\"x\":3280,\"y\":1221},{\"x\":3322,\"y\":1181},{\"x\":3345,\"y\":1129},{\"x\":3347,\"y\":1070},{\"x\":3325,\"y\":1015},{\"x\":3282,\"y\":976},{\"x\":3228,\"y\":957},{\"x\":3171,\"y\":955},{\"x\":3117,\"y\":975},{\"x\":3075,\"y\":1016},{\"x\":3054,\"y\":1071},{\"x\":3053,\"y\":1129},{\"x\":3076,\"y\":1182},{\"x\":3116,\"y\":1224}]","position":{"x":3200,"y":1100},"radius":150,"randomize":0.05,"pointsAmount":16,"animated":true},{"name":"","coloration":{"r":162,"g":18,"b":18,"a":75},"shape":"[{\"x\":3194,\"y\":1129},{\"x\":3205,\"y\":1129},{\"x\":3216,\"y\":1125},{\"x\":3224,\"y\":1116},{\"x\":3229,\"y\":1105},{\"x\":3229,\"y\":1094},{\"x\":3224,\"y\":1083},{\"x\":3216,\"y\":1075},{\"x\":3205,\"y\":1070},{\"x\":3194,\"y\":1070},{\"x\":3183,\"y\":1075},{\"x\":3175,\"y\":1083},{\"x\":3171,\"y\":1094},{\"x\":3170,\"y\":1105},{\"x\":3175,\"y\":1116},{\"x\":3183,\"y\":1124}]","position":{"x":3200,"y":1100},"radius":30,"randomize":0.05,"pointsAmount":16,"animated":true},{"name":"Caverns, East","coloration":{"r":43,"g":43,"b":40,"a":255},"shape":"[{\"x\":3514,\"y\":2772},{\"x\":3608,\"y\":2953},{\"x\":3900,\"y\":3085},{\"x\":4198,\"y\":2944},{\"x\":4456,\"y\":3047},{\"x\":4807,\"y\":3354},{\"x\":4803,\"y\":1473},{\"x\":4504,\"y\":1473},{\"x\":4192,\"y\":1789},{\"x\":3541,\"y\":1957},{\"x\":3334,\"y\":2090},{\"x\":3323,\"y\":2225},{\"x\":3415,\"y\":2482}]","position":{"x":4194,"y":2376},"radius":300,"randomize":0,"pointsAmount":13,"animated":false,"isObstacle":true},{"name":"Caverns, South","coloration":{"r":43,"g":43,"b":40,"a":255},"shape":"[{\"x\":4801,\"y\":4799},{\"x\":4801,\"y\":3598},{\"x\":4443,\"y\":3990},{\"x\":4056,\"y\":4120},{\"x\":3739,\"y\":4158},{\"x\":3550,\"y\":4067},{\"x\":3439,\"y\":3856},{\"x\":3300,\"y\":3748},{\"x\":3300,\"y\":3002},{\"x\":2961,\"y\":2659},{\"x\":2663,\"y\":2811},{\"x\":2251,\"y\":4053},{\"x\":1800,\"y\":4801}]","position":{"x":3261,"y":4100},"radius":300,"randomize":0,"pointsAmount":13,"animated":false,"isObstacle":true},{"name":"Caverns, North","coloration":{"r":43,"g":43,"b":40,"a":255},"shape":"[{\"x\":2994,\"y\":744},{\"x\":3290,\"y\":598},{\"x\":3749,\"y\":745},{\"x\":4053,\"y\":747},{\"x\":4346,\"y\":1046},{\"x\":4506,\"y\":1487},{\"x\":4814,\"y\":1513},{\"x\":4798,\"y\":469},{\"x\":4797,\"y\":0},{\"x\":1,\"y\":0},{\"x\":0,\"y\":1499},{\"x\":449,\"y\":1801},{\"x\":1382,\"y\":1998},{\"x\":2090,\"y\":2244},{\"x\":2572,\"y\":2151},{\"x\":3000,\"y\":2067},{\"x\":3187,\"y\":1842},{\"x\":3343,\"y\":1714},{\"x\":3286,\"y\":1497},{\"x\":2845,\"y\":1348},{\"x\":2835,\"y\":1050}]","position":{"x":2119,"y":910},"radius":300,"randomize":0,"pointsAmount":21,"animated":false,"isObstacle":true},{"name":"Bushes","coloration":{"r":0,"g":64,"b":0,"a":206},"shape":"[{\"x\":1340,\"y\":3760},{\"x\":1510,\"y\":3770},{\"x\":1630,\"y\":3750},{\"x\":1820,\"y\":3610},{\"x\":1810,\"y\":3420},{\"x\":1730,\"y\":3250},{\"x\":1590,\"y\":3190},{\"x\":1380,\"y\":3250},{\"x\":1260,\"y\":3280},{\"x\":1160,\"y\":3430},{\"x\":1160,\"y\":3560},{\"x\":1200,\"y\":3625},{\"x\":1280,\"y\":3685}]","position":{"x":1496,"y":3487},"radius":314,"randomize":"1.1","pointsAmount":"13","animated":false,"isObstacle":false,"conditions":[{"name":"Difficult Terrain","duration":0,"moveMod":-0.5}]},{"name":"Bushes","coloration":{"r":0,"g":64,"b":0,"a":206},"shape":"[{\"x\":931,\"y\":2677},{\"x\":1050,\"y\":2620},{\"x\":1116,\"y\":2531},{\"x\":1200,\"y\":2480},{\"x\":1273,\"y\":2366},{\"x\":1247,\"y\":2228},{\"x\":1146,\"y\":2121},{\"x\":1000,\"y\":2030},{\"x\":806,\"y\":2030},{\"x\":604,\"y\":2127},{\"x\":530,\"y\":2340},{\"x\":639,\"y\":2536},{\"x\":805,\"y\":2619}]","position":{"x":899,"y":2330},"radius":335,"randomize":1.1,"pointsAmount":13,"animated":false,"isObstacle":false,"conditions":[{"name":"Difficult Terrain","duration":0,"moveMod":-0.5}]}],"groups":[{"name":"Adventurers","color":"#8080c0","troops":[{"name":"Barga","stk":{"r":128,"g":128,"b":192,"a":255},"position":{"x":530,"y":3250},"dimension":{"x":50,"y":50},"htmlName":"<b style=\"color:rgb(128,128,192);\"> Barga </b>","isPlayer":false,"player":false,"abilityScores":{"Strength":{"score":18,"bonus":4},"Dexterity":{"score":16,"bonus":3},"Constitution":{"score":14,"bonus":2},"Intelligence":{"score":12,"bonus":1},"Wisdom":{"score":14,"bonus":2},"Charisma":{"score":12,"bonus":1}},"initiativeBonus":"3","hitPoints":{"dieAmount":14,"dieType":1,"bonus":0,"formula":"14d1+0"},"AC":"17","armorClass":17,"resistances":"","vulnerabilities":"","immunities":"","damageBonus":0,"toHitBonus":0,"speed":900,"movement":900,"turnActions":1,"actionsPerTurn":1,"actions":[{"name":"Dash","toHit":"None","saveSkill":"None","damage":"0","target":"Self","reach":10,"areaEffect":1,"uses":-1,"condition":{"name":"Dashing","duration":0,"moveMod":1,"damage":0},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Dodge","toHit":"None","saveSkill":"None","damage":"0","target":"Self","reach":10,"areaEffect":1,"uses":-1,"condition":{"name":"Dodging","duration":0,"disadvantageTarget":true,"damage":"0","skipTurn":false},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Help","toHit":"None","saveSkill":"None","damage":"0","target":"Ally","reach":150,"areaEffect":1,"uses":-1,"condition":{"name":"Helped by Barga","duration":1,"advantageHit":true,"damage":"0","skipTurn":false},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Javelin","damage":"1d6","damageAbility":"Strength","damageExtra":0,"damageType":"Piercing","toHit":"Strength","toHitExtra":2,"saveSkill":"None","saveDC":0,"target":"Enemy","uses":-1,"onSuccess":false,"reach":1050,"areaEffect":1, "pool" : "Javelins"},{"name":"Battleaxe","damage":"1d8","damageAbility":"Strength","damageExtra":0,"damageType":"Slashing","toHit":"Strength","toHitExtra":2,"saveSkill":"None","saveDC":0,"target":"Enemy","uses":-1,"onSuccess":false,"reach":300,"areaEffect":1},{"name":"Handaxe","damage":"1d6","damageAbility":"Strength","damageExtra":0,"damageType":"Slashing","toHit":"Strength","toHitExtra":2,"saveSkill":"None","saveDC":0,"target":"Enemy","uses":-1,"onSuccess":false,"reach":750,"areaEffect":1},{"name":"Rage","damage":"0","damageAbility":"None","damageExtra":0,"damageType":"","toHit":"None","toHitExtra":0,"saveSkill":"None","saveDC":0,"target":"Self","uses":-1,"onSuccess":false,"reach":100,"areaEffect":1,"condition":{"name":"Enraged","duration":10,"damage":"0","save":"None","saveDC":0,"resistances":"Slashing, Piercing, Bludgeoning","vulnerabilities":"","immunities":"","additional":"damageBonus","damageBonus":2}}],"conditions":[],"pools":{"Rages":2, "Javelins" : 5}},{"name":"Firga","stk":{"r":128,"g":128,"b":192,"a":255},"position":{"x":650,"y":3670},"dimension":{"x":50,"y":50},"htmlName":"<b style=\"color:rgb(128,128,192);\"> Firga </b>","isPlayer":false,"player":false,"abilityScores":{"Strength":{"score":18,"bonus":4},"Dexterity":{"score":16,"bonus":3},"Constitution":{"score":14,"bonus":2},"Intelligence":{"score":12,"bonus":1},"Wisdom":{"score":14,"bonus":2},"Charisma":{"score":12,"bonus":1}},"initiativeBonus":"3","hitPoints":{"dieAmount":12,"dieType":1,"bonus":0,"formula":"12d1+0"},"AC":"18","armorClass":18,"resistances":"","vulnerabilities":"","immunities":"","damageBonus":0,"toHitBonus":0,"speed":900,"movement":900,"turnActions":1,"actionsPerTurn":1,"actions":[{"name":"Dash","toHit":"None","saveSkill":"None","damage":"0","target":"Self","reach":10,"areaEffect":1,"uses":-1,"condition":{"name":"Dashing","duration":0,"moveMod":1,"damage":0},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Dodge","toHit":"None","saveSkill":"None","damage":"0","target":"Self","reach":10,"areaEffect":1,"uses":-1,"condition":{"name":"Dodging","duration":0,"disadvantageTarget":true,"damage":"0","skipTurn":false},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Help","toHit":"None","saveSkill":"None","damage":"0","target":"Ally","reach":150,"areaEffect":1,"uses":-1,"condition":{"name":"Helped by Firga","duration":1,"advantageHit":true,"damage":"0","skipTurn":false},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Second Wind","damage":"-1d10","damageAbility":"None","damageExtra":1,"damageType":"","toHit":"None","toHitExtra":0,"saveSkill":"None","saveDC":0,"target":"Self","uses":1,"onSuccess":false,"reach":10,"areaEffect":1,"condition":{"name":"Bonus action","duration":0,"damage":"0","save":"None","saveDC":0,"resistances":"","vulnerabilities":"","immunities":"","additional":"addAction","addAction":"1"}},{"name":"Maul","damage":"2d6","damageAbility":"Strength","damageExtra":0,"damageType":"Bludgeoning","toHit":"Strength","toHitExtra":2,"saveSkill":"None","saveDC":0,"target":"Enemy","uses":-1,"onSuccess":false,"reach":300,"areaEffect":1,"condition":{"name":"Great Weapon Master","duration":-1,"damage":"0","save":"None","saveDC":0,"resistances":"","vulnerabilities":"","immunities":""}},{"name":"Javelin","damage":"1d6","damageAbility":"Strength","damageExtra":0,"damageType":"Piercing","toHit":"Strength","toHitExtra":2,"saveSkill":"None","saveDC":0,"target":"Enemy","uses":-1,"onSuccess":false,"reach":900,"areaEffect":1,"pool":"Javelins"}],"conditions":[],"pools":{"Javelins":5}},{"name":"Clerga","stk":{"r":128,"g":128,"b":192,"a":255},"position":{"x":360,"y":3520},"dimension":{"x":50,"y":50},"htmlName":"<b style=\"color:rgb(128,128,192);\"> Clerga </b>","isPlayer":false,"player":false,"abilityScores":{"Strength":{"score":14,"bonus":2},"Dexterity":{"score":16,"bonus":3},"Constitution":{"score":14,"bonus":2},"Intelligence":{"score":14,"bonus":2},"Wisdom":{"score":16,"bonus":3},"Charisma":{"score":12,"bonus":1}},"initiativeBonus":"3","hitPoints":{"dieAmount":10,"dieType":1,"bonus":0,"formula":"10d1+0"},"AC":"18","armorClass":18,"resistances":"","vulnerabilities":"","immunities":"","damageBonus":0,"toHitBonus":0,"speed":900,"movement":900,"turnActions":1,"actionsPerTurn":1,"actions":[{"name":"Dash","toHit":"None","saveSkill":"None","damage":"0","target":"Self","reach":10,"areaEffect":1,"uses":-1,"condition":{"name":"Dashing","duration":0,"moveMod":1,"damage":0},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Dodge","toHit":"None","saveSkill":"None","damage":"0","target":"Self","reach":10,"areaEffect":1,"uses":-1,"condition":{"name":"Dodging","duration":0,"disadvantageTarget":true,"damage":"0","skipTurn":false},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Help","toHit":"None","saveSkill":"None","damage":"0","target":"Ally","reach":150,"areaEffect":1,"uses":-1,"condition":{"name":"Helped by Clerga","duration":1,"advantageHit":true,"damage":"0","skipTurn":false},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Warhammer","damage":"1d8","damageAbility":"Strength","damageExtra":0,"damageType":"Bludgeoning","toHit":"Strength","toHitExtra":2,"saveSkill":"None","saveDC":0,"target":"Enemy","uses":-1,"onSuccess":false,"reach":150,"areaEffect":1},{"name":"Light Crossbow","damage":"1d8","damageAbility":"Dexterity","damageExtra":0,"damageType":"Piercing","toHit":"Dexterity","toHitExtra":2,"saveSkill":"None","saveDC":0,"target":"Enemy","uses":-1,"onSuccess":false,"reach":2400,"areaEffect":1,"pool":"Loaded Bolts"},{"name":"Load Crossbow","damage":"0","damageAbility":"None","damageExtra":0,"damageType":"","toHit":"None","toHitExtra":0,"saveSkill":"None","saveDC":0,"target":"Self","uses":-1,"onSuccess":false,"reach":10,"areaEffect":1,"condition":{"name":"Recharge","duration":0,"damage":"0","save":"None","saveDC":0,"resistances":"","vulnerabilities":"","immunities":"","additional":"recharge","recharge":"Loaded Bolts, 1"}},{"name":"Spare The Dying","damage":"-1d1","damageAbility":"None","damageExtra":0,"damageType":"","toHit":"None","toHitExtra":0,"saveSkill":"None","saveDC":0,"target":"Ally","uses":-1,"onSuccess":false,"reach":150,"areaEffect":1},{"name":"Sacred Flame","damage":"1d8","damageAbility":"None","damageExtra":0,"damageType":"Radiant","toHit":"None","toHitExtra":0,"saveCancelsDamage":"true","saveSkill":"Dexterity","saveDC":13,"target":"Enemy","uses":-1,"onSuccess":false,"reach":1800,"areaEffect":1},{"name":"Toll The Dead","damage":"1d8","damageAbility":"None","damageExtra":0,"damageType":"Necrotic","toHit":"None","toHitExtra":0,"saveCancelsDamage":"true","saveSkill":"Wisdom","saveDC":13,"target":"Enemy","uses":-1,"onSuccess":false,"reach":1800,"areaEffect":1}, {"name":"Cure Wounds","damage":"-1d8","damageAbility":"Wisdom","damageExtra":0,"damageType":"","toHit":"None","toHitExtra":0,"saveSkill":"None","saveDC":0,"target":"Ally","uses":-1,"onSuccess":false,"reach":300,"areaEffect":1,"pool":"Level 1 spell slots"},{"name":"Command","damage":"0","damageAbility":"None","damageExtra":0,"damageType":"","toHit":"None","toHitExtra":0,"saveSkill":"Wisdom","saveDC":13,"target":"Enemy","uses":-1,"onSuccess":false,"reach":1800,"areaEffect":1,"pool":"Level 1 spell slots","condition":{"name":"Commanded by Clerga","duration":1,"damage":"0","save":"None","saveDC":0,"resistances":"","vulnerabilities":"","immunities":"","additional":"charm","charm":true}},{"name":"Guiding Bolt","damage":"4d6","damageAbility":"None","damageExtra":0,"damageType":"Radiant","toHit":"Wisdom","toHitExtra":2,"saveSkill":"None","saveDC":0,"target":"Enemy","uses":-1,"onSuccess":false,"reach":3600,"areaEffect":1,"pool":"Level 1 spell slots","condition":{"name":"Guided by Clerga","duration":1,"damage":"0","save":"None","saveDC":0,"resistances":"","vulnerabilities":"","immunities":"","additional":"advantageTarget","advantageTarget":true}}],"conditions":[],"pools":{"Loaded Bolts":1,"Level 1 spell slots":2}}]},{"name":"Goblins","color":"#800040","troops":[{"name":"Goblin Archer","stk":{"r":128,"g":0,"b":64,"a":255},"position":{"x":3000,"y":2552},"dimension":{"x":40,"y":40},"htmlName":"<b style=\"color:rgb(128,0,64);\"> Goblin Archer </b>","isPlayer":false,"player":false,"abilityScores":{"Strength":{"score":8,"bonus":-1},"Dexterity":{"score":14,"bonus":2},"Constitution":{"score":10,"bonus":0},"Intelligence":{"score":10,"bonus":0},"Wisdom":{"score":8,"bonus":-1},"Charisma":{"score":8,"bonus":-1}},"initiativeBonus":2,"hitPoints":{"dieAmount":2,"dieType":6,"bonus":0,"formula":"2d6+0"},"AC":13,"armorClass":13,"resistances":"","vulnerabilities":"","immunities":"","damageBonus":0,"toHitBonus":0,"speed":900,"movement":900,"turnActions":1,"actionsPerTurn":1,"actions":[{"name":"Dash","toHit":"None","saveSkill":"None","damage":"0","target":"Self","reach":10,"areaEffect":1,"uses":-1,"condition":{"name":"Dashing","duration":0,"moveMod":1,"damage":0},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Dodge","toHit":"None","saveSkill":"None","damage":"0","target":"Self","reach":10,"areaEffect":1,"uses":-1,"condition":{"name":"Dodging","duration":0,"disadvantageTarget":true,"damage":"0","skipTurn":false},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Help","toHit":"None","saveSkill":"None","damage":"0","target":"Ally","reach":150,"areaEffect":1,"uses":-1,"condition":{"name":"Helped by Goblin Archer","duration":1,"advantageHit":true,"damage":"0","skipTurn":false},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Dagger","damage":"1d4","damageAbility":"Dexterity","damageExtra":0,"damageType":"Slashing","toHit":"Dexterity","toHitExtra":2,"saveSkill":"None","saveDC":0,"target":"Enemy","uses":-1,"onSuccess":false,"reach":150,"areaEffect":1},{"name":"Shortbow","damage":"1d6","damageAbility":"Dexterity","damageExtra":0,"damageType":"Piercing","toHit":"Dexterity","toHitExtra":2,"saveSkill":"None","saveDC":0,"target":"Enemy","uses":-1,"onSuccess":false,"reach":2400,"areaEffect":1,"pool":"Arrows"}],"conditions":[],"pools":{"Arrows":20}},{"name":"Goblin Troop","stk":{"r":128,"g":0,"b":64,"a":255},"position":{"x":3132,"y":2395},"dimension":{"x":40,"y":40},"htmlName":"<b style=\"color:rgb(128,0,64);\"> Goblin Troop </b>","isPlayer":false,"player":false,"abilityScores":{"Strength":{"score":8,"bonus":-1},"Dexterity":{"score":14,"bonus":2},"Constitution":{"score":10,"bonus":0},"Intelligence":{"score":10,"bonus":0},"Wisdom":{"score":8,"bonus":-1},"Charisma":{"score":8,"bonus":-1}},"initiativeBonus":2,"hitPoints":{"dieAmount":2,"dieType":6,"bonus":0,"formula":"2d6+0"},"AC":15,"armorClass":15,"resistances":"","vulnerabilities":"","immunities":"","damageBonus":0,"toHitBonus":0,"speed":900,"movement":900,"turnActions":1,"actionsPerTurn":1,"actions":[{"name":"Dash","toHit":"None","saveSkill":"None","damage":"0","target":"Self","reach":10,"areaEffect":1,"uses":-1,"condition":{"name":"Dashing","duration":0,"moveMod":1,"damage":0},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Dodge","toHit":"None","saveSkill":"None","damage":"0","target":"Self","reach":10,"areaEffect":1,"uses":-1,"condition":{"name":"Dodging","duration":0,"disadvantageTarget":true,"damage":"0","skipTurn":false},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Help","toHit":"None","saveSkill":"None","damage":"0","target":"Ally","reach":150,"areaEffect":1,"uses":-1,"condition":{"name":"Helped by Goblin Troop","duration":1,"advantageHit":true,"damage":"0","skipTurn":false},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Swimitar","damage":"1d6","damageAbility":"Strength","damageExtra":0,"damageType":"Slashing","toHit":"Dexterity","toHitExtra":2,"saveSkill":"None","saveDC":0,"target":"Enemy","uses":-1,"onSuccess":false,"reach":150,"areaEffect":1},{"name":"Poison Vial","damage":"0","damageAbility":"None","damageExtra":0,"damageType":"","toHit":"None","toHitExtra":0,"saveSkill":"None","saveDC":0,"target":"Point","uses":1,"onSuccess":false,"reach":900,"areaEffect":300,"condition":{"name":"Poisoned","duration":5,"damage":"1d6","save":"Constitution","saveDC":12,"resistances":"","vulnerabilities":"","immunities":""}}],"conditions":[],"pools":{}},{"name":"Goblin Boss","stk":{"r":128,"g":0,"b":64,"a":255},"position":{"x":3300,"y":911},"dimension":{"x":50,"y":50},"htmlName":"<b style=\"color:rgb(128,0,64);\"> Goblin Boss </b>","isPlayer":false,"player":false,"abilityScores":{"Strength":{"bonus":0,"score":null},"Dexterity":{"bonus":2,"score":null},"Constitution":{"bonus":0,"score":null},"Intelligence":{"bonus":0,"score":null},"Wisdom":{"bonus":-1,"score":null},"Charisma":{"bonus":0,"score":null}},"initiativeBonus":2,"hitPoints":{"dieAmount":6,"dieType":6,"bonus":0,"formula":"6d6+0"},"AC":17,"armorClass":17,"resistances":"","vulnerabilities":"","immunities":"","damageBonus":0,"toHitBonus":0,"speed":900,"movement":900,"turnActions":1,"actionsPerTurn":1,"actions":[{"name":"Dash","toHit":"None","saveSkill":"None","damage":"0","target":"Self","reach":10,"areaEffect":1,"uses":-1,"condition":{"name":"Dashing","duration":0,"moveMod":1,"damage":0},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Dodge","toHit":"None","saveSkill":"None","damage":"0","target":"Self","reach":10,"areaEffect":1,"uses":-1,"condition":{"name":"Dodging","duration":0,"disadvantageTarget":true,"damage":"0","skipTurn":false},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Help","toHit":"None","saveSkill":"None","damage":"0","target":"Ally","reach":150,"areaEffect":1,"uses":-1,"condition":{"name":"Helped by Goblin Boss","duration":1,"advantageHit":true,"damage":"0","skipTurn":false},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Scimitar","damage":"1d6","damageAbility":"Dexterity","damageExtra":0,"damageType":"Slashing","toHit":"Dexterity","toHitExtra":2,"saveSkill":"None","saveDC":0,"target":"Enemy","uses":-1,"onSuccess":false,"reach":150,"areaEffect":1},{"name":"Javelin","damage":"1d6","damageAbility":"Dexterity","damageExtra":0,"damageType":"Piercing","toHit":"Dexterity","toHitExtra":2,"saveSkill":"None","saveDC":0,"target":"Enemy","uses":-1,"onSuccess":false,"reach":900,"areaEffect":1, "pool" : "Javelins"}],"conditions":[],"pools":{"Javelins" : 5}},{"name":"Goblin Troop","stk":{"r":128,"g":0,"b":64,"a":255},"position":{"x":3296,"y":1212},"dimension":{"x":40,"y":40},"htmlName":"<b style=\"color:rgb(128,0,64);\"> Goblin Troop </b>","isPlayer":false,"player":false,"abilityScores":{"Strength":{"score":8,"bonus":-1},"Dexterity":{"score":14,"bonus":2},"Constitution":{"score":10,"bonus":0},"Intelligence":{"score":10,"bonus":0},"Wisdom":{"score":8,"bonus":-1},"Charisma":{"score":8,"bonus":-1}},"initiativeBonus":2,"hitPoints":{"dieAmount":2,"dieType":6,"bonus":0,"formula":"2d6+0"},"AC":15,"armorClass":15,"resistances":"","vulnerabilities":"","immunities":"","damageBonus":0,"toHitBonus":0,"speed":900,"movement":900,"turnActions":1,"actionsPerTurn":1,"actions":[{"name":"Dash","toHit":"None","saveSkill":"None","damage":"0","target":"Self","reach":10,"areaEffect":1,"uses":-1,"condition":{"name":"Dashing","duration":0,"moveMod":1,"damage":0},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Dodge","toHit":"None","saveSkill":"None","damage":"0","target":"Self","reach":10,"areaEffect":1,"uses":-1,"condition":{"name":"Dodging","duration":0,"disadvantageTarget":true,"damage":"0","skipTurn":false},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Help","toHit":"None","saveSkill":"None","damage":"0","target":"Ally","reach":150,"areaEffect":1,"uses":-1,"condition":{"name":"Helped by Goblin Troop","duration":1,"advantageHit":true,"damage":"0","skipTurn":false},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Swimitar","damage":"1d6","damageAbility":"Strength","damageExtra":0,"damageType":"Slashing","toHit":"Dexterity","toHitExtra":2,"saveSkill":"None","saveDC":0,"target":"Enemy","uses":-1,"onSuccess":false,"reach":150,"areaEffect":1},{"name":"Poison Vial","damage":"0","damageAbility":"None","damageExtra":0,"damageType":"","toHit":"None","toHitExtra":0,"saveSkill":"None","saveDC":0,"target":"Point","uses":1,"onSuccess":false,"reach":900,"areaEffect":300,"condition":{"name":"Poisoned","duration":5,"damage":"1d6","save":"Constitution","saveDC":12,"resistances":"","vulnerabilities":"","immunities":""}}],"conditions":[],"pools":{}},{"name":"Goblin Troop","stk":{"r":128,"g":0,"b":64,"a":255},"position":{"x":3450,"y":1053},"dimension":{"x":40,"y":40},"htmlName":"<b style=\"color:rgb(128,0,64);\"> Goblin Troop </b>","isPlayer":false,"player":false,"abilityScores":{"Strength":{"score":8,"bonus":-1},"Dexterity":{"score":14,"bonus":2},"Constitution":{"score":10,"bonus":0},"Intelligence":{"score":10,"bonus":0},"Wisdom":{"score":8,"bonus":-1},"Charisma":{"score":8,"bonus":-1}},"initiativeBonus":2,"hitPoints":{"dieAmount":2,"dieType":6,"bonus":0,"formula":"2d6+0"},"AC":15,"armorClass":15,"resistances":"","vulnerabilities":"","immunities":"","damageBonus":0,"toHitBonus":0,"speed":900,"movement":900,"turnActions":1,"actionsPerTurn":1,"actions":[{"name":"Dash","toHit":"None","saveSkill":"None","damage":"0","target":"Self","reach":10,"areaEffect":1,"uses":-1,"condition":{"name":"Dashing","duration":0,"moveMod":1,"damage":0},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Dodge","toHit":"None","saveSkill":"None","damage":"0","target":"Self","reach":10,"areaEffect":1,"uses":-1,"condition":{"name":"Dodging","duration":0,"disadvantageTarget":true,"damage":"0","skipTurn":false},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Help","toHit":"None","saveSkill":"None","damage":"0","target":"Ally","reach":150,"areaEffect":1,"uses":-1,"condition":{"name":"Helped by Goblin Troop","duration":1,"advantageHit":true,"damage":"0","skipTurn":false},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Swimitar","damage":"1d6","damageAbility":"Strength","damageExtra":0,"damageType":"Slashing","toHit":"Dexterity","toHitExtra":2,"saveSkill":"None","saveDC":0,"target":"Enemy","uses":-1,"onSuccess":false,"reach":150,"areaEffect":1},{"name":"Poison Vial","damage":"0","damageAbility":"None","damageExtra":0,"damageType":"","toHit":"None","toHitExtra":0,"saveSkill":"None","saveDC":0,"target":"Point","uses":1,"onSuccess":false,"reach":900,"areaEffect":300,"condition":{"name":"Poisoned","duration":5,"damage":"1d6","save":"Constitution","saveDC":12,"resistances":"","vulnerabilities":"","immunities":""}}],"conditions":[],"pools":{}},{"name":"Goblin Archer","stk":{"r":128,"g":0,"b":64,"a":255},"position":{"x":3000,"y":1044},"dimension":{"x":40,"y":40},"htmlName":"<b style=\"color:rgb(128,0,64);\"> Goblin Archer </b>","isPlayer":false,"player":false,"abilityScores":{"Strength":{"score":8,"bonus":-1},"Dexterity":{"score":14,"bonus":2},"Constitution":{"score":10,"bonus":0},"Intelligence":{"score":10,"bonus":0},"Wisdom":{"score":8,"bonus":-1},"Charisma":{"score":8,"bonus":-1}},"initiativeBonus":2,"hitPoints":{"dieAmount":2,"dieType":6,"bonus":0,"formula":"2d6+0"},"AC":13,"armorClass":13,"resistances":"","vulnerabilities":"","immunities":"","damageBonus":0,"toHitBonus":0,"speed":900,"movement":900,"turnActions":1,"actionsPerTurn":1,"actions":[{"name":"Dash","toHit":"None","saveSkill":"None","damage":"0","target":"Self","reach":10,"areaEffect":1,"uses":-1,"condition":{"name":"Dashing","duration":0,"moveMod":1,"damage":0},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Dodge","toHit":"None","saveSkill":"None","damage":"0","target":"Self","reach":10,"areaEffect":1,"uses":-1,"condition":{"name":"Dodging","duration":0,"disadvantageTarget":true,"damage":"0","skipTurn":false},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Help","toHit":"None","saveSkill":"None","damage":"0","target":"Ally","reach":150,"areaEffect":1,"uses":-1,"condition":{"name":"Helped by Goblin Archer","duration":1,"advantageHit":true,"damage":"0","skipTurn":false},"saveDC":null,"damageExtra":null,"toHitExtra":null},{"name":"Dagger","damage":"1d4","damageAbility":"Dexterity","damageExtra":0,"damageType":"Slashing","toHit":"Dexterity","toHitExtra":2,"saveSkill":"None","saveDC":0,"target":"Enemy","uses":-1,"onSuccess":false,"reach":150,"areaEffect":1},{"name":"Shortbow","damage":"1d6","damageAbility":"Dexterity","damageExtra":0,"damageType":"Piercing","toHit":"Dexterity","toHitExtra":2,"saveSkill":"None","saveDC":0,"target":"Enemy","uses":-1,"onSuccess":false,"reach":2400,"areaEffect":1,"pool":"Arrows"}],"conditions":[],"pools":{"Arrows":20}}]}],"name":"Goblins' Cave","mapSize":4800,"description":""}]
        c["Default"].encounters = enc;

        c["Default"].troops = [];
        let t = [];
        c["Default"].troops = t;

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
    static getActiveSources()
    {
        let data = LocalData.getLocalStorage();
        let ret = {};
        for(let key in data)
        {
            if(data[key].isActive)
            {
                ret[key] = {};
                ret[key] = data[key];
            }
        }
        return ret;
    }

    static delete(source, key, id)
    {
        let data = LocalData.getLocalStorage();
        data[source][key].splice(id, 1);
        localStorage.content = JSON.stringify(data);
    }
    static addTroop(source, troop)
    {
        let data = LocalData.getLocalStorage();
        if(data[source] == undefined)
        {
            LocalData.createSource(source);
            data = LocalData.getLocalStorage();
        }
        let flag = false;
        data[source].troops.forEach(t =>
        {
            if(troop.name == t.name)
                flag = true;
        })
        if(flag)
            troop.name = `${troop.name} - Copy`
        data[source].troops.push(troop);
        localStorage.content = JSON.stringify(data);
    }

    static addEncounter(source, encounter)
    {
        let data = LocalData.getLocalStorage();
        if(data[source] == undefined)
        {
            LocalData.createSource(source);
            data = LocalData.getLocalStorage();
        }
        let flag = false;
        data[source].encounters.forEach(e =>
        {
            if(encounter.name == e.name)
                flag = true;
        })
        if(flag)
        {
            encounter.name = `${encounter.name} - Copy`
        }
        data[source].encounters.push(encounter);
        localStorage.content = JSON.stringify(data);
    }

    static getAllTroops()
    {
        let ret = [];
        let data = LocalData.getActiveSources();
        for (let source in data) 
        {
            data[source].troops.forEach(troop =>
            {
                ret.push(troop);
            })
        }
        return ret;
    }
    static getAllEncounters()
    {
        let ret = [];
        let data = LocalData.getActiveSources();
        for (let source in data) 
        {
            data[source].encounters.forEach(encounter =>
            {
                ret.push(encounter);
            })
        }
        return ret;
    }
    
    static exportActiveToJSON()
    {
        let data = LocalData.getActiveSources();
        saveJSON(data, "all-content.json");
    }
    static exportToJSON()
    {
        let data = LocalData.getLocalStorage();
        saveJSON(data, "all-content.json");
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
    static deleteSource(name)
    {
        let data = LocalData.getLocalStorage();
        if(data[name])
        {
            data[name] = undefined;
        }

        localStorage.content = JSON.stringify(data);
    }
    static createSource(name)
    {
        let data = LocalData.getLocalStorage();
        data[name] = {};
        data[name].troops = [];
        data[name].encounters = [];
        
        localStorage.content = JSON.stringify(data);
    }
    static export(source, key)
    {
      let data = LocalData.getLocalStorage();
      let c = data[source][key];
      console.log(JSON.stringify(c) );
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
        if(eventManagement.eventPath(event.target)[0] == document.querySelector('#page_content'))
        {
            return true;
        }
        return false;
    }
}


/**RANDOM GLOBAL STUFF */
function centroid(area)
{
  let vertices = area.shape;
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

/** Turn the rgb value into a Hex value understood by <input type="color" /> */
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

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

/** Is the Vector withing a Shape (Array of objects with a position attribute) ?
 * I can't seem to recall where I found this code. Likely it came from Coding Train Slack with some pimping by yours truly*/
function intersects(vector, shape)
{
    shape[shape.length] = shape[0];
    let wn = 0;
    for(let i = 0; i < shape.length -1; i++)
    {
        let vec1 = createVector(shape[i].x, shape[i].y);
        let vec2 = createVector(shape[i+1].x, shape[i+1].y);
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

function toggleTab(id)
{
    let elt = document.querySelector(`#${id}Tab`)
    if(elt.style.display == "none")
    {
        elt.style.display = "block";
    }
    else
    {
        elt.style.display = "none";
    }
}

function getAffectedTroops(troop, action, otherTroops, flag)
{
    let ret = [];
    if(!flag)
    {
        let mouseMapPos = camera.screenPointToMapPoint(mouseX, mouseY);
        mouseMapPos = createVector(mouseMapPos.x, mouseMapPos.y);
        
        let d = mouseMapPos.dist(createVector(troop.position.x, troop.position.y))
        // The mouse is hovering within Action's reach
        if(d < action.reach + troop.dimension.x )
        {
            for(let i = 0; i < otherTroops.length; i++) 
            {
                let t = otherTroops[i];
                let d = mouseMapPos.dist(createVector(t.position.x, t.position.y));
                // If the troop is within the area of effect
                if(d < action.areaEffect + t.dimension.x)
                {
                    let isAffected = true;
                    switch(action.target)
                    {
                        case "Enemy" :
                            isAffected = (t.isPlayer != troop.isPlayer);
                            break;

                        case "Ally" :
                            isAffected = (t.isPlayer == troop.isPlayer);
                            break;

                        case "Self" :
                            isAffected = (t.position.x == troop.position.x && t.position.y == troop.position.y)
                    }
                    if(t.hasCondition("name", "Unconcious") && action.target !== "Ally")
                    {
                        isAffected = false;
                    }
                    if(isAffected)
                    {
                        ret.push(i);
                    }
                }
            }
        }
    }
    else
    {
        let v = createVector(troop.position.x, troop.position.y);
        console.log(troop);
        for(let i = 0; i < otherTroops.length; i++) 
        {
            let t = otherTroops[i];
            console.log(t);

            let d = v.dist(createVector(t.position.x, t.position.y));
            // If the troop is within the area of effect
            if(d < action.areaEffect + t.dimension.x)
            {
                let isAffected = true;
                switch(action.target)
                {
                    case "Enemy" :
                        isAffected = (t.isPlayer != troop.isPlayer);
                        break;

                    case "Ally" :
                        isAffected = (t.isPlayer == troop.isPlayer);
                        break;

                    case "Self" :
                        isAffected = (t.position.x == troop.position.x && t.position.y == troop.position.y)
                }

                if(isAffected)
                {
                    ret.push(i);
                }
            }
        }
    }
        
    
    return ret;
}


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
