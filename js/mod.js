let modInfo = {
	name: "The Layer Tree",
	author: "我是xiajibazuo我埃及吧做啥就做啥",
	pointsName: "点数",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal(0), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "Literally nothing",
}

let changelog = `<h1>更新日志:</h1><br>
    <h3>v0.2</h3><br>
        -新增9个挑战<br>
        -新增1个层级<br>
        -新增5个升级<br>
        -新增5个里程碑<br>
        -新增2个可点击<br>
        -新增3个可购买<br>
    <h3>v0.1</h3><br>
        -新增5个层级<br>
        -新增9个升级<br>
        -新增9个里程碑<br>
        -新增6个可点击<br>
        -新增3个可购买<br>
    <h3>v0.0</h3><br>
        -棍母`

let winText = `恭喜！您已成功完成游戏并到达终点，不过目前......不妨找找彩蛋( `

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return (!inChallenge("p",12))
}

// Calculate points/sec!
function getPointGen() {
	let gain = new Decimal(1)
	let exp = new Decimal(1)
	if (hasMilestone("L",5))gain=gain.times((hasMilestone("P",3) ? player.L.layerPoint : new Decimal(10)).pow(player.L.layerPoint))
	if (hasUpgrade("p",11)){
	    if (hasUpgrade("p",13)){
	        if (hasUpgrade("P",13) && !inChallenge("P",22)){
	            if (false){
	                gain = gain.times(1)
	            }
	            else gain = gain.times(1e10)
	        }
	        else gain=gain.times(7)
	    }
	    else gain=gain.times(4)
	}
	if (hasUpgrade("p",12))gain = gain.times(player.points.max(player.p.best2).min("1.79e308").add(1).log(Math.E).add(1))
	if (hasUpgrade("p",14) && !inChallenge("P",12))gain = gain.times(player.points.max(player.p.best2).min("1.79e308").pow(0.25).add(1))
	if (hasUpgrade("p",15) && !inChallenge("P",12))gain = gain.times(player.points.max(player.p.best2).min("1.79e308").pow(0.25).add(1))
	if (hasUpgrade("P",11) && !inChallenge("P",22))gain = gain.times(player.P.points.times(player.P.points.add(1).log(Math.E)).add(1))
	if (hasChallenge("P",11))gain = gain.times(1000)
	if (hasChallenge("P",12))gain = gain.times(1000)
	if (inChallenge("P",13))gain = gain.div(player.points.pow(0.3).add(1)).div(1e30)
	if (hasUpgrade("P",14))gain = gain.times(1000)
	if (inChallenge("p",11))gain = gain.div(1e20)
	if (hasChallenge("p",11))gain = gain.times(1e20)
	if (hasChallenge("p",12))gain = gain.times(1e20)
	if (hasChallenge("P",22))gain = gain.times(1000)
	if (inChallenge("P",22))gain = gain.div(1e114)
	if (inChallenge("P",23))gain = gain.div(1e114)
	if (hasUpgrade("p",21))gain = gain.times(10)
	if (hasUpgrade("p",21))gain = gain.times(buyableEffect("p",11))
	if (hasUpgrade("p",23))gain = gain.times(buyableEffect("p",12))
	if (hasUpgrade("p",22))gain = gain.times(10)
	if (hasUpgrade("p",23))gain = gain.times(10)
	if (hasUpgrade("p",24))gain = gain.times(10)
	if (hasUpgrade("p",25))gain = gain.times(10)
	if (hasMilestone("P",2))gain = gain.times(1000)
	if (hasMilestone("P",4))gain = gain.times(100)
	
	if (inChallenge("P",11))exp = exp.times(0.15)
	if (inChallenge("P",21))exp = exp.times(0.05)
	if (inChallenge("P",23))exp = exp.div(player.points.pow(0.5).add(1).log(Math.E).add(1).log(Math.E).add(1))
	if (hasUpgrade("p",25))exp = exp.times(buyableEffect("p",13))
	
	gain = gain.pow(exp)
	
	if(!canGenPoints()){
	    player.preGetPointGen = gain
		return new Decimal(0)
	}
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
    devSpeed: new Decimal(1),
    test: false,
    preGetPointGen: new Decimal(1)
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.ED.points.gte(new Decimal("1"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}