import Train from "./images/train.png"

const body = document.getElementsByTagName("body")[0]
const canvas = body.appendChild(document.createElement("canvas"))
const context = canvas.getContext("2d")

body.style.margin = "0"
body.style.backgroundColor = "grey"

canvas.height = 180
canvas.width = 320

canvas.style.backgroundColor = "white"
canvas.style.display = "block"
canvas.style.imageRendering = "crisp-edges"

const mouse = { left: false, right: false, middle: false, x: 0, y: 0 }
const train = new Image

train.src = Train

let i = 0

onresize()
gameLoop()
drawLoop()

function drawLoop() {
	if (context) {
		context.clearRect(0, 0, canvas.width, canvas.height)
		context.drawImage(train, (i % 420) - 100, 0)
	}

	requestAnimationFrame(drawLoop)
}

function gameLoop() {
	i++

	setTimeout(gameLoop)
}

function onresize() {
	const scale = Math.max(Math.min(Math.floor(window.innerHeight / canvas.height), Math.floor(window.innerWidth / canvas.width)), 1)

	canvas.style.height = canvas.height * scale + "px"
	canvas.style.width = canvas.width * scale + "px"
}
