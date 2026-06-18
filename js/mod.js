let modInfo = {
	name: "The Layer Tree",
	author: "xiajibazuo",
	pointsName: "点数",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal(0), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.<br>
<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
  -test:<br>
  <h1>log(e)</h1>`

let winText = `恭喜！您已成功完成游戏并到达终点，不过目前......不妨找找彩蛋( `

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	let exp = new Decimal(1)
	if (hasMilestone("L",5))gain=gain.times(new Decimal(10).pow(player.L.layerPoint))
	if (hasUpgrade("p",11) && !hasUpgrade("P",13)){
	    if (hasUpgrade("p",13))gain=gain.times(7)
	    else gain=gain.times(4)
	}
	if (hasUpgrade("p",12))gain=gain.times(player.points.add(1).log(2.718281828).add(1))
	if (hasUpgrade("p",14))gain=gain.times(player.points.pow(0.25).add(1))
	if (hasUpgrade("p",15))gain=gain.times(player.points.pow(0.25).add(1))
	if (hasUpgrade("P",11))gain=gain.times(player.P.points.times(player.P.points.add(1).log(2.718281828)).add(1))
	
	if (hasUpgrade("p",11) && hasUpgrade("p",13) && hasUpgrade("P",13))exp = exp.times(2)
	
	gain = gain.pow(exp)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
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