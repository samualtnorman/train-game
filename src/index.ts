import Background0 from "./assets/background_0.png"
import Background1 from "./assets/background_1.png"
import ButtonMap from "./assets/button_map.png"
import ButtonTick from "./assets/button_tick.png"
import ButtonRed from "./assets/button_red.png"
import ButtonRedHover from "./assets/button_red_hover.png"
import CarriageBlue from "./assets/carriage_blue.png"
import CarriageGreen from "./assets/carriage_green.png"
import Logo from "./assets/logo.png"
import Map from "./assets/map.png"
import StationBournmouth from "./assets/station_bournmouth.png"
import StationEastleigh from "./assets/station_eastleigh.png"
import StationFareham from "./assets/station_fareham.png"
import StationPortsmouth from "./assets/station_portsmouth.png"
import StationSouthampton from "./assets/station_southampton.png"
import StationWaterlooville from "./assets/station_waterlooville.png"
import TrainBlue from "./assets/train_blue.png"
import TrainGreen from "./assets/train_green.png"
import Music from "./assets/music.mp3"

interface LooseObject<value = any> {
	[key: string]: value
}

const body = document.getElementsByTagName("body")[0]
const canvas = body.appendChild(document.createElement("canvas"))
const context = canvas.getContext("2d")

body.style.margin = "0"
// body.style.backgroundColor = "grey"

canvas.height = 180
canvas.width = 320

// canvas.style.backgroundColor = "white"
canvas.style.display = "block"
canvas.style.imageRendering = "crisp-edges"
canvas.style.marginLeft = "auto"
canvas.style.marginRight = "auto"

let scale = 1

onresize = () => {
	scale = Math.min(window.innerHeight / canvas.height, window.innerWidth / canvas.width)

	scale = scale > 1 ? Math.floor(scale) : scale

	canvas.style.height = canvas.height * scale + "px"
	canvas.style.width = canvas.width * scale + "px"
}

class Sprite extends Image {
	locX = 0
	locY = 0
	priority: number
	visible = true

	constructor(src: string, priority = 0) {
		super()
		this.src = src
		this.priority = priority
	}

	draw() {
		this.visible && context?.drawImage(this, this.locX, this.locY)
	}
}

const sprites: Sprite[] = []

const mouse = { left: false, right: false, middle: false, x: 0, y: 0 }

//

if (context)
	context.imageSmoothingEnabled = false

let currentStation = "fareham"

const trainSprite = createSprite(TrainGreen, 2, 130, 105)
const stationSprite = createSprite(StationFareham, 1)
const backgroundSprite0 = createSprite(Background0, 0, canvas.width)
const backgroundSprite1 = createSprite(Background1, 0, canvas.width * 2)
const buttonMapSprite = createSprite(ButtonMap, 2, 1, 1)
const mapSprite = createSprite(Map, 3)
const buttonBouSprite = createSprite(ButtonRed, 4, 75, 99)
const buttonSouSprite = createSprite(ButtonRed, 4, 147, 48)
const buttonEasSprite = createSprite(ButtonRed, 4, 161, 28)
const buttonFarSprite = createSprite(ButtonRed, 4, 223, 83)
const buttonWatSprite = createSprite(ButtonRed, 4, 272, 47)
const buttonPorSprite = createSprite(ButtonRed, 4, 258, 101)
const buttonRedHoverSprite = createSprite(ButtonRedHover)

mapSprite.visible = false
buttonBouSprite.visible = false
buttonSouSprite.visible = false
buttonEasSprite.visible = false
buttonFarSprite.visible = false
buttonWatSprite.visible = false
buttonPorSprite.visible = false
buttonRedHoverSprite.visible = false

const audio = new Audio(Music)
audio.loop = true
audio.volume = 0.1
audio.play()

//
 
onresize()
gameLoop()
drawLoop()

function drawLoop() {
	if (context) {
		sprites.sort((a, b) => a.priority - b.priority)
		context.clearRect(0, 0, canvas.width, canvas.height)

		for (const sprite of sprites)
			sprite.draw()
	}

	requestAnimationFrame(drawLoop)
}

function gameLoop() {
	// trainSprite.locX = (i++ % 420) - 100

	//trainSprite.locX = Math.round((mouse.x - canvas.offsetLeft) / scale)

	setTimeout(gameLoop)
}

canvas.oncontextmenu = () => false

canvas.onmousedown = event => {
	switch (event.button) {
		case 0:
			mouse.left = true
			break
		case 1:
			mouse.middle = true
			break
		case 2:
			mouse.right = true
			break
		default:
			console.error(`unknown mouse button ${event.button}`)
	}

	mouse.x = (event.clientX - canvas.offsetLeft) / scale
	mouse.y = (event.clientY - canvas.offsetTop) / scale
	audio.play()
}

canvas.onmouseup = event => {
	switch (event.button) {
		case 0:
			mouse.left = false
			break
		case 1:
			mouse.middle = false
			break
		case 2:
			mouse.right = false
			break
		default:
			console.error(`unknown mouse button ${event.button}`)
	}

	mouse.x = (event.clientX - canvas.offsetLeft) / scale
	mouse.y = (event.clientY - canvas.offsetTop) / scale

	console.log(mouse.x, mouse.y)

	if (mouse.x > 1 && mouse.x < 33 && mouse.y > 1 && mouse.y < 33) {
		mapSprite.visible = true
		buttonBouSprite.visible = true
		buttonSouSprite.visible = true
		buttonEasSprite.visible = true
		buttonFarSprite.visible = true
		buttonWatSprite.visible = true
		buttonPorSprite.visible = true
	}
}

canvas.onmousemove = event => {
	mouse.x = (event.clientX - canvas.offsetLeft) / scale
	mouse.y = (event.clientY - canvas.offsetTop) / scale

	if (mouse.left) {
		let movement = Math.round(event.movementX / scale)

		trainSprite.locX += movement
		stationSprite.locX += movement
		backgroundSprite0.locX += movement
		backgroundSprite1.locX += movement
		
		if (backgroundSprite0.locX < -canvas.width)
			backgroundSprite0.locX += canvas.width * 2
		
		if (backgroundSprite1.locX < -canvas.width)
			backgroundSprite1.locX += canvas.width * 2

		if (backgroundSprite0.locX > canvas.width)
			backgroundSprite0.locX -= canvas.width * 2
		
		if (backgroundSprite1.locX > canvas.width)
			backgroundSprite1.locX -= canvas.width * 2
	}
}

function createSprite(src: string, priority = 0, x = 0, y = 0) {
	const sprite = new Sprite(src, priority)
	sprite.locX = x
	sprite.locY = y

	sprites.push(sprite)

	return sprite
}
