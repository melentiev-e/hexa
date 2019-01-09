import * as _ from './point'
import Hexagon from './hexa'

export default class HexaCollection {

	constructor (centerX, centerY, size){
		this.Center = new _.Point(centerX, centerY)
		this.Size = size
		this.HexaStore = {}
	}

	createHexaAtPoint(x,y){
		let offsetX = x * this.width + (this.width/2*y)
		let offsetY = y * this.height * 3/4
		let hexa =  new Hexagon(this.Center.X + offsetX, this.Center.Y + offsetY, this.Size, x,y)
		this.HexaStore[hexa.key] = hexa
	}
	getHexaAtPoint(x,y){		
		return this.HexaStore[`${x},${y}`]
	}
	getHexaNeighbours(hexa) {
		let offsets = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]]
		return offsets.map(e => this.HexaStore[`${hexa.Coord.X + e[0]},${hexa.Coord.Y + e[1]}`])
	}

	get height() {
		return 2 * this.Size
	}
	get width() {
		return Math.sqrt(3) * this.Size
	}


	/**Get two common points for two hexas */
	getCommonPoints(hexaFrom, hexaTo) {
		return hexaFrom.Points.filter(f => hexaTo.Points.some(t => t.X.toFixed(8) == f.X.toFixed(8) && t.Y.toFixed(8) == f.Y.toFixed(8)))
	}
}