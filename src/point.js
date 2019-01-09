export { Point, Segment }


class Point{
	constructor (x,y){
		this.X = x
		this.Y = y
	}

	static Eqauls (a,b){
		return a.X == b.X && a.Y == b.Y
	}
	get key(){
		return `${this.X},${this.Y}`
	}
}


class Segment {

	/**
    * New Segment
    * @param {Point} a Start point 
    * @param {Point} b End point
    */
	constructor (a,b){
		this.A = a
		this.B = b
	}
	get key(){
		return `${this.A.key}#${this.B.key}`
	}
	static Eqauls (first, second){
		return first.key == second.key

	}
}