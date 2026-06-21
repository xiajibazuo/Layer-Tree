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
     row: 11, // Row the layer is in on the tree (0 is the first row)

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
        style: {'height':'100px','width':'200px'}
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
        display() {
           return "价格：" + format(new Decimal("10").pow(getBuyableAmount("L", 13).pow(2).times(0.5).add(getBuyableAmount("L", 13).times(1.5).add(1)))) + "声望点数<br>数量：" +format(getBuyableAmount("L",13))
        },
        unlocked() { return hasUpgrade("P",12) },
        canAfford() { 
            return player.P.points.gte(new Decimal("10").pow(getBuyableAmount("L", 13).pow(2).times(0.5).add(getBuyableAmount("L", 13).times(1.5).add(1))))
        },
        buy() {
            player.P.points=player.P.points.minus(new Decimal("10").pow(getBuyableAmount("L", 13).pow(2).times(0.5).add(getBuyableAmount("L", 13).times(1.5).add(1))))
            setBuyableAmount("L", 13, getBuyableAmount("L", 13).add(1))
        },
        style: {'height':'100px','width':'200px'}
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
        },
        style: {'height':'100px','width':'100px'}
    },
    12: {
        display() {return "/1.1"},
        onClick(){
            player.devSpeed = player.devSpeed.div(1.1)
        },
        canClick(){
            return true
        },
        style: {'height':'100px','width':'100px'}
    },
    13: {
        display() {return "=1"},
        onClick(){
            player.devSpeed = new Decimal(1)
        },
        canClick(){
            return true
        },
        style: {'height':'100px','width':'100px'}
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
        "clickables"]
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
        if (((resettingLayer == "ED" && getClickableState("ED",91) == 1 ) || resettingLayer == "L" )&& resettingLayer !== "P") {layerDataReset(this.layer, keep)}
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
    row: 12,                                 // The row this layer is on (0 is the first row).

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
        title: "重置点数",
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
        title: "重置声望点数",
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
        points: new Decimal(0)             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#FF0000",                       // The color for this layer, which affects many elements.
    resource: "点数",            // The name of this layer's main prestige resource.
    row: 0,                                 // The row this layer is on (0 is the first row).
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
    update(diff){
    player.p.points = player.points
    },
    layerShown() { return player.L.points.gte(2)},          // Returns a bool for if this layer's node should be visible in the tree.
    branches: ["L"],
    
    upgrades: {
        11: {
            title: "1",
            description(){
                if(hasUpgrade("P",13))return "增益点数<br>效果：^1.3"
                if(hasUpgrade("p",13))return "增益点数<br>效果：*7"
                else return "增益点数<br>效果：*4"
            },
            unlocked(){return true},
            cost: new Decimal(300)
        },
        12: {
            title: "2",
            description(){
                return "点数增益自己<br>效果：*" + format(player.points.add(1).log(2.718281828).add(1))
            },
            tooltip: "公式：*(ln(点数+1)+1)",
            unlocked(){return hasUpgrade("p",11)},
            cost: new Decimal(1200)
        },
        13: {
            title: "3",
            description(){
                if(hasUpgrade("P",13)) return "升级1的效果更好(*4→^1.3)"
                return "升级1的效果更好(*4→*7)"
            },
            unlocked(){return hasUpgrade("p",12)},
            cost: new Decimal(24000)
        },
        14: {
            title: "4",
            description(){
                return "增益点数<br>效果：^1.5"
            },
            unlocked(){return hasUpgrade("p",13)},
            cost: new Decimal(40000)
        },
        15: {
            title: "5",
            description(){
                return "增益点数<br>效果：^1.5"
            },
            unlocked(){return hasUpgrade("p",14)},
            cost: new Decimal(5e6)
        }
    },
    tabFormat: {
    "升级": {
        content: [
        "main-display",
        "blank",
        "blank",
        ["display-text",function(){
          let s=""
          s+="升级不消耗点数(才不是因为不会写代码呢)<br>"
          return s
        }],
        "upgrades"]
        }
    },
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("P",1) && resettingLayer == "P") keep.push("upgrades")
        
        if ((resettingLayer == "ED" && getClickableState("ED",11) == 1 ) || resettingLayer == "L" || resettingLayer == "P") {layerDataReset(this.layer, keep)}
    }
})
addLayer("P", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        total: new Decimal(0)
    }},

    color: "#4BDC13",                       // The color for this layer, which affects many elements.
    resource: "声望点数",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).

    baseResource: "点数",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(5e14),              // The amount of the base needed to  gain 1 of the prestige currency.
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
    tooltip: "达到5e14点数解锁层级(关于层级要二次解锁这件事)",
    
    milestones: {
        1: {
            requirementDescription: "10声望点数",
            effectDescription: "重置时保留p层级升级",
            done() { return player.P.points.gte(10) }
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
                return "升级3的效果更好(*7→^1.3)"
            },
            unlocked(){return hasUpgrade("P",12)},
            cost: new Decimal(1000)
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
    }
    },
    doReset(resettingLayer) {
        let keep = [];
        
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
    row: 13,                                 // The row this layer is on (0 is the first row).

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
        },{"font-size": "32px"}],
        "blank",
        "blank",
        "milestones"]
        }
    }
})