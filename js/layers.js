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
        mult = new Decimal(1)
        

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },    
    autoPrestige(){
        return hasMilestone('L',1) && !hasMilestone('L',3);
    },    
     row: 0, // Row the layer is in on the tree (0 is the first row)

    update(diff){
    player.L.layerPoint=getBuyableAmount("L",11).add(getBuyableAmount("L",12))
    if (player.L.points.gte(3)) {
         player.L.points = new Decimal(3)
         },
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
        },
    },
    buyables: {

    11: {
        title: "点数",
        display() {

           return "价格：" + format(new Decimal("10").pow(new Decimal("10").pow(getBuyableAmount("L", 11)))) + "点数"
        },
        unlocked() { return true},
        canAfford() { 
            return player.points.gte(new Decimal("10").pow(new Decimal("10").pow(getBuyableAmount("L", 11)))) 
        },
        buy() { 
            {
               player.points = player.points.minus(new Decimal("10").pow(new Decimal("10").pow(getBuyableAmount("L", 11))))
            },
            setBuyableAmount("L", 11, getBuyableAmount("L", 11).add(1))
        },
    },
    12: {
        title: "层级点数",
        display() {

           return "价格：达到" + format(new Decimal("2").pow(getBuyableAmount("L", 12))) + "层级点数"
        },
        unlocked() { return true},
        canAfford() { 
            return player.L.layerPoint.gte(new Decimal("2").pow(getBuyableAmount("L", 12)))
        },
        buy() {
            setBuyableAmount("L", 12, getBuyableAmount("L", 12).add(1))
        },
    },
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
        "milestones",],
        
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
        "buyables",],
    },
},
              automateStuff(){
        if(hasMilestone("L",2) && !hasMilestone('L',4)){
          if(layers.L.buyables[11].canAfford())setBuyableAmount("L",11,player.points.log(10).log(10).floor().add(1))
          if(layers.L.buyables[12].canAfford())setBuyableAmount("L",12,player.L.layerPoint.log(2).floor().add(1))
        },
    },
    layerShown(){return true}
})
