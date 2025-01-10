import { canvasHeight, canvasWidth } from "./definitions.js"
import { Game } from "./game.js"

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas")
console.log("canvas", canvas)
canvas.width = canvasWidth
canvas.height = canvasHeight

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d", { willReadFrequently: true }) // test "with/without" flag, console warnings "without"

let myAnim

const game = new Game(ctx, canvas)
function updateCanvas() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  ctx.fillStyle = "white"
  ctx.fillRect(0, canvasHeight / 2, canvasWidth, 1)
  ctx.fillRect(canvasWidth / 2, 0, 1, canvasHeight)

  game.update()

  myAnim = requestAnimationFrame(updateCanvas)
}

document.addEventListener("dblclick", () => {
  if (!myAnim) {
    requestAnimationFrame(updateCanvas)
    return
  }
  cancelAnimationFrame(myAnim)
  myAnim = null
})
