import { canvasHeight, canvasWidth } from "./definitions.js"
import { Game } from "./game.js"

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas")
canvas.width = canvasWidth
canvas.height = canvasHeight

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d", { willReadFrequently: true }) // test "with/without" flag, console warnings "without"

const startBtn = document.getElementById("start")
startBtn.addEventListener("click", e => {
  const game = new Game(ctx, canvas)
  game.start()
})
