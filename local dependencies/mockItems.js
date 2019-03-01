let mundaneWeapons = [
    {
        "name": "Battleaxe",
        "slots" : "Left Hand, Right Hand, Both Hands, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Battleaxe (Two-Handed)",
                    "uses": "-1",
                    "pool": "Battleaxe",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d10",
                    "damageAbility": "Strength",
                    "damageType": "Slashing",
                    "reach": "150"
                }
            },
            {
                "type": "action",
                "value": {
                    "name": "Battleaxe",
                    "uses": "-1",
                    "pool": "Battleaxe",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d8",
                    "damageAbility": "Strength",
                    "damageType": "Slashing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Battleaxe": 1
                }
            }
        ]
    },
    {
        "name": "Blowgun",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Load Blowgun",
                    "uses": "-1",
                    "pool": "Blowgun Ammunition",
                    "expandsPool": "true",
                    "target": "Self",
                    "areaEffect": "1",
                    "reach": "10",
                    "condition": {
                        "name": "Loading Blowgun",
                        "duration": "0",
                        "recharge": "Loaded Blowgun Ammunition, 1"
                    }
                }
            },
            {
                "type": "action",
                "value": {
                    "name": "Blowgun",
                    "uses": "-1",
                    "pool": "Loaded Blowgun Ammunition",
                    "expandsPool": "true",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1",
                    "damageAbility": "Strength",
                    "damageType": "Piercing",
                    "reach": "750"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Blowgun": 1
                }
            },
            {
                "type": "pool",
                "value": {
                    "Blowgun Ammunition": 10
                }
            },
            {
                "type": "pool",
                "value": {
                    "Loaded Blowgun Ammunition": 1
                }
            }
        ]
    },
    {
        "name": "Club",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Club",
                    "uses": "-1",
                    "pool": "Club",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d4",
                    "damageAbility": "Strength",
                    "damageType": "Bludgeoning",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Club": 1
                }
            }
        ]
    },
    {
        "name": "Dagger",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Dagger (Thrown)",
                    "uses": "-1",
                    "pool": "Dagger",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d4",
                    "damageAbility": "Strength",
                    "damageType": "Piercing",
                    "reach": "750",
                    "expandsPool": "true"
                }
            },
            {
                "type": "action",
                "value": {
                    "name": "Dagger",
                    "uses": "-1",
                    "pool": "Dagger",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d4",
                    "damageAbility": "Strength",
                    "damageType": "Piercing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Dagger": 1
                }
            }
        ]
    },
    {
        "name": "Subtle Dagger",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Dagger (Thrown)",
                    "uses": "-1",
                    "pool": "Dagger",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Dexterity",
                    "damage": "1d4",
                    "damageAbility": "Dexterity",
                    "damageType": "Piercing",
                    "reach": "750",
                    "expandsPool": "true"
                }
            },
            {
                "type": "action",
                "value": {
                    "name": "Dagger",
                    "uses": "-1",
                    "pool": "Dagger",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Dexterity",
                    "damage": "1d4",
                    "damageAbility": "Dexterity",
                    "damageType": "Piercing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Dagger": 1
                }
            }
        ]
    },
    {
        "name": "Dart",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Dart (Thrown)",
                    "uses": "-1",
                    "pool": "Dart",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d4",
                    "damageAbility": "Strength",
                    "damageType": "Piercing",
                    "reach": "600",
                    "expandsPool": "true"
                }
            },
            {
                "type": "action",
                "value": {
                    "name": "Dart",
                    "uses": "-1",
                    "pool": "Dart",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d4",
                    "damageAbility": "Strength",
                    "damageType": "Piercing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Dart": 10
                }
            }
        ]
    },
    {
        "name": "Subtle Dart",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Dart (Thrown)",
                    "uses": "-1",
                    "pool": "Dart",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Dexterity",
                    "damage": "1d4",
                    "damageAbility": "Dexterity",
                    "damageType": "Piercing",
                    "reach": "600",
                    "expandsPool": "true"
                }
            },
            {
                "type": "action",
                "value": {
                    "name": "Dart",
                    "uses": "-1",
                    "pool": "Dart",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Dexterity",
                    "damage": "1d4",
                    "damageAbility": "Dexterity",
                    "damageType": "Piercing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Dart": 10
                }
            }
        ]
    },
    {
        "name": "Flail",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Flail",
                    "uses": "-1",
                    "pool": "Flail",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d8",
                    "damageAbility": "Strength",
                    "damageType": "Bludgeoning",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Flail": 1
                }
            }
        ]
    },
    {
        "name": "Glaive",
        "slots" : "Both Hands, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Glaive (Two-Handed)",
                    "uses": "-1",
                    "pool": "Glaive",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d10",
                    "damageAbility": "Strength",
                    "damageType": "Slashing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Glaive": 1
                }
            }
        ]
    },
    {
        "name": "Greataxe",
        "slots" : "Both Hands, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Greataxe (Two-Handed)",
                    "uses": "-1",
                    "pool": "Greataxe",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d12",
                    "damageAbility": "Strength",
                    "damageType": "Slashing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Greataxe": 1
                }
            }
        ]
    },
    {
        "name": "Greatclub",
        "slots" : "Both Hands, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Greatclub (Two-Handed)",
                    "uses": "-1",
                    "pool": "Greatclub",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d8",
                    "damageAbility": "Strength",
                    "damageType": "Bludgeoning",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Greatclub": 1
                }
            }
        ]
    },
    {
        "name": "Greatsword",
        "slots" : "Both Hands, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Greatsword (Two-Handed)",
                    "uses": "-1",
                    "pool": "Greatsword",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "2d6",
                    "damageAbility": "Strength",
                    "damageType": "Slashing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Greatsword": 1
                }
            }
        ]
    },
    {
        "name": "Halberd",
        "slots" : "Both Hands, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Halberd (Two-Handed)",
                    "uses": "-1",
                    "pool": "Halberd",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d10",
                    "damageAbility": "Strength",
                    "damageType": "Slashing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Halberd": 1
                }
            }
        ]
    },
    {
        "name": "Handaxe",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Handaxe (Thrown)",
                    "uses": "-1",
                    "pool": "Handaxe",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d6",
                    "damageAbility": "Strength",
                    "damageType": "Slashing",
                    "reach": "600",
                    "expandsPool": "true"
                }
            },
            {
                "type": "action",
                "value": {
                    "name": "Handaxe",
                    "uses": "-1",
                    "pool": "Handaxe",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d6",
                    "damageAbility": "Strength",
                    "damageType": "Slashing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Handaxe": 1
                }
            }
        ]
    },
    {
        "name": "Hand Crossbow",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Load Hand Crossbow",
                    "uses": "-1",
                    "pool": "Hand Crossbow Ammunition",
                    "expandsPool": "true",
                    "target": "Self",
                    "areaEffect": "1",
                    "reach": "10",
                    "condition": {
                        "name": "Loading Hand Crossbow",
                        "duration": "0",
                        "recharge": "Loaded Hand Crossbow Ammunition, 1"
                    }
                }
            },
            {
                "type": "action",
                "value": {
                    "name": "Hand Crossbow",
                    "uses": "-1",
                    "pool": "Loaded Hand Crossbow Ammunition",
                    "expandsPool": "true",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Dexterity",
                    "damage": "1d6",
                    "damageAbility": "Dexterity",
                    "damageType": "Piercing",
                    "reach": "900"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Hand Crossbow": 1
                }
            },
            {
                "type": "pool",
                "value": {
                    "Hand Crossbow Ammunition": 10
                }
            },
            {
                "type": "pool",
                "value": {
                    "Loaded Hand Crossbow Ammunition": 1
                }
            }
        ]
    },
    {
        "name": "Heavy Crossbow",
        "slots" : "Both Hands, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Load Heavy Crossbow (Two-Handed)",
                    "uses": "-1",
                    "pool": "Heavy Crossbow Ammunition",
                    "expandsPool": "true",
                    "target": "Self",
                    "areaEffect": "1",
                    "reach": "10",
                    "condition": {
                        "name": "Loading Heavy Crossbow",
                        "duration": "0",
                        "recharge": "Loaded Heavy Crossbow Ammunition, 1"
                    }
                }
            },
            {
                "type": "action",
                "value": {
                    "name": "Heavy Crossbow (Two-Handed)",
                    "uses": "-1",
                    "pool": "Loaded Heavy Crossbow Ammunition",
                    "expandsPool": "true",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Dexterity",
                    "damage": "1d10",
                    "damageAbility": "Dexterity",
                    "damageType": "Piercing",
                    "reach": "3000"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Heavy Crossbow": 1
                }
            },
            {
                "type": "pool",
                "value": {
                    "Heavy Crossbow Ammunition": 10
                }
            },
            {
                "type": "pool",
                "value": {
                    "Loaded Heavy Crossbow Ammunition": 1
                }
            }
        ]
    },
    {
        "name": "Javelin",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Javelin (Thrown)",
                    "uses": "-1",
                    "pool": "Javelins",
                    "expandsPool": "true",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d6",
                    "damageAbility": "Strength",
                    "damageType": "Piercing",
                    "reach": "900",
                    "expandsPool": "true"
                }
            },
            {
                "type": "action",
                "value": {
                    "name": "Javelin",
                    "uses": "-1",
                    "pool": "Javelins",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d6",
                    "damageAbility": "Strength",
                    "damageType": "Piercing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Javelins": 5
                }
            }
        ]
    },
    {
        "name": "Lance",
        "slots" : "Both Hands, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Lance (Two-Handed)",
                    "uses": "-1",
                    "pool": "Lance",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d12",
                    "damageAbility": "Strength",
                    "damageType": "Piercing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Lance": 1
                }
            }
        ]
    },
    {
        "name": "Light Crossbow",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Load Light Crossbow",
                    "uses": "-1",
                    "pool": "Light Crossbow Ammunition",
                    "expandsPool": "true",
                    "target": "Self",
                    "areaEffect": "1",
                    "reach": "10",
                    "condition": {
                        "name": "Loading Light Crossbow",
                        "duration": "0",
                        "recharge": "Loaded Light Crossbow Ammunition, 1"
                    }
                }
            },
            {
                "type": "action",
                "value": {
                    "name": "Light Crossbow",
                    "uses": "-1",
                    "pool": "Loaded Light Crossbow Ammunition",
                    "expandsPool" : "true",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Dexterity",
                    "damage": "1d8",
                    "damageAbility": "Dexterity",
                    "damageType": "Piercing",
                    "reach": "2400"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Light Crossbow": 1
                }
            },
            {
                "type": "pool",
                "value": {
                    "Light Crossbow Ammunition": 10
                }
            },
            {
                "type": "pool",
                "value": {
                    "Loaded Light Crossbow Ammunition": 1
                }
            }
        ]
    },
    {
        "name": "Light Hammer",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Light Hammer (Thrown)",
                    "uses": "-1",
                    "pool": "Light Hammer",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d4",
                    "damageAbility": "Strength",
                    "damageType": "Bludgeoning",
                    "reach": "600",
                    "expandsPool": "true"
                }
            },
            {
                "type": "action",
                "value": {
                    "name": "Light Hammer",
                    "uses": "-1",
                    "pool": "Light Hammer",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d4",
                    "damageAbility": "Strength",
                    "damageType": "Bludgeoning",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Light Hammer": 1
                }
            }
        ]
    },
    {
        "name": "Longbow",
        "slots" : "Both Hands, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Longbow (Two-Handed)",
                    "uses": "-1",
                    "pool": "Longbow Ammunition",
                    "expandsPool": "true",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Dexterity",
                    "damage": "1d8",
                    "damageAbility": "Dexterity",
                    "damageType": "Piercing",
                    "reach": "4500"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Longbow": 1
                }
            },
            {
                "type": "pool",
                "value": {
                    "Longbow Ammunition": 10
                }
            }
        ]
    },
    {
        "name": "Longsword",
        "slots" : "Left Hand, Right Hand, Both Hands, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Longsword (Two-Handed)",
                    "uses": "-1",
                    "pool": "Longsword",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d10",
                    "damageAbility": "Strength",
                    "damageType": "Slashing",
                    "reach": "150"
                }
            },
            {
                "type": "action",
                "value": {
                    "name": "Longsword",
                    "uses": "-1",
                    "pool": "Longsword",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d8",
                    "damageAbility": "Strength",
                    "damageType": "Slashing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Longsword": 1
                }
            }
        ]
    },
    {
        "name": "Mace",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Mace",
                    "uses": "-1",
                    "pool": "Mace",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d6",
                    "damageAbility": "Strength",
                    "damageType": "Bludgeoning",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Mace": 1
                }
            }
        ]
    },
    {
        "name": "Maul",
        "slots" : "Both Hands, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Maul (Two-Handed)",
                    "uses": "-1",
                    "pool": "Maul",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "2d6",
                    "damageAbility": "Strength",
                    "damageType": "Bludgeoning",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Maul": 1
                }
            }
        ]
    },
    {
        "name": "Morningstar",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Morningstar",
                    "uses": "-1",
                    "pool": "Morningstar",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d8",
                    "damageAbility": "Strength",
                    "damageType": "Piercing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Morningstar": 1
                }
            }
        ]
    },
    {
        "name": "Net",
        "slots" : "Both Hands, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Net (Thrown)(Two-Handed)",
                    "uses": "-1",
                    "pool": "Net",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damageAbility": "Strength",
                    "reach": "450",
                    "expandsPool": "true"
                }
            },
            {
                "type": "action",
                "value": {
                    "name": "Net (Two-Handed)",
                    "uses": "-1",
                    "pool": "Net",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damageAbility": "Strength",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Net": 1
                }
            }
        ]
    },
    {
        "name": "Pike",
        "slots" : "Both Hands, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Pike (Two-Handed)",
                    "uses": "-1",
                    "pool": "Pike",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d10",
                    "damageAbility": "Strength",
                    "damageType": "Piercing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Pike": 1
                }
            }
        ]
    },
    {
        "name": "Quarterstaff",
        "slots" : "Left Hand, Right Hand, Both Hands, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Quarterstaff (Two-Handed)",
                    "uses": "-1",
                    "pool": "Quarterstaff",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d8",
                    "damageAbility": "Strength",
                    "damageType": "Bludgeoning",
                    "reach": "150"
                }
            },
            {
                "type": "action",
                "value": {
                    "name": "Quarterstaff",
                    "uses": "-1",
                    "pool": "Quarterstaff",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d6",
                    "damageAbility": "Strength",
                    "damageType": "Bludgeoning",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Quarterstaff": 1
                }
            }
        ]
    },
    {
        "name": "Rapier",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Rapier",
                    "uses": "-1",
                    "pool": "Rapier",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d8",
                    "damageAbility": "Strength",
                    "damageType": "Piercing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Rapier": 1
                }
            }
        ]
    },
    {
        "name": "Subtle Rapier",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Rapier",
                    "uses": "-1",
                    "pool": "Rapier",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Dexterity",
                    "damage": "1d8",
                    "damageAbility": "Dexterity",
                    "damageType": "Piercing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Rapier": 1
                }
            }
        ]
    },
    {
        "name": "Scimitar",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Scimitar",
                    "uses": "-1",
                    "pool": "Scimitar",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d6",
                    "damageAbility": "Strength",
                    "damageType": "Slashing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Scimitar": 1
                }
            }
        ]
    },
    {
        "name": "Subtle Scimitar",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Scimitar",
                    "uses": "-1",
                    "pool": "Scimitar",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Dexterity",
                    "damage": "1d6",
                    "damageAbility": "Dexterity",
                    "damageType": "Slashing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Scimitar": 1
                }
            }
        ]
    },
    {
        "name": "Shortbow",
        "slots" : "Both Hands, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Shortbow (Two-Handed)",
                    "uses": "-1",
                    "pool": "Shortbow Ammunition",
                    "expandsPool": "true",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Dexterity",
                    "damage": "1d6",
                    "damageAbility": "Dexterity",
                    "damageType": "Piercing",
                    "reach": "2400"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Shortbow": 1
                }
            },
            {
                "type": "pool",
                "value": {
                    "Shortbow Ammunition": 10
                }
            }
        ]
    },
    {
        "name": "Shortsword",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Shortsword",
                    "uses": "-1",
                    "pool": "Shortsword",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d6",
                    "damageAbility": "Strength",
                    "damageType": "Piercing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Shortsword": 1
                }
            }
        ]
    },
    {
        "name": "Subtle Shortsword",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Shortsword",
                    "uses": "-1",
                    "pool": "Shortsword",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Dexterity",
                    "damage": "1d6",
                    "damageAbility": "Dexterity",
                    "damageType": "Piercing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Shortsword": 1
                }
            }
        ]
    },
    {
        "name": "Sickle",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Sickle",
                    "uses": "-1",
                    "pool": "Sickle",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d4",
                    "damageAbility": "Strength",
                    "damageType": "Slashing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Sickle": 1
                }
            }
        ]
    },
    {
        "name": "Sling",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Sling",
                    "uses": "-1",
                    "pool": "Sling Ammunition",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d4",
                    "damageAbility": "Strength",
                    "damageType": "Bludgeoning",
                    "reach": "900"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Sling": 1
                }
            },
            {
                "type": "pool",
                "value": {
                    "Sling Ammunition": 10
                }
            }
        ]
    },
    {
        "name": "Spear",
        "slots" : "Left Hand, Right Hand, Both Hands, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Spear (Thrown)",
                    "uses": "-1",
                    "pool": "Spear",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d6",
                    "damageAbility": "Strength",
                    "damageType": "Piercing",
                    "reach": "600",
                    "expandsPool": "true"
                }
            },
            {
                "type": "action",
                "value": {
                    "name": "Spear (Two-Handed)",
                    "uses": "-1",
                    "pool": "Spear",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d8",
                    "damageAbility": "Strength",
                    "damageType": "Piercing",
                    "reach": "150"
                }
            },
            {
                "type": "action",
                "value": {
                    "name": "Spear",
                    "uses": "-1",
                    "pool": "Spear",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d6",
                    "damageAbility": "Strength",
                    "damageType": "Piercing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Spear": 1
                }
            }
        ]
    },
    {
        "name": "Trident",
        "slots" : "Left Hand, Right Hand, Both Hands, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Trident (Thrown)",
                    "uses": "-1",
                    "pool": "Trident",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d6",
                    "damageAbility": "Strength",
                    "damageType": "Piercing",
                    "reach": "600",
                    "expandsPool": "true"
                }
            },
            {
                "type": "action",
                "value": {
                    "name": "Trident (Two-Handed)",
                    "uses": "-1",
                    "pool": "Trident",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d8",
                    "damageAbility": "Strength",
                    "damageType": "Piercing",
                    "reach": "150"
                }
            },
            {
                "type": "action",
                "value": {
                    "name": "Trident",
                    "uses": "-1",
                    "pool": "Trident",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d6",
                    "damageAbility": "Strength",
                    "damageType": "Piercing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Trident": 1
                }
            }
        ]
    },
    {
        "name": "War Pick",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "War Pick",
                    "uses": "-1",
                    "pool": "War Pick",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d8",
                    "damageAbility": "Strength",
                    "damageType": "Piercing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "War Pick": 1
                }
            }
        ]
    },
    {
        "name": "Warhammer",
        "slots" : "Left Hand, Right Hand, Both Hands, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Warhammer (Two-Handed)",
                    "uses": "-1",
                    "pool": "Warhammer",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d10",
                    "damageAbility": "Strength",
                    "damageType": "Bludgeoning",
                    "reach": "150"
                }
            },
            {
                "type": "action",
                "value": {
                    "name": "Warhammer",
                    "uses": "-1",
                    "pool": "Warhammer",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d8",
                    "damageAbility": "Strength",
                    "damageType": "Bludgeoning",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Warhammer": 1
                }
            }
        ]
    },
    {
        "name": "Whip",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Whip",
                    "uses": "-1",
                    "pool": "Whip",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d4",
                    "damageAbility": "Strength",
                    "damageType": "Slashing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Whip": 1
                }
            }
        ]
    },
    {
        "name": "Subtle Whip",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Whip",
                    "uses": "-1",
                    "pool": "Whip",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Dexterity",
                    "damage": "1d4",
                    "damageAbility": "Dexterity",
                    "damageType": "Slashing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Whip": 1
                }
            }
        ]
    },
    {
        "name": "Yklwa",
        "slots" : "Left Hand, Right Hand, ",
        "modifiers": [
            {
                "type": "action",
                "value": {
                    "name": "Yklwa (Thrown)",
                    "uses": "-1",
                    "pool": "Yklwa",
                    "expandsPool": "true",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d8",
                    "damageAbility": "Strength",
                    "damageType": "Piercing",
                    "reach": "300",
                    "expandsPool": "true"
                }
            },
            {
                "type": "action",
                "value": {
                    "name": "Yklwa",
                    "uses": "-1",
                    "pool": "Yklwa",
                    "target": "Enemy",
                    "areaEffect": "1",
                    "toHit": "Strength",
                    "damage": "1d8",
                    "damageAbility": "Strength",
                    "damageType": "Piercing",
                    "reach": "150"
                }
            },
            {
                "type": "pool",
                "value": {
                    "Yklwa": 5
                }
            }
        ]
    }
]