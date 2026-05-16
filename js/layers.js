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
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
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
     row: 0, // Row the layer is in on the tree (0 is the first row)

    update(diff){
    player.L.layerPoint=getBuyableAmount("L",11).add(getBuyableAmount("L",12))
    if (player.L.points.gte(3)) {
         player.L.points = new Decimal(3)
         }
    },
        milestones: {
        1: {
            requirementDescription: "0层级",
            effectDescription: "自动购买层级，每一个层级都会解锁一个层级，上限为3个层级",
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
        }
    },
    buyables: {

    11: {
        title: "点数",
        display() {
            if(getBuyableAmount("L",11).eq(0))return "价格：5点数<br>数量：0"
            else return "价格：" + format(new Decimal("10").pow(new Decimal("10").pow(getBuyableAmount("L",11)))) + "点数<br>数量：" +format(getBuyableAmount("L",11))
        },
        unlocked() { return true },
        canAfford() { 
            if(getBuyableAmount("L",11).eq(0))return new Decimal(5)
            else return player.points.gte(new Decimal("10").pow(new Decimal("10").pow(getBuyableAmount("L",11)))) 
        },
        buy() { 
            if(getBuyableAmount("L",11).eq(0))player.points = player.points.minus(5)
            else player.points = player.points.minus(new Decimal("10").pow(new Decimal("10").pow(getBuyableAmount("L",11))))
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
        "buyables"]
    }
},
    automateStuff(){
        if(hasMilestone("L",2) && !hasMilestone('L',4)){
            if(canBuyBuyable("L",11))buyBuyable("L",11)
            if(canBuyBuyable("L",12))buyBuyable("L",12)
        }
    },
    doReset(resettingLayer) {
        let keep = [];
        
        if (resettingLayer=="L") {
        keep.push("points")
        keep.push("milestones")
        }
        if (layers[resettingLayer].row > this.row || resettingLayer == "L") {layerDataReset(this.layer, keep)}
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
    row: 114514,                                 // The row this layer is on (0 is the first row).

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
          s+="重置会重置一切<br>"
          return s
        }]]
    }
},
    layerShown() { return player.points.gte(0)}          // Returns a bool for if this layer's node should be visible in the tree.
    //别忘了改!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
})addLayer("p", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0)             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#FF0000",                       // The color for this layer, which affects many elements.
    resource: "点数",            // The name of this layer's main prestige resource.
    row: 0,                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal("0"),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    }
})