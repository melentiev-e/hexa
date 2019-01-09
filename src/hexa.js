import * as _ from './point'

export default class Hexagon {
	constructor(xP, yP, size, xCoord, yCoord) {
		this.Size = size
		this.Center = new _.Point(xP, yP)
		this.Coord = new _.Point(xCoord, yCoord)
		this.Points = []
		this.fillPoints()
	}

	fillPoints() {
		for (let i = 0; i < 6; i++) {
			this.Points.push(this.getHexPoint(i))
		}
	}

	fillSegments() {
		for (let i = 0; i < 6; i++) {
			let a = i % 6
			let b = (i + 1) % 6

			let pointA = this.getHexPoint(a)
			let pointB = this.getHexPoint(b)
			this.Segments.push(new _.Segment(pointA, pointB))
		}
	}
	get key() {
		return this.Coord.key
	}
	get height() {
		return 2 * this.Size
	}
	get width() {
		return Math.sqrt(3) * this.Size
	}

	getHexPoint(i) {
		let angleDeg = 60 * i - 30
		let angleRad = Math.PI / 180 * angleDeg
		return new _.Point(this.Center.X + this.Size * Math.cos(angleRad), this.Center.Y + this.Size * Math.sin(angleRad))
	}
}