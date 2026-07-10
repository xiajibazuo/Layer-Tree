//i d k y do i fill 棍母




addLayer("L", {
    name: "层级", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "L", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		layerPoint: new Decimal(0)
    }},
    color: "#7FAFFF",
    requires(){
        if (hasUpgrade("P",91)) return new Decimal(0.5)
        return new Decimal(1)
        }, // Can be a function that takes requirement increases into account
    resource: "层级", // Name of prestige currency
    baseResource: "层级点数", // Name of resource prestige is based on
    baseAmount() {return player.L.layerPoint}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    base(){
    return new Decimal(2)
    },
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        return new Decimal(1)
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },    
    autoPrestige(){
        return hasMilestone('L',1) && !hasMilestone('L',3)
    },    
    row: 9, // Row the layer is in on the tree (0 is the first row)
    resetsNothing(){return hasMilestone("L",7)},

    update(diff){
    player.L.layerPoint=getBuyableAmount("L",11).add(getBuyableAmount("L",12)).add(getBuyableAmount("L", 13))
   /* if (player.L.points.gte(3)) {
         player.L.points = new Decimal(3)
         }*/
    },
        milestones: {
        1: {
            requirementDescription: "0层级",
            effectDescription: "自动购买层级，每一个层级都会解锁一个层级，上限为5个层级",     //别忘了改!!!!!!!!!!!!!!!!!!!!!!!
            done() { return player.L.points.gte(0) }
        },
        2: {
            requirementDescription: "0层级点数",
            effectDescription: "自动购买层级点数",
            done() { return player.L.layerPoint.gte(0) }
        },
        3: {
            requirementDescription: "1层级",
            effectDescription: "第一个里程碑的第一个效果没有作用",
            done() { return player.L.points.gte(1) }
        },
        4: {
            requirementDescription: "1层级点数",
            effectDescription: "第二个里程碑没有作用",
            done() { return player.L.layerPoint.gte(1) }
        },
        5: {
            requirementDescription: "2层级",
            effectDescription(){ 
                return "基于层级点数增益点数<br>公式：10^层级点数<br>效果：" + format(new Decimal(10).pow(player.L.layerPoint))
            },
            done() { return player.L.points.gte(2) }
        },
        6: {
            requirementDescription: "3层级",
            effectDescription: "声望点数重置时保留L层级",
            done() { return player.L.points.gte(3) }
        },
        7: {
            requirementDescription: "4层级",
            effectDescription: "层级不重置任何东西",
            done() { return player.L.points.gte(4)}
        }
    },
    buyables: {

    11: {
        title: "点数",
        display() {
            if(getBuyableAmount("L",11).eq(0)) return "价格：5点数<br>数量：0"
            else return "价格：" + format(new Decimal("10").pow(new Decimal("10").pow(getBuyableAmount("L",11)))) + "点数<br>数量：" +format(getBuyableAmount("L",11))
        },
        unlocked() { return true },
        canAfford() { 
            if(getBuyableAmount("L",11).eq(0)) return player.points.gte(5)
            else return player.points.gte(new Decimal("10").pow(new Decimal("10").pow(getBuyableAmount("L",11)))) 
        },
        buy() { 
            if(getBuyableAmount("L",11).eq(0)) player.points = player.points.minus(5)
            else {player.points = player.points.minus(new Decimal("10").pow(new Decimal("10").pow(getBuyableAmount("L",11))))}
            setBuyableAmount("L", 11, getBuyableAmount("L", 11).add(1))
        },
        style(){
            if (player.points.gte(new Decimal("10").pow(new Decimal("10").pow(getBuyableAmount("L",11))))) return {'height':'100px','width':'200px',"background-color": "#FF0000"}
            else return {'height':'100px','width':'200px',"background-color": "#BF8F8F"}
        }
    },
    12: {
        title: "层级点数",
        display() {
           return "价格：达到" + format(new Decimal("3").pow(getBuyableAmount("L", 12))) + "层级点数<br>数量：" +format(getBuyableAmount("L",12))
        },
        unlocked() { return true },
        canAfford() { 
            return player.L.layerPoint.gte(new Decimal("3").pow(getBuyableAmount("L", 12)))
        },
        buy() {
            setBuyableAmount("L", 12, getBuyableAmount("L", 12).add(1))
        },
        style: {'height':'100px','width':'200px'}
    },
    13: {
        title: "声望点数",
        cost(x){
            if(x.gte(7))return new Decimal("10").pow(x.pow(x.times(0.02).add(2)).times(0.5).add(x.pow(x.times(0.02).add(1)).times(1.5).add(1)))
            return new Decimal("10").pow(x.pow(2).times(0.5).add(x.times(1.5).add(1)))},
        display() {
           return "价格：" + format(this.cost()) + "声望点数<br>数量：" +format(getBuyableAmount("L",13))
        },
        unlocked() { return hasUpgrade("P",12) },
        canAfford() { 
            return player.P.points.gte(this.cost())
        },
        buy() {
            player.P.points=player.P.points.minus(this.cost())
            setBuyableAmount("L", 13, getBuyableAmount("L", 13).add(1))
        },
        style(){
            if (player.P.points.gte(this.cost())) return {'height':'100px','width':'200px',"background-color": "#48DC13"}
            else return {'height':'100px','width':'200px',"background-color": "#BF8F8F"}
        }
    }
},
    clickables: {
    11: {
        display() {return "*1.1"},
        onClick(){
            player.devSpeed = player.devSpeed.times(1.1)
        },
        canClick(){
            return true
        }
    },
    12: {
        display() {return "/1.1"},
        onClick(){
            player.devSpeed = player.devSpeed.div(1.1)
        },
        canClick(){
            return true
        }
    },
    13: {
        display() {return "=1"},
        onClick(){
            player.devSpeed = new Decimal(1)
        },
        canClick(){
            return true
        }
    }
    },
    tabFormat: {
    "里程碑": {
        content: [
        "main-display",
          "blank",
        ["prestige-button",function(){return ""}],
        "blank",
        "resource-display",
        "blank",
        "blank",
        "milestones"]
        
    },
    "层级点数": {
        content: [
        "main-display",
          "blank",
        ["prestige-button",function(){return ""}],
        "blank",
        "resource-display",
        "blank",
        "blank",
        ["display-text",function(){
          let s=""
          s+="可购买用于购买层级点数<br>"
          return s
        }],
        "buyables"]
    },
    "调试": {
        content: [
        "main-display",
          "blank",
        ["prestige-button",function(){return ""}],
        "blank",
        "resource-display",
        "blank",
        "blank",
        ["display-text",function(){
          let s=""
          s+="(不要滥用)调试全局速率<br>全局速率：" + format(player.devSpeed)
          return s
        }],
        "clickables",
        ["display-text",function(){
          let s=""
          s+="<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>test:" + (player.test ? "<br><h1>!</h1>" : "<br><h1>?</h1>") + "<br>这只是用于测试的,不要介意("
          return s
        }]]
    }
},
    automateStuff(){
        if(hasMilestone("L",2) && !hasMilestone('L',4)){
            if(canBuyBuyable("L",11))buyBuyable("L",11)
            if(canBuyBuyable("L",12))buyBuyable("L",12)
            if(canBuyBuyable("L",13))buyBuyable("L",13)
        }
    },
    doReset(resettingLayer) {
        let keep = [];
        
        if (resettingLayer=="L") {
        keep.push("points")
        keep.push("milestones")
        }
        if ((resettingLayer == "ED" && getClickableState("ED",91) == 1 ) || resettingLayer == "L" ) {layerDataReset(this.layer, keep)}
    },
    layerShown(){return player.L.points.gte(1)}
})
addLayer("ED", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0)             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#808080",                       // The color for this layer, which affects many elements.
    resource: "结束",            // The name of this layer's main prestige resource.
    row: 11,                                 // The row this layer is on (0 is the first row).

    baseResource: "点数",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(0),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).
    base(){
    return new Decimal(1)
    },
    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    branches: ["L"],
    
    clickables: {
    11: {
        title: "重置点数层",
        display() {
            if (getClickableState("ED",12) == 1) return "是"
            else return "否"
            },
        onClick(){
            if (getClickableState("ED",12) == 0) setClickableState("ED",12,1)
            else setClickableState("ED",12,0)
        },
        canClick(){
            return true
        },
        style: {"background-color": "#FF0000"}
    },
    21: {
        title: "重置声望层",
        display() {
            if (getClickableState("ED",21) == 1) return "是"
            else return "否"
            },
        onClick(){
            if (getClickableState("ED",21) == 0) setClickableState("ED",21,1)
            else setClickableState("ED",21,0)
        },
        canClick(){
            return true
        },
        style: {"background-color": "#48DC13"}
    },
    22: {
        title: "重置快速层",
        display() {
            if (getClickableState("ED",22) == 1) return "是"
            else return "否"
            },
        onClick(){
            if (getClickableState("ED",22) == 0) setClickableState("ED",22,1)
            else setClickableState("ED",22,0)
        },
        canClick(){
            return true
        },
        style: {"background-color": "#FF7F00"},
        unlocked(){return player.test}
    },
    91: {
        title: "重置层级",
        display() {
            if (getClickableState("ED",91) == 1) return "是"
            else return "否"
            },
        onClick(){
            if (getClickableState("ED",91) == 0) setClickableState("ED",91,1)
            else setClickableState("ED",91,0)
        },
        canClick(){
            return true
        },
        style: {"background-color": "#7FAFFF"}
    }
    },
    tabFormat: {
    "说明": {
        content: [
        "main-display",
          "blank",
        ["prestige-button",function(){return ""}],
        "blank",
        "blank",
        ["display-text",function(){
          let s=""
          s+="选择结束是否重置以下层级<br>"
          return s
        }],
        "clickables"]
    }
},
    layerShown() { return player.L.points.gte(4)}          // Returns a bool for if this layer's node should be visible in the tree.
    //别忘了改!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
})
addLayer("p", {
    name: "点数", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        best: new Decimal(0),
        best2: new Decimal(0)
    }},

    color: "#FF0000",                       // The color for this layer, which affects many elements.
    resource: "点数",            // The name of this layer's main prestige resource.
    row: 0,                                 // The row this layer is on (0 is the first row).
    symbol: "p", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal("10^^1.78e308"),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "none",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    layerShown() { return player.L.points.gte(2)},          // Returns a bool for if this layer's node should be visible in the tree.
    branches: ["L"],
    update(diff){
        player.p.points = player.points
        if (player.points.gte(player.p.best)){player.p.best = player.points}
    },
    
    upgrades: {
        11: {
            title: "1",
            description(){
                if(hasUpgrade("p",13)){
                    if(hasUpgrade("P",13) && !inChallenge("P",22)){
                        return "增益点数<br>效果：*1e10"
                    }
                    return "增益点数<br>效果：*7"
                }
                return "增益点数<br>效果：*4"
            },
            unlocked(){return true},
            cost: new Decimal(300)
        },
        12: {
            title: "2",
            description(){
                return "点数增益自己<br>效果：*" + format(player.points.max(player.p.best2).add(1).log(2.718281828).add(1))
            },
            tooltip: "公式：*(ln(点数+1)+1)",
            unlocked(){return hasUpgrade("p",11)},
            cost: new Decimal(1200)
        },
        13: {
            title: "3",
            description(){
                if(hasUpgrade("P",13) && !inChallenge("P",22)){
                    return "升级1的效果更好(*4→*1e10)"
                }
                return "升级1的效果更好(*4→*7)"
            },
            unlocked(){return hasUpgrade("p",12)},
            cost: new Decimal(24000)
        },
        14: {
            title: "4",
            description(){
                return "点数增益自己<br>效果：*" + format(player.points.max(player.p.best2).pow(0.25).add(1))
            },
            tooltip: "公式：*(点数^0.25+1)",
            unlocked(){return hasUpgrade("p",13)},
            cost: new Decimal(40000)
        },
        15: {
            title: "5",
            description(){
                return "点数增益自己<br>效果：*" + format(player.points.max(player.p.best2).pow(0.25).add(1))
            },
            tooltip: "公式：*(点数^0.25+1)",
            unlocked(){return hasUpgrade("p",14)},
            cost: new Decimal(1000000)
        },
        21: {
            title: "6",
            description(){
                return "增益点数<br>效果：^1.5"
            },
            unlocked(){return hasChallenge("P",23)},
            cost(){
                if (false) return new Decimal("eeeeeeeeee114514")
                return new Decimal("0")
            }
        },
        22: {
            title: "7",
            description(){
                return "增益点数<br>效果：^1.5"
            },
            unlocked(){return hasUpgrade("p",21)},
            cost(){
                if (false) return new Decimal("eeeeeeeeee114514")
                return new Decimal("0")
            }
        },
        23: {
            title: "8",
            description(){
                return "增益点数<br>效果：^1.5"
            },
            unlocked(){return hasUpgrade("p",22)},
            cost(){
                if (false) return new Decimal("eeeeeeeeee114514")
                return new Decimal("0")
            }
        },
        24: {
            title: "9",
            description(){
                return "增益点数<br>效果：^1.5"
            },
            unlocked(){return hasUpgrade("p",23)},
            cost(){
                if (false) return new Decimal("eeeeeeeeee114514")
                return new Decimal("0")
            }
        },
        25: {
            title: "10",
            description(){
                return "增益点数<br>效果：^1.5"
            },
            unlocked(){return hasUpgrade("p",24)},
            cost(){
                if (false) return new Decimal("eeeeeeeeee114514")
                return new Decimal("0")
            }
        }
    },
    challenges: {
        11: {
            name: "C1",
            challengeDescription: "点数/1e20(没那么难,指数前面)",
            canComplete: function() {return player.points.gte(100)},
            goalDescription: "100点数",
            rewardDescription: "点数*1e20(没那么好,指数前面)",
            unlocked(){return true},
            onEnter(){
                player.points = new Decimal(0)
            }
        },
        12: {
            name: "C2",
            challengeDescription: "点数需要主动获取",
            canComplete: function() {return player.points.gte(100000)},
            goalDescription: "100000点数",
            rewardDescription: "升级2,4,5可以基于点数最大值(声望重置保留)",
            unlocked(){return hasChallenge("p",11)},
            onEnter(){
                player.points = new Decimal(0)
            }
        },
        13: {
            name: "C3",
            challengeDescription(){return "凑数挑战"},
            canComplete: function() {return player.points.gte(1e6)},
            goalDescription: "1000000点数",
            rewardDescription: "可以完成PC4",
            unlocked(){return hasChallenge("p",12)},
            onEnter(){
                player.points = new Decimal(0)
            }
        }
    },
    clickables: {
    11: {
        display(){
            if(hasChallenge("p",12))return "升级2,4,5的效果基于现在点数最大值<br>目前升级基于" + format(player.p.best2) + "点数<br>当前最大值：" + format(player.p.best)
            else return "主动获取点数"
        },
        unlocked(){return(inChallenge("p",12) || hasChallenge("p",12))},
        onClick(){
            if(hasChallenge("p",12)){
                if(player.p.best.gt(player.p.best2)) player.p.best2 = player.p.best
            }
            else player.points =player.points.add(player.preGetPointGen)
        },
        canClick(){
            return true
        },
        tooltip: "可点击而不可长按焉<br>(《爱莲说》这一块)"
    }
    },
    tabFormat: {
    "升级": {
        content: [
        "main-display",
          "blank",
        "clickables",
        "blank",
        "blank",
        ["display-text",function(){
          let s=""
          s+="升级不消耗点数(才不是因为不会写代码呢)<br>"
          return s
        }],
        "blank",
        "upgrades"]
    },
    "挑战": {
        unlocked(){return (inChallenge("P",21) || hasChallenge("P",21))},
        content: [
        "main-display",
          "blank",
        "clickables",
        "blank",
        "blank",
        "challenges"]
    }
    },
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("P",1) && resettingLayer == "P") keep.push("upgrades")
        if (hasChallenge("P",21) && resettingLayer == "P") keep.push("challenges")
        if (hasChallenge("p",12) && resettingLayer == "P") keep.push("best2")
        
        if ((resettingLayer == "ED" && getClickableState("ED",11) == 1 ) || resettingLayer == "L" || resettingLayer == "P") {layerDataReset(this.layer, keep)}
    }
})
addLayer("P", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        total: new Decimal(0),
        total2: new Decimal(0)
    }},

    color: "#4BDC13",                       // The color for this layer, which affects many elements.
    resource: "声望点数",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order

    baseResource: "点数",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1e14),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.2,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return player.L.points.gte(3) },          // Returns a bool for if this layer's node should be visible in the tree.
    branches: ["L","p"],
    tooltipLocked: "达到1e14点数解锁层级(关于层级要二次解锁这件事)",
    update(diff){
        if (player.P.total.gte(player.P.total2)){player.P.total2 = player.P.total}
    },
    
    milestones: {
        1: {
            requirementDescription: "10总声望点数",
            effectDescription: "重置时保留p层级升级",
            done() { return player.P.total.gte(10) }
        }
    },
    upgrades: {
        11: {
            title: "P1",
            description(){
                return "声望点数增益点数<br>效果：*" + format(player.P.points.times(player.P.points.add(1).log(2.718281828)).add(1))
            },
            tooltip: "公式：*(声望点数*ln(声望点数+1)+1)",
            cost: new Decimal(1)
        },
        12: {
            title: "P2",
            description(){
                return "解锁声望点数的层级可购买"
            },
            unlocked(){return hasUpgrade("P",11)},
            cost: new Decimal(10)
        },
        13: {
            title: "P3",
            description(){
                return "升级3的效果更好(*7→*1e10)"
            },
            unlocked(){return hasUpgrade("P",12)},
            cost: new Decimal(100)
        },
        14: {
            title: "P4",
            description(){
                return "点数*1000"
            },
            unlocked(){return hasChallenge("P",13)},
            cost: new Decimal(1e17)
        },
        15: {
            title: "P5",
            description(){
                return "解锁一个声望挑战"
            },
            unlocked(){return hasUpgrade("P",14)},
            cost: new Decimal(1e19)
        },
        91: {
            title: "点不到的升级",
            description(){
                if (hasUpgrade("P",91)) return "层级更便宜"
                return "棍母"
            },
            canAfford(){return player.P.total.lte(0)},
            pay(){},
            cost: new Decimal(0)
        }
    },
    challenges: {
        11: {
            name: "PC1",
            challengeDescription: "重置点数升级,同时点数^0.15",
            canComplete: function() {return player.points.gte(1e7)},
            goalDescription: "10000000点数",
            rewardDescription: "点数*1000",
            unlocked(){return true},
            onEnter(){
                layerDataReset("p",[])
            }
        },
        12: {
            name: "PC2",
            challengeDescription: "升级4,5没有作用",
            canComplete: function() {return player.points.gte(1e38)},
            goalDescription: "1e38点数",
            rewardDescription: "点数*1000",
            unlocked(){return hasChallenge("P",11)}
        },
        13: {
            name: "PC3",
            challengeDescription(){return "重置点数升级,同时点数削弱自己(公式：/((点数^0.5+1)*1e30))<br>效果：/" + format(player.points.pow(0.3).add(1).times(1e30))},
            canComplete: function() {return player.points.gte(1e20)},
            goalDescription: "1e20点数",
            rewardDescription: "解锁更多声望升级",
            unlocked(){return hasChallenge("P",12)},
            onEnter(){
                layerDataReset("p",[])
            }
        },
        21: {
            name: "PC4",
            challengeDescription: "重置点数升级,同时点数^0.05,解锁点数挑战",
            canComplete: function() {return hasChallenge("p",13)},
            goalDescription: "???",
            rewardDescription: "重置时保留点数挑战",
            unlocked(){return hasUpgrade("P",15)},
            onEnter(){
                layerDataReset("p",[])
            }
        },
        22: {
            name: "PC5",
            challengeDescription: "声望升级没有效果,同时点数/1e114(好臭的削弱)",
            canComplete: function() {return player.points.gte(1e20)},
            goalDescription: "1e20点数",
            rewardDescription: "点数^ee45e4",
            unlocked(){return hasChallenge("P",21)}
        },
        23: {
            name: "PC6",
            challengeDescription: "点数获取开ee45e4次根",
            canComplete: function() {return player.points.gte(100)},
            goalDescription: "ee45e4点数",
            rewardDescription: "解锁更多点数升级",
            unlocked(){return hasChallenge("P",22)}
        }
    },
    tabFormat: {
    "里程碑": {
        content: [
        "main-display",
          "blank",
        ["prestige-button",function(){return ""}],
        "blank",
        "resource-display",
        "blank",
        "blank",
        "milestones"]
    },
    "升级": {
        content: [
        "main-display",
          "blank",
        ["prestige-button",function(){return ""}],
        "blank",
        "resource-display",
        "blank",
        "blank",
        "upgrades"]
    },
    "挑战": {
        unlocked(){return hasMilestone("f",0)},
        content: [
        "main-display",
          "blank",
        ["prestige-button",function(){return ""}],
        "blank",
        "resource-display",
        "blank",
        "blank",
        "challenges"]
    }
    },
    doReset(resettingLayer) {
        let keep = [];
        if (resettingLayer !== "ED") keep.push("total2")
        
        if ((resettingLayer == "ED" && getClickableState("ED",21) == 1 ) || resettingLayer == "L") {layerDataReset(this.layer, keep)}
    }
})
addLayer("GM", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    
    symbol: " ", // This appears on the layer's node. Default is the id with the first letter capitalized
    color: "#FFFFFF",                       // The color for this layer, which affects many elements.
    resource: "棍母",            // The name of this layer's main prestige resource.
    row: 12,                                 // The row this layer is on (0 is the first row).

    baseResource: "棍母",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(10),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "none",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return player.L.points.gte(5) },          // Returns a bool for if this layer's node should be visible in the tree.
    tooltip: "棍母",
    
    milestones: {
        1: {
            requirementDescription: "-1棍母",
            effectDescription: "获得更多棍母(?)",
            done() { return player.GM.points.lte(-1) }
        }
    },
    tabFormat: {
    "棍母": {
        content: [
        ["display-text",function(){
          let s=""
          s+="你有多少棍母?是一个,1.79e308个,还是" + format(player.points) + "个?<br>这不重要,重要的是,你怎么解锁棍母的?"
          return s
        }],
        "blank",
        "blank",
        "milestones"]
        }
    }
})
addLayer("f", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#FF7F00",                       // The color for this layer, which affects many elements.
    resource: "快速点数",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    symbol: "f", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order

    baseResource: "声望点数",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.P.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(2.5e11),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    base(){
    return new Decimal(1.01) //i d k y
    },

    layerShown() { return player.test},          // Returns a bool for if this layer's node should be visible in the tree.
    branches: ["L","P"],

    milestones: {
        0: {
            requirementDescription: "1快速点数",
            effectDescription: "解锁声望挑战",
            done() { return player.f.points.gte(1) }
        }
    },
    tabFormat: {
    "里程碑": {
        content: [
        "main-display",
          "blank",
        ["prestige-button",function(){return ""}],
        "blank",
        "resource-display",
        "blank",
        "blank",
        ["display-text",function(){
          let s=""
          s+="“快速”不是膨胀,是《快速》过掉这个层级("
          return s
        }],
        "milestones"]
        }
    },
    doReset(resettingLayer) {
        let keep = [];
        
        if ((resettingLayer == "ED" && getClickableState("ED",22) == 1 ) || resettingLayer == "L") {layerDataReset(this.layer, keep)}
    }
})
