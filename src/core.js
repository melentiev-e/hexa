
export default class Labirint {

	constructor(builder, layers, maxStepsCont){
		this.visitedHexas = []
		this.doors = []
		this.pathToHexa = []

		this.builder = builder	
		this.layers	= layers
		this.maxStepsCont = maxStepsCont
		this.labirint = []
	}
	
	/**Build next step in labirint */
	buildNextLabirintStep(hexa, count = 0) {

		this.labirint.push(hexa.key)
		hexa.nextSteps = hexa.nextSteps || []
		this.visitedHexas[hexa.key] = 1
		let neighbours = this.builder.getHexaNeighbours(hexa)
		
		let freeNeighbours = this.getNotVisitedNeighbours(neighbours)

		if (freeNeighbours.length == 0 || count == this.maxStepsCont) {
			return
		}
		count++
		let nextHexa = getRandomItem(freeNeighbours)
		hexa.nextSteps.push(nextHexa)
		this.buildNextLabirintStep(nextHexa, count)
	}

	/**Select from all neighbours only not visited */
	getNotVisitedNeighbours(neighbours) {
		return neighbours.filter(item => item != undefined && this.visitedHexas[item.key] == undefined)
	}

	/**Find new  satart hexa for building path*/
	getNextStartHexa() {
		let hexas = []
		for (let z = -this.layers; z <= this.layers; z++) {
			for (let x = -this.layers; x <= this.layers; x++) {
				for (let y = -this.layers; y <= this.layers; y++) {
					if (x + y + z == 0) {
						let hexa =this.builder.getHexaAtPoint(x, y)
						if (!this.visitedHexas[hexa.key]) {
							continue
						}
						let neighbours = this.builder.getHexaNeighbours(hexa)
						if (neighbours.some(n => n && !this.visitedHexas[n.key])) {
							hexas.push(hexa)
						}
					}
				}
			}
		}
		return hexas ? getRandomItem(hexas) : undefined
	}

	buildGrid(){
		// Create full grid of hexagonal objects
		for (let z = -this.layers; z <= this.layers; z++) {
			for (let x = -this.layers; x <= this.layers; x++) {
				for (let y = -this.layers; y <= this.layers; y++) {
					if (x + y + z == 0) {
						this.builder.createHexaAtPoint(x, y)
					}
				}
			}
		}
	}

	build(){
		this.buildGrid()
		let hexa = this.builder.getHexaAtPoint(0, 0)
		// eslint-disable-next-line no-constant-condition
		while (true) {
			this.buildNextLabirintStep(hexa)
			hexa = this.getNextStartHexa()
			if (!hexa) {
				return
			}
		}
	}

	findPath(from, to){
		this.pathToHexa = []
		this.testNextStep(from, to)
		return this.pathToHexa.map(item=>this.builder.HexaStore[item])
	}

	testNextStep(nextHexa, targetHexa) {
		// Push new step to path
		this.pathToHexa.push(nextHexa.key)
	
		// If loocking hexa is finded, stop looking
		if (nextHexa == targetHexa) {
			return true
		}
	
		// Try go further through each potential way from current hexa
		for (let index = 0; index < nextHexa.nextSteps.length; index++) {
			if (this.testNextStep(nextHexa.nextSteps[index], targetHexa)) {
				return true
			}
		}
	
		// If no one ways leads to the looking hexa, pop current hexa from the path
		this.pathToHexa.pop()
		return false
	}

}

/**Get random item from array */
function getRandomItem(array) {
	var index = Math.floor(Math.random() * (array.length - 1))
	return array[index]
}
