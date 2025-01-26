//import { canvasHeight, canvasWidth } from "./definitions.js"
import { canvas } from "./definitions.js"
import { Game } from "./game.js"

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d", { willReadFrequently: true }) // test "with/without" flag, console warnings "without"

let game = null
const startBtn = document.getElementById("start")
startBtn.addEventListener("click", _ => {
  //start
  if (!game) {
    game = new Game(ctx, canvas)
    game.start()
    startBtn.textContent = "STOP"
    return
  }
  // stop
  if (game && game.animating) {
    startBtn.textContent = "RESTART"
    cancelAnimationFrame(game.animating)
    game = null
  }
})
