import "./style.css"

import MusicStation from "./assets/music_station.mp3"
import MusicMap from "./assets/music_map.mp3"
import Background0 from "./assets/background_0.png"
import Background1 from "./assets/background_1.png"
import ButtonMap from "./assets/button_map.png"
import ButtonTick from "./assets/button_tick.png"
import ButtonRed from "./assets/button_red.png"
import ButtonRedHover from "./assets/button_red_hover.png"
import ButtonGo from "./assets/button_go.png"
import ButtonStart from "./assets/button_start.png"
import ButtonHelp from "./assets/button_help.png"
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
import Coin from "./assets/coin.png"
import MenuMain from "./assets/menu_main.png"
import MenuHelp from "./assets/menu_help.png"
import MenuTrain from "./assets/menu_train.png"

interface LooseObject<value = any> {
	[key: string]: value
}

const body = document.getElementsByTagName("body")[0]
const canvas = body.appendChild(document.createElement("canvas"))
const context = canvas.getContext("2d")

body.style.margin = "0"

canvas.height = 180
canvas.width = 320

canvas.style.display = "block"
canvas.style.imageRendering = "crisp-edges"
canvas.style.marginLeft = "auto"
canvas.style.marginRight = "auto"
canvas.style.imageRendering = "-webkit-optimize-contrast"
canvas.style.imageRendering = "optimize-contrast"
canvas.style.imageRendering = "pixelated"

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

	testOverlapPoint(x: number, y: number) {
		return x > this.locX && x < this.locX + this.width && y > this.locY && y < this.locY + this.height
	}
}

class Station {
	stationSpriteSrc: string
	mapSprite: Sprite
	people: number
	train: Train | null = null

	constructor(sprite: string, x: number, y: number) {
		this.stationSpriteSrc = sprite
		this.mapSprite = createSprite(ButtonRed, 4, x, y)
		this.mapSprite.visible = false
		this.people = Math.floor(Math.random() * 11)
	}
}

class Train {
	spriteSrc: string
	passengers = 0
	destination: Station | null = null
	destinationProgress = 0
	carriages = 2

	constructor(src: string) {
		this.spriteSrc = src
	}
}

const sprites: Sprite[] = []

const mouse = { left: false, right: false, middle: false, x: 0, y: 0 }

//

let money = 300

const stations: LooseObject<Station> = {
	fareham: new Station(StationFareham, 223, 83),
	bournmouth: new Station(StationBournmouth, 75, 99),
	eastleigh: new Station(StationEastleigh, 161, 28),
	waterlooville: new Station(StationWaterlooville, 272, 47),
	portsmouth: new Station(StationPortsmouth, 258, 101),
	southampton: new Station(StationSouthampton, 147, 48)
}

stations.fareham.train = new Train(TrainGreen)

if (context)
	context.imageSmoothingEnabled = false

let currentStation = stations.fareham

const trainSprite = createSprite(TrainGreen, 2, 130, 105)
const stationSprite = createSprite(StationFareham, 1)
const backgroundSprite0 = createSprite(Background0, 0, canvas.width)
const backgroundSprite1 = createSprite(Background1, 0, canvas.width * 2)
const buttonMapSprite = createSprite(ButtonMap, 2, 1, 1)
const mapSprite = createSprite(Map, 3)
const buttonRedHoverSprite = createSprite(ButtonRedHover, 5)
const buttonGoSprite = createSprite(ButtonGo, 2, 34, 1)
const coinSprite = createSprite(Coin, 3, 305, 0)
const menuSprite = createSprite(MenuMain, 5, 0, 0)
const buttonStartSprite = createSprite(ButtonStart, 6, 98, 80)
const buttonHelpSprite = createSprite(ButtonHelp, 6, 98, 112)
const menuTrain = createSprite(MenuTrain, 6, 0, 0)

const carriageSprites = [
	createSprite(CarriageGreen, 2, 40, 105),
	createSprite(CarriageGreen, 2, -37, 105)
]

mapSprite.visible = false
buttonRedHoverSprite.visible = false

const stationMusic = new Audio(MusicStation)
stationMusic.loop = true
stationMusic.volume = 0.1

const mapMusic = new Audio(MusicMap)
mapMusic.loop = true
mapMusic.volume = 0.1

let onMap = false
let onGo = false
let inGame = false

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

		if (inGame) {
			context.font = "16px Minecraft"
			context.fillText(money.toString(), 270, 16)
		}
	}

	requestAnimationFrame(drawLoop)
}

function gameLoop() {
	if (inGame) {
		for (let stationName in stations) {
			const station = stations[stationName]

			const train = station.train

			if (train?.destination) {
				train.destinationProgress += 0.0005
			}
		}

		const train = currentStation.train

		// console.log(train.destinationProgress)

		if (train?.destination) {
			stationSprite.locX -= 1
			backgroundSprite0.locX -= 1
			backgroundSprite1.locX -= 1

			if (backgroundSprite0.locX < -canvas.width)
				backgroundSprite0.locX += canvas.width * 2
			
			if (backgroundSprite1.locX < -canvas.width)
				backgroundSprite1.locX += canvas.width * 2

			if (backgroundSprite0.locX > canvas.width)
				backgroundSprite0.locX -= canvas.width * 2
			
			if (backgroundSprite1.locX > canvas.width)
				backgroundSprite1.locX -= canvas.width * 2
			
			if (train.destinationProgress >= 1) {
				currentStation.train = null
				currentStation = train.destination
				money += 100
				train.destination.train = train
				train.destination = null
				stationSprite.src = currentStation.stationSpriteSrc
				stationSprite.locX = 0
				backgroundSprite0.locX = canvas.width
				backgroundSprite1.locX = 0
				trainSprite.locX = 130

				let x = 40

				for (const carriageSprite of carriageSprites) {
					carriageSprite.locX = x
					x -= 77
				}
			}
		}
	} else {
		menuTrain.locX++

		if (menuTrain.locX > canvas.width)
			menuTrain.locX = -canvas.width
	}

	setTimeout(gameLoop)
}

canvas.oncontextmenu = event => {
	return false
}

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

	if (!inGame) {
		if (buttonStartSprite.testOverlapPoint(mouse.x, mouse.y)) {
			inGame = true
			menuTrain.visible = false
			menuSprite.visible = false
			buttonStartSprite.visible = false
			buttonHelpSprite.visible = false
		} else if (buttonHelpSprite.testOverlapPoint(mouse.x, mouse.y)) {
			menuSprite.src = MenuHelp
			buttonHelpSprite.visible = false
			buttonStartSprite.locX = 105
			buttonStartSprite.locY = 143
		}
	} else if (onMap) {
		for (const stationName in stations) {
			const station = stations[stationName]

			if (station.mapSprite.testOverlapPoint(mouse.x, mouse.y)) {
				buttonRedHoverSprite.visible = false
				
				for (const stationName in stations) {
					const station = stations[stationName]
					station.mapSprite.visible = false
				}

				currentStation = station
				backgroundSprite0.locX = canvas.width
				backgroundSprite1.locX = 0

				const train = station.train

				stationSprite.visible = true
				stationSprite.locX = 0

				if (train?.destination)
					stationSprite.visible = false
				else
					trainSprite.locX = 130

				mapSprite.visible = false
				onMap = false

				let x = 40

				for (const carriageSprite of carriageSprites) {
					carriageSprite.locX = x
					x -= 77
					carriageSprite.visible = false
				}

				if (train) {
					for (let i = 0; i < train.carriages; i++)
						carriageSprites[i].visible = true
				}
				
				break
			}
		}
	} else if (onGo) {
		for (const stationName in stations) {
			const station = stations[stationName]

			if (station.mapSprite.testOverlapPoint(mouse.x, mouse.y)) {
				buttonRedHoverSprite.visible = false
				
				for (const stationName in stations) {
					const station = stations[stationName]
					station.mapSprite.visible = false
				}

				mapSprite.visible = false
				onGo = false

				const train = currentStation.train
				
				if (train) {
					train.destination = station
					train.destinationProgress = 0
				}

				break
			}
		}
	} else if (buttonMapSprite.testOverlapPoint(mouse.x, mouse.y)) {
		mapSprite.visible = true

		for (const stationName in stations) {
			const station = stations[stationName]
			station.mapSprite.visible = true
		}

		onMap = true
	} else if (buttonGoSprite.testOverlapPoint(mouse.x, mouse.y)) {
		mapSprite.visible = true

		for (const stationName in stations) {
			const station = stations[stationName]
			station.mapSprite.visible = true
		}

		onGo = true
		// const train = currentStation.train

		// if (train) {
		// 	train.destination = stations.southampton
		// }
	}

	if (onMap || onGo) {
		stationMusic.pause()
		mapMusic.play()
	} else {
		mapMusic.pause()
		stationMusic.play()
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

		for (const carriageSprite of carriageSprites) {
			carriageSprite.locX += movement
		}
		
		if (backgroundSprite0.locX < -canvas.width)
			backgroundSprite0.locX += canvas.width * 2
		
		if (backgroundSprite1.locX < -canvas.width)
			backgroundSprite1.locX += canvas.width * 2

		if (backgroundSprite0.locX > canvas.width)
			backgroundSprite0.locX -= canvas.width * 2
		
		if (backgroundSprite1.locX > canvas.width)
			backgroundSprite1.locX -= canvas.width * 2
	}

	buttonRedHoverSprite.visible = false

	if (onMap || onGo) {
		for (const stationName in stations) {
			const station = stations[stationName]

			if (station.mapSprite.testOverlapPoint(mouse.x, mouse.y)) {
				buttonRedHoverSprite.locX = station.mapSprite.locX
				buttonRedHoverSprite.locY = station.mapSprite.locY
				buttonRedHoverSprite.visible = true
				
				if (onMap) {
					stationSprite.src = station.stationSpriteSrc

					if (station.train) {
						trainSprite.src = station.train.spriteSrc
						trainSprite.visible = true
					} else
						trainSprite.visible = false
				}

				// if (onGo) {
				// 	if (context) {
				// 		frameCallback.push(() => {
				// 			console.log("foo")
				// 			context.strokeStyle = "red"
				// 			context.beginPath()
				// 			context.moveTo(currentStation.mapSprite.locX, currentStation.mapSprite.locY)
				// 			context.lineTo(station.mapSprite.locX, station.mapSprite.locY)
				// 			context.stroke()
				// 		})
				// 	}
				// }

				break
			}
		}
	}
}

function createSprite(src: string, priority = 0, x = 0, y = 0) {
	const sprite = new Sprite(src, priority)
	sprite.locX = x
	sprite.locY = y

	sprites.push(sprite)

	return sprite
}
