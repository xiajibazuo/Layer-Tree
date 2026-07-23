/*i d k y do i fill 棍母
mod.js


*/
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
        if (hasUpgrade("P",91)) return new Decimal(0.499)
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
    resetsNothing(){return hasMilestone("L",6)},

    update(diff){
    player.L.layerPoint=getBuyableAmount("L",11).add(getBuyableAmount("L",12)).add(getBuyableAmount("L", 13))
    if (player.L.points.gte(player.layerLimit)) {
         player.L.points = new Decimal(player.layerLimit)
         }
    },
        milestones: {
        1: {
            requirementDescription: "0层级",
            effectDescription(){
                let s = ""
                if(hasMilestone("L",3))s+="<del>自动购买层级,</del>"
                else s+="自动购买层级,"
                s+="每一个层级都会解锁一个层级,上限为" + player.layerLimit + "个层级" + ((getClickableState("F",11) == 1) ? ",同时层级点数不被层级重置" : "")
                return s
            },
            done() { return player.L.points.gte(0) }
        },
        2: {
            requirementDescription: "0层级点数",
            effectDescription(){
                let s = ""
                if(hasMilestone("L",3))s+="<del>自动购买层级点数</del>"
                else s+="自动购买层级点数"
                return s
            },
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
                return "基于层级点数增益" + ((getClickableState("F",11) == 1) ? "<del>点数</del>声望点数" : "点数") + "<br>公式：" + (hasMilestone("P",3) ? ("层级点数^层级点数<br>效果：" + format(player.L.layerPoint.pow(player.L.layerPoint))) : ("10^层级点数<br>效果：" + format(new Decimal(10).pow(player.L.layerPoint))))
            },
            done() { return player.L.points.gte(2) }
        },
        6: {
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
            if(new Decimal(x).gte(7))return new Decimal("10").pow(new Decimal(x).pow(new Decimal(x).times(0.02).add(2)).times(0.5).add(new Decimal(x).pow(new Decimal(x).times(0.02).add(1)).times(1.5).add(1)))
            return new Decimal("10").pow(new Decimal(x).pow(2).times(0.5).add(new Decimal(x).times(1.5).add(1)))},
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
        onHold(){
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
        onHold(){
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
        onHold(){
            player.devSpeed = new Decimal(1)
        },
        canClick(){
            return true
        }
    },
    21: {
        display() {return "pause"},
        onClick(){
            if(player.devSpeed.eq(0))player.devSpeed = new Decimal(1)
            else player.devSpeed = new Decimal(0)
        },
        canClick(){
            return true
        },
        unlocked(){return player.test}
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
            if (getClickableState("F",11)){
                keep.push("buyables")
                keep.push("layerPoint")
        }
        if(resettingLayer=="F"){
            keep.push("points")
            keep.push("milestones")
            keep.push("buyables")
            keep.push("layerPoint")
        }
        if ((resettingLayer == "ED" && getClickableState("ED",91) == 1 ) || resettingLayer == "L" || resettingLayer == "F") {layerDataReset(this.layer, keep)}
    },
    layerShown(){return player.L.points.gte(1)}
})
addLayer("ED", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0)             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#808080",                       // The color for this layer, which affects many elements.
    resource: "终局",            // The name of this layer's main prestige resource.
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
        style: {"background-color": "#FF7F00"}
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
    },
    101: {
        title: "重置错误",
        display() {
            if (getClickableState("ED",101) == 1) return "是"
            else return "否"
            },
        onClick(){
            if (getClickableState("ED",101) == 0) setClickableState("ED",101,1)
            else setClickableState("ED",101,0)
        },
        canClick(){
            return hasUpgrade("P",91)
        },
        style: {"background-color": "#BF8F8F"},
        unlocked(){return player.test},
        tooltip: "能点吗"
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
          s+="选择终局是否重置以下层级<br>"
          return s
        }],
        "clickables"]
    }
},
    layerShown() { return player.L.points.gte(player.layerLimit.minus(1))}          // Returns a bool for if this layer's node should be visible in the tree.
    //别忘了改!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
})
addLayer("p", {
    name: "点数", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        best: new Decimal(0),
        best2: new Decimal(0),
        pu1EffType: "mult"
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
        if (hasUpgrade("P",13) && hasUpgrade("p",13) && hasUpgrade("p",11) && !inChallenge("P",22) && getClickableState("F",13) == 1)player.p.pu1EffType = "exp"
        else player.p.pu1EffType = "mult"
    },
    
    upgrades: {
        11: {
            title: "1",
            effect(){
                if(hasUpgrade("p",13)){
                    if(hasUpgrade("P",13) && !inChallenge("P",22)){
                        if (getClickableState("F",13) == 1){
                        if (false){
                            return new Decimal(1)
	                    }
                            return new Decimal(1.1)
	                    }
                        return new Decimal(1e10)
                    }
                    return new Decimal(7)
                }
                return new Decimal(4)},
            description(){
                return "增益点数<br>效果：" + (player.p.pu1EffType == "exp" ? "^" : "*") + format(this.effect())
            },
            unlocked(){return true},
            cost: new Decimal(300)
        },
        12: {
            title: "2",
            description(){
                return ((getClickableState("F",12) == 1) ? "声望指数提高(0.2→0.5)" : ("点数增益自己<br>效果：*" + format(upgradeEffect(this.layer,this.id))))
            },
            effect(){
                let hc = new Decimal(1)
                hc = new Decimal("1.79e308")
                
                if(getClickableState("F",12) == 1)return new Decimal(1)
                return player.points.max(player.p.best2).min(hc).add(1).log(Math.E).add(1)
            },
            tooltip(){
                let hc = new Decimal(1)
                hc = new Decimal("1.79e308")
                let s = "公式：*(ln(点数+1)+1)"
                if(player.points.gte(hc)) s+="<br>现在点数超过了" + format(hc) + ",效果达到硬上限"
                return ((getClickableState("F",12) == 1) ? "" : s)
            },
            unlocked(){return hasUpgrade("p",11)},
            cost: new Decimal(1200)
        },
        13: {
            title: "3",
            description(){
                if(hasUpgrade("P",13) && !inChallenge("P",22)){
                    if (getClickableState("F",13) == 1){
                    if (false){
                        return "增益点数<br>效果：^ee45e4"
	                }
                        return "增益点数<br>效果：不想写了看升级1吧qwq"
	                }
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
                return "点数增益自己<br>效果：*" + format(upgradeEffect(this.layer,this.id))
            },
            tooltip(){
                let hc = new Decimal(1)
                if(!hasMilestone("F",1))hc = new Decimal("1.79e308")
                else{
                    hc = new Decimal("1.79e308")
                }
                let s = "公式：*(点数^0.25+1)"
                if(player.points.gte(hc)) s+="<br>现在点数超过了" + format(hc) + ",效果达到硬上限"
                return s
            },
            effect(){
                let hc = new Decimal(1)
                if(!hasMilestone("F",1))hc = new Decimal("1.79e308")
                else{
                    hc = new Decimal("1.79e308")
                }
                
                return player.points.max(player.p.best2).min(hc).pow(0.25).add(1)
            },
            unlocked(){return hasUpgrade("p",13)},
            cost: new Decimal(40000)
        },
        15: {
            title: "5",
            description(){
                return ((getClickableState("F",12) == 1) ? "声望基础价格降低(1e14→1e555)但声望点数/10000" : ("点数增益自己<br>效果：*" + format(upgradeEffect(this.layer,this.id))))
            },
            effect(){
                let hc = new Decimal(1)
                hc = new Decimal("1.79e308")
                
                if(getClickableState("F",12) == 1)return new Decimal(1)
                return player.points.max(player.p.best2).min(hc).pow(0.25).add(1)
            },
            tooltip(){
                let hc = new Decimal(1)
                hc = new Decimal("1.79e308")
                let s = "公式：*(点数^0.25+1)"
                if(player.points.gte(hc)) s+="<br>现在点数超过了" + format(hc) + ",效果达到硬上限"
                return ((getClickableState("F",12) == 1) ? "" : s)
            },
            unlocked(){return hasUpgrade("p",14)},
            cost: new Decimal(1000000)
        },
        21: {
            title: "6",
            description(){
                return "解锁点数可购买,这一行每一个升级点数*10<br>需要在PC" + (getClickableState("F",14) == 1 ? "1" : "4") + "中购买"
            },
            unlocked(){return hasChallenge("P",23)},
            cost(){
                if (!inChallenge("P",(getClickableState("F",14) == 1 ? 11 : 21))) return new Decimal("eeeeeeeeee114514")
                return new Decimal(1e15)
            }
        },
        22: {
            title: "7",
            description(){
                return "PC1,3,4,6不重置点数升级,但是第1行在PC3,6里除外<br>需要在PC2中购买"
            },
            unlocked(){return hasUpgrade("p",21)},
            cost(){
                if (!inChallenge("P",12)) return new Decimal("eeeeeeeeee114514")
                return new Decimal(1e135)
            }
        },
        23: {
            title: "8",
            description(){
                return "解锁一个可购买<br>需要在PC1中购买"
            },
            unlocked(){return hasUpgrade("p",22)},
            cost(){
                if (!inChallenge("P",11)) return new Decimal("eeeeeeeeee114514")
                return new Decimal(1e45)
            }
        },
        24: {
            title: "9",
            description(){
                return "声望不重置点数可购买<br>需要在PC5中购买"
            },
            unlocked(){return hasUpgrade("p",23)},
            cost(){
                if (!inChallenge("P",22)) return new Decimal("eeeeeeeeee114514")
                return new Decimal(1e115)
            }
        },
        25: {
            title: "10",
            description(){
                return "解锁一个可购买,解锁四个里程碑<br>需要在PC3中购买"
            },
            unlocked(){return hasUpgrade("p",24)},
            cost(){
                if (!inChallenge("P",13)) return new Decimal("eeeeeeeeee114514")
                return new Decimal(1e250)
            }
        }
    },
    challenges: {
        11: {
            name: "C1",
            challengeDescription: "点数/1e20(没那么难,指数前面)",
            canComplete: function() {return player.points.gte(100)},
            goalDescription: "100点数",
            rewardDescription(){return "点数" + (getClickableState("F",14) == 1 ? "^1.01" : "*1e20(没那么好,指数前面)")},
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
            rewardDescription(){return "升级2,4,5可以基于点数最大值(声望重置保留),同时点数" + (getClickableState("F",14) == 1 ? "^1.01" : "*1e20")},
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
buyables: {
    11: {
        title: "pB1",
        cost(x) {
            return new Decimal(getClickableState("F",15) == 1 ? 1e100 : "1e270").times(new Decimal(1e10).pow(x))
        },
        effect(x){
            return new Decimal(1e3).pow(x)
        },
        display() {
           return "增益点数<br>效果：*" + format(this.effect()) + "价格：达到" + format(this.cost()) + "点数<br>数量：" +format(getBuyableAmount("p",11))
        },
        tooltip: "效果公式：*1000^(可购买数量)",
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buy() {
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        }
    },
    12: {
        title: "pB2",
        cost(x) {
            return new Decimal("1e315").times(new Decimal(1e15).pow(x))
        },
        effect(x){
            return player.points.pow(new Decimal(x).add(1).log(Math.E).add(1).log(Math.E).times(0.05)).add(1)
        },
        display() {
           return "增益点数<br>效果：*" + format(this.effect()) + "价格：达到" + format(this.cost()) + "点数<br>数量：" +format(getBuyableAmount("p",12))
        },
        tooltip: "效果公式：*点数^(ln(ln(可购买数量+1)+1)*0.05)+1",
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buy() {
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        unlocked(){return hasUpgrade("p",23)}
    },
    13: {
        title: "pB3",
        cost(x) {
            return new Decimal("1e350").times(new Decimal(1e20).pow(x))
        },
        effect(x){
            return new Decimal(x).add(1).log(Math.E).times(hasMilestone("P",5) ? 0.03 : 0.01).add(1)
        },
        display() {
           return "增益点数<br>效果：^" + format(this.effect()) + "价格：达到" + format(this.cost()) + "点数<br>数量：" +format(getBuyableAmount("p",13))
        },
        tooltip(){return "效果公式：^(ln(可购买数量+1)*" + (hasMilestone("P",5) ? "0.03" : "0.01") + "+1)"},
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buy() {
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        unlocked(){return hasUpgrade("p",25)}
    }
},
    clickables: {
    11: {
        display(){
            if(inChallenge("p",12))return "主动获取点数"
            else return "升级2,4,5的效果基于现在点数最大值<br>目前升级基于" + format(player.p.best2) + "点数<br>当前最大值：" + format(player.p.best)
        },
        unlocked(){return(inChallenge("p",12) || hasChallenge("p",12))},
        onClick(){
            if(inChallenge("p",12)){
                player.points = player.points.add(player.preGetPointGen)
            }
            else if(player.p.best.gt(player.p.best2)) player.p.best2 = player.p.best
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
    },
    "可购买": {
        unlocked(){return hasUpgrade("p",21)},
        content: [
        "main-display",
          "blank",
        "clickables",
        "blank",
        "blank",
        ["display-text",function(){
          let s=""
          s+="依旧不消耗点数(<br>"
          return s
        }],
        "buyables"]
    }
    },
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("P",1) && resettingLayer == "P") keep.push("upgrades")
        if (hasChallenge("P",21) && resettingLayer == "P") keep.push("challenges")
        if (hasChallenge("p",12) && resettingLayer == "P") keep.push("best2")
        if (hasUpgrade("p",24) && resettingLayer == "P") keep.push("buyables")
        
        if ((resettingLayer == "ED" && getClickableState("ED",11) == 1 ) || resettingLayer == "L" || resettingLayer == "P" || resettingLayer == "F") {layerDataReset(this.layer, keep)}
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

    requires(){return ((getClickableState("F",12) == 1) && hasUpgrade("p",15) ? new Decimal(1e6) : new Decimal(1e14))},              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent(){return ((getClickableState("F",12) == 1) && hasUpgrade("p",12) ? 0.5 : 0.2)},                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = new Decimal(1)
    	if (hasMilestone("L",5) && (getClickableState("F",11) == 1))mult = mult.times((hasMilestone("P",3) ? player.L.layerPoint : new Decimal(10)).pow(player.L.layerPoint))
        if(hasMilestone("F",4))mult = mult.times(buyableEffect("F",13))
        if((getClickableState("F",12) == 1) && hasUpgrade("p",12))mult = mult.div(10000)
       	if (hasUpgrade("P",14) && getClickableState("F",14) == 1)mult = mult.times(upgradeEffect(this.layer,this.id))
        return mult               // Factor in any bonuses multiplying gain here.
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
            effectDescription: "重置时保留点数升级",
            done() { return player.P.total.gte(10) }
        },
        2: {
            requirementDescription: "1e70总声望点数",
            effectDescription: "点数*1000",
            done() { return player.P.total.gte(1e70) }
        },
        3: {
            requirementDescription: "5e71总声望点数和10层级点数",
            effectDescription: "层级里程碑公式更好(*10^层级点数→*层级点数^层级点数)",
            done() { return player.P.total.gte(5e71) && player.L.layerPoint.gte(10)}
        },
        4: {
            requirementDescription: "1e74总声望点数",
            effectDescription: "点数*100",
            done() { return player.P.total.gte(1e74) }
        },
        5: {
            requirementDescription: "1e75总声望点数",
            effectDescription: "pB3效果更好(^(ln(可购买数量+1)*0.01+1)→^(ln(可购买数量+1)*0.03+1))",
            done() { return player.P.total.gte(1e75) }
        }
    },
    upgrades: {
        11: {
            title: "P1",
            description(){
                return ("声望点数增益点数<br>效果：*" + format(upgradeEffect(this.layer,this.id)))
            },
            effect(){
                let sc = new Decimal(1)
                sc = new Decimal("1.79e308")
                if(getClickableState("F",13) == 1)sc = new Decimal(1e20)
                let eff = new Decimal(1)
                if(player.P.points.gte(sc)) eff = player.P.points.times(player.P.points.add(1).log(Math.E)).add(1).pow(0.5).times(sc.pow(1-0.5))
                else eff = player.P.points.times(player.P.points.add(1).log(Math.E)).add(1)
                return eff
            },
            tooltip(){
                let sc = new Decimal(1)
                sc = new Decimal("1.79e308")
                if(getClickableState("F",13) == 1)sc = new Decimal(1e20)
                let s = "公式：*(声望点数*ln(声望点数+1)+1)"
                if(player.P.points.gte(sc)) s+="<br>现在声望点数超过了" + format(sc) + ",效果达到软上限(^0.5)"
                return s
            },
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
                if (getClickableState("F",13) == 1){
                    if (false){
                        return "增益点数<br>效果：^ee45e4"
	                }
                    return "增益点数<br>效果：不想写了看升级1吧qwq"
	            }
                return "升级3的效果更好(*7→*1e10)"
            },
            unlocked(){return hasUpgrade("P",12)},
            cost: new Decimal(100)
        },
        14: {
            title: "P4",
            effect(){return player.P.points.pow(0.1).add(1)},
            description(){
                return "点数*1000" + (getClickableState("F",14) == 1 ? ("同时声望点数增益自己<br>效果：" + format(upgradeEffect(this.layer,this.id))) : "")
            },
            tooltip(){return (getClickableState("F",14) == 1 ? ("公式：*声望点数^0.1+1" : "")},
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
            challengeDescription(){
            let s = ""
            if(hasUpgrade("p",22))s+="<del>重置点数升级,同时</del>"
            else s+="重置点数升级,同时"
            s+="点数^0.15"
            return s
            },
            canComplete: function() {return player.points.gte(1e7)},
            goalDescription: "10000000点数",
            rewardDescription: "点数*1000",
            unlocked(){return true},
            onEnter(){
                if(!hasUpgrade("p",22))player.p.upgrades = []
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
            challengeDescription(){
            let s = ""
            if(hasUpgrade("p",22))s+="<del>重置点数升级,同时</del>"
            else s+="重置点数升级,同时"
            s+=("点数削弱自己(公式：/(点数^0.5+1),同时点数/1e30<br>效果：/" + format(player.points.pow(0.3).add(1).times(1e30)))
            return s
            },
            canComplete: function() {return player.points.gte(getClickableState("F",13) == 1 ? 1e15 : 1e20)},
            goalDescription(){return (getClickableState("F",13) == 1 ? "1e15" : "1e20") + "点数"},
            rewardDescription: "解锁更多声望升级",
            unlocked(){return hasChallenge("P",12)},
            onEnter(){
                let upgrades = []
                let resetList = [11,12,13,14,15]
                for(let i in player.p.upgrades){
                    if(!(resetList.includes(player.p.upgrades[i])))upgrades.push(player.p.upgrades[i])
                }
                player.p.upgrades = upgrades
                if(!hasUpgrade("p",22))player.p.upgrades = []
            }
        },
        21: {
            name: "PC4",
            challengeDescription(){
            let s = ""
            if(hasUpgrade("p",22))s+="<del>重置点数升级,同时</del>"
            else s+="重置点数升级,同时"
            s+="点数^0.05,解锁点数挑战"
            return s
            },
            canComplete: function() {return hasChallenge("p",13)},
            goalDescription: "???",
            rewardDescription: "重置时保留点数挑战",
            unlocked(){return hasUpgrade("P",15)},
            onEnter(){
                if(!hasUpgrade("p",22))player.p.upgrades = []
            }
        },
        22: {
            name: "PC5",
            challengeDescription(){return "声望升级1,3没有效果,同时点数/" + (getClickableState("F",14) == 1 ? "114514" : "1e114") + "(好臭的削弱)"},
            canComplete: function() {return player.points.gte(getClickableState("F",14) == 1 ? 1e35 : 1e80)},
            goalDescription(){return (getClickableState("F",14) == 1 ? "1e35" : "1e80") + "点数"},
            rewardDescription: "点数*1000",
            unlocked(){return hasChallenge("P",21)}
        },
        23: {
            name: "PC6",
            challengeDescription(){
            let s = ""
            if(hasUpgrade("p",22))s+="<del>重置点数升级,同时</del>"
            else s+="重置点数升级,同时"
            s+=("点数削弱自己(公式：^(1/(ln(ln(点数^0.5+1)+1)+1))),同时点数/" + (getClickableState("F",14) == 1 ? "114514" : "1e114") + "(好臭的削弱)<br>效果：^(1/" + format(player.points.pow(0.5).add(1).log(Math.E).add(1).log(Math.E).add(1)) + ")")
            return s
            },
            canComplete: function() {return player.points.gte(1e33)},
            goalDescription: "1e33点数",
            rewardDescription: "解锁更多点数升级",
            unlocked(){return hasChallenge("P",22)},
            onEnter(){
                let upgrades = []
                let resetList = [11,12,13,14,15]
                for(let i in player.p.upgrades){
                    if(!(resetList.includes(player.p.upgrades[i])))upgrades.push(player.p.upgrades[i])
                }
                player.p.upgrades = upgrades
                if(!hasUpgrade("p",22))player.p.upgrades = []
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
        
        if ((resettingLayer == "ED" && getClickableState("ED",21) == 1 ) || resettingLayer == "L" || resettingLayer == "F") {layerDataReset(this.layer, keep)}
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

    layerShown() { return player.L.points.gte(player.layerLimit) },          // Returns a bool for if this layer's node should be visible in the tree.
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

    layerShown() { return player.L.points.gte(4)},          // Returns a bool for if this layer's node should be visible in the tree.
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
        
        if ((resettingLayer == "ED" && getClickableState("ED",22) == 1 ) || resettingLayer == "L" || resettingLayer == "F") {layerDataReset(this.layer, keep)}
    }
})

addLayer("F", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        best: new Decimal(0),
        falsePoint: new Decimal(0),
        falsePointGain: new Decimal(0)
    }},

    color: "#BF8F8F",                       // The color for this layer, which affects many elements.
    symbol: "×", // This appears on the layer's node. Default is the id with the first letter capitalized
    resource: "错误",            // The name of this layer's main prestige resource.
    row: 10,                                 // The row this layer is on (0 is the first row).

    baseResource: "层级",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.L.points },  // A function to return the current amount of baseResource.

    requires(){return player.F.points.add(5)},              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 1,                          // "normal" prestige gain is (currency^exponent).
    base(){
    return new Decimal(1)
    },

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return player.test && (player.L.points.gte(5) || hasMilestone("F",1))},          // Returns a bool for if this layer's node should be visible in the tree.
    tooltip: "解锁了吗",
    update(diff){
        let gain = player.points.add(1).log(Math.E)
        if(hasMilestone("F",2))gain = gain.times(buyableEffect("F",12))
        
        if(getClickableState("F",91) == 1)player.F.falsePointGain = gain
        if(hasMilestone("F",1))player.F.falsePoint = player.F.falsePoint.add(player.F.falsePointGain.times(diff))
    },
    branches: ["L"],
    
    milestones: {
        1: {
            requirementDescription: "1错误",
            effectDescription: "永久显示F层级,开启升/降级1,解锁错误点数",
            done() { return player.F.points.gte(1) && (player.test && (player.L.points.gte(5) || hasMilestone("F",1)))},
            onComplete(){setClickableState("F",11,1)}
        },
        2: {
            requirementDescription: "1错误和3层级(和1错误点数)(为什么你别管)",
            effectDescription: "开启升/降级2,解锁一个可购买",
            done() { return player.F.points.gte(1) && player.L.points.gte(3) && player.F.falsePoint.gte(1) && (player.test && (player.L.points.gte(5) || hasMilestone("F",1)))},
            onComplete(){setClickableState("F",12,1)}
        },
        3: {
            requirementDescription: "1错误和1声望点数(和1错误点数)(为什么你别管)",
            effectDescription: "开启升/降级3",
            done() { return player.F.points.gte(1) && player.P.points.gte(1) && player.F.falsePoint.gte(1) && (player.test && (player.L.points.gte(5) || hasMilestone("F",1)))},
            onComplete(){setClickableState("F",13,1)}
        },
        4: {
            requirementDescription: "1错误和通过点数挑战3(和1错误点数)(为什么你别管)",
            effectDescription: "开启升/降级4,解锁一个可购买",
            done() { return player.F.points.gte(1) && hasChallenge("p",13) && player.F.falsePoint.gte(1) && (player.test && (player.L.points.gte(5) || hasMilestone("F",1)))},
            onComplete(){setClickableState("F",14,1)}
        },
        5: {
            requirementDescription: "1错误和解锁可购买(和1错误点数)(为什么你别管)",
            effectDescription: "开启升/降级5",
            done() { return player.F.points.gte(1) && hasUpgrade("p",21) && player.F.falsePoint.gte(1) && (player.test && (player.L.points.gte(5) || hasMilestone("F",1)))},
            onComplete(){setClickableState("F",15,1)}
        },
        6: {
            requirementDescription: "1错误和5层级(和1错误点数)(为什么你别管)",
            effectDescription: "错误不重置层级,在重置时可以开启/关闭升/降级",
            done() { return player.F.points.gte(1) && player.L.points.gte(5) && player.F.falsePoint.gte(1) && (player.test && (player.L.points.gte(5) || hasMilestone("F",1)))}
           }
       },
buyables: {
    11: {
        title: "FB1",
        cost(x) {
            return new Decimal(1e2).times(new Decimal(1e2).pow(x))
        },
        effect(x){
            return new Decimal(1e2).pow(x)
        },
        display() {
           return "增益点数<br>效果：*" + format(this.effect()) + "价格：达到" + format(this.cost()) + "点数<br>数量：" +format(getBuyableAmount(this.layer,this.id))
        },
        tooltip: "效果公式：*(100^可购买数量)",
        canAfford() { return player[this.layer].falsePoint.gte(this.cost()) },
        buy() {
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        }
    },
    12: {
        title: "FB2",
        cost(x) {
            return new Decimal("1e3").times(new Decimal(70).pow(x))
        },
        effect(x){
            return new Decimal(10).pow(x)
        },
        display() {
           return "增益错误点数<br>效果：*" + format(this.effect()) + "价格：达到" + format(this.cost()) + "点数<br>数量：" +format(getBuyableAmount(this.layer,this.id))
        },
        tooltip: "效果公式：*(10^可购买数量)",
        canAfford() { return player[this.layer].falsePoint.gte(this.cost()) },
        buy() {
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        unlocked(){return (hasMilestone("F",2))}
    },
    13: {
        title: "FB3",
        cost(x) {
            return new Decimal(2e6).times(new Decimal(1e2).pow(x))
        },
        effect(x){
            return new Decimal(100).pow(x)
        },
        display() {
           return "增益声望点数<br>效果：*" + format(this.effect()) + "价格：达到" + format(this.cost()) + "点数<br>数量：" +format(getBuyableAmount(this.layer,this.id))
        },
        tooltip(){return "效果公式：*(100^可购买数量)"},
        canAfford() { return player[this.layer].falsePoint.gte(this.cost()) },
        buy() {
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        unlocked(){return (hasMilestone("F",4))}
    }
},
    clickables: {
    11: {
        title: "升/降级1",
        display() {
            return "修改层级里程碑效果<br>" + ((getClickableState(this.layer,this.id) == 1) ? "开" : "关") + (hasMilestone("F",6) ? "并且进行一次错误重置" : "")
        },
        onClick(){
            doReset("F")
            if (getClickableState(this.layer,this.id) == 0) setClickableState(this.layer,this.id,1)
            else setClickableState(this.layer,this.id,0)
        },
        canClick(){
            return false
        }
    },
    12: {
        title: "升/降级2",
        display() {
            return "修改点数升级效果<br>" + ((getClickableState(this.layer,this.id) == 1) ? "开" : "关") + (hasMilestone("F",6) ? "并且进行一次错误重置" : "")
        },
        onClick(){
            doReset("F")
            if (getClickableState(this.layer,this.id) == 0) setClickableState(this.layer,this.id,1)
            else setClickableState(this.layer,this.id,0)
        },
        canClick(){
            return false
        }
    },
    13: {
        title: "升/降级3",
        display() {
            return "升级P1的软上限提前,挑战PC3的要求降低,升级P3的效果更好?<br>" + ((getClickableState(this.layer,this.id) == 1) ? "开" : "关") + (hasMilestone("F",6) ? "并且进行一次错误重置" : "")
        },
        onClick(){
            doReset("F")
            if (getClickableState(this.layer,this.id) == 0) setClickableState(this.layer,this.id,1)
            else setClickableState(this.layer,this.id,0)
        },
        canClick(){
            return false
        }
    },
    14: {
        title: "升/降级4",
        display() {
            return "修改声望升级效果和点数挑战效果,修改PC5,PC6,升级6<br>" + ((getClickableState(this.layer,this.id) == 1) ? "开" : "关") + (hasMilestone("F",6) ? "并且进行一次错误重置" : "")
        },
        onClick(){
            doReset("F")
            if (getClickableState(this.layer,this.id) == 0) setClickableState(this.layer,this.id,1)
            else setClickableState(this.layer,this.id,0)
        },
        canClick(){
            return false
        }
    },
    15: {
        title: "升/降级5",
        display() {
            return "点数可购买的价格降低,但效果降低<br>" + ((getClickableState(this.layer,this.id) == 1) ? "开" : "关") + (hasMilestone("F",6) ? "并且进行一次错误重置" : "")
        },
        onClick(){
            doReset("F")
            if (getClickableState(this.layer,this.id) == 0) setClickableState(this.layer,this.id,1)
            else setClickableState(this.layer,this.id,0)
        },
        canClick(){
            return false
        }
    },
    21: {
        display() {
            return 
        },
        onClick(){
            if (getClickableState(this.layer,this.id) >= 2){
                doReset("F")
                setClickableState(this.layer,this.id,0)
            }
            else setClickableState(this.layer,this.id,(getClickableState(this.layer,this.id) + 1))
        },
        canClick(){
            return true
        },
        tooltip: "(哪来的你也别管)"
    },
    91: {
        display() {
            return "开始生产错误点数<br>" + ((getClickableState(this.layer,this.id) == 1) ? "开" : "关")
        },
        onClick(){
            if (getClickableState(this.layer,this.id) == 0) setClickableState(this.layer,this.id,1)
        },
        canClick(){
            return true
        },
        tooltip: "(哪来的你也别管)"
    }
    
    },
    tabFormat: {
    "啊?": {
        unlocked(){return false},
        content: [
        ["display-text",function(){
          let s=""
          s+="好吧解锁了<br>"
          return s
        }]]
    },
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
    "升/降级": {
        content: [
        "main-display",
          "blank",
        ["prestige-button",function(){return ""}],
        "blank",
        "resource-display",
        "blank",
        "blank",
        ["row",[["clickable",11],["clickable",12],["clickable",13],["clickable",14],["clickable",15]]]]
    },
    "错误点数": {
        unlocked(){return (hasMilestone("F",1))},
        content: [
        "main-display",
          "blank",
        ["prestige-button",function(){return ""}],
        "blank",
        "resource-display",
        "blank",
        ["display-text",function(){
          let s=""
          s+="你有" + format(player.F.falsePoint) + "错误点数<br>(" + format(player.F.falsePointGain) + "每秒,公式：ln(点数+1))<br>这将点数*" + format(player.F.falsePoint.pow(0.2).add(1)) + "<br>公式：错误点数^0.2+1<br>善良的xiajibazuo不忍心墙玩家,所以可购买不消耗错误点数"
          return s
        }],
        "blank",
        ["clickable",91],
        "buyables"]
    }
    
    },
    doReset(resettingLayer) {
        let keep = [];
        
        if (resettingLayer=="ED") {
        }
        if (resettingLayer == "ED" && getClickableState("ED",101) == 1 ) {layerDataReset(this.layer, keep)}
    }
})
