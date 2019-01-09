import { paper } from 'paper'
import HexagonBuilder from './builder'
import * as _ from './point'
import Labirint from './core'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

var canvas = document.getElementById('c')
paper.setup(canvas)


let layers = 10
let side = Math.min(canvas.clientWidth, canvas.clientHeight)/(layers*4 )
let speed = 10
let backColor = '#f55'
let borderColor = '#900'
let borderWidth = 2
let maxStepsCont = 35

// Path params
let pathWidth = 5

let center = new _.Point(canvas.offsetWidth / 2, canvas.offsetHeight / 2)
let builder = new HexagonBuilder(center.X, center.Y, side)

let lab = new Labirint(builder, layers, maxStepsCont)
let renderedSegments = []
let renderedHexa = []
let resultPath = new paper.Path()
let curentTarget


lab.build()

renderGrid()

/**Render hexagon with back color and segments */
async function renderHexa(hexa, previousHexa) {

	if(renderedHexa.includes(hexa.key)){
		return
	}
	renderedHexa.push(hexa.key)

	let paperHexa = new paper.Path()
	paperHexa.fillColor = backColor
	paperHexa.onMouseEnter = function () {
		curentTarget = hexa.key
		buildPath(hexa)
	}
	for (let i = 0; i < 6; i++) {
		paperHexa.add(new paper.Point(hexa.Points[i].X, hexa.Points[i].Y))
	}

	renderedSegments[hexa.key] = []
	for (let i = 0; i < 6; i++) {
		let a = hexa.Points[i]
		let b = hexa.Points[(i + 1) % 6]
		
		renderedSegments[hexa.key].push(new paper.Path.Line({
			from: [a.X, a.Y],
			to: [b.X, b.Y],
			strokeColor: borderColor,
			strokeWidth: borderWidth,
			strokeCap: 'round'
		}))

	}
	removeSegments(hexa, previousHexa)	
	await delay(speed)
}
async function renderGrid(){
	let previousHexa
	for (const labitem of lab.labirint) {
		const hexa = builder.HexaStore[labitem]
		await renderHexa(hexa, previousHexa)	
		previousHexa = hexa	
	}
}

/**Remove (hide) segment between two hexas */
function removeSegments(hexaFrom, hexaTo) {
	if(!hexaTo){
		return
	}
	let commonPoints = builder.getCommonPoints(hexaFrom, hexaTo)
	if(!commonPoints.length){
		return
	}
	let segmentsFrom = renderedSegments[hexaFrom.key]
	let segmentsTo = renderedSegments[hexaTo.key]
	let filterFunction = f => f.segments.every(s => commonPoints.some(c => c.X.toFixed(8) == s.point.x.toFixed(8) && c.Y.toFixed(8) == s.point.y.toFixed(8)));

	[segmentsFrom, segmentsTo].forEach(segments => {
		let segment = segments.filter(filterFunction)[0]
		segment.strokeColor = backColor
		segment.sendToBack()
	})
}

async function buildPath(targetHexa) {
	resultPath.removeSegments()
	resultPath = new paper.Path()
	let path = lab.findPath(builder.getHexaAtPoint(0,0), targetHexa)

	resultPath.strokeColor = '#000'
	resultPath.strokeWidth = pathWidth
	resultPath.strokeJoin = 'round'

	for (let index = 0; index < path.length; index++) {
		let h = path[index]
		await delay(10)
		if(curentTarget != targetHexa.key){
			return
		}
		resultPath.add(new paper.Point(h.Center.X, h.Center.Y))
		resultPath.smooth({ type: 'catmull-rom', factor: 0.5 })
	}	
}
