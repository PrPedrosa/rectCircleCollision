import { canvasHeight, canvasWidth } from "./definitions.js"
import { createLevels } from "./levelsConfig.js"

// ### possible difficulty factors ###
// have max num of rectangles on levels
// balls go faster and bigger (random switching on direction/speed)
// have init rectangles
// different percentages to complete level

// make circle to circle collision?
// DO SWITCHING LEVELS LOGIC
// do next level button and win level logic
export class Game {
  constructor(ctx, canvas) {
    this.ctx = ctx
    this.canvas = canvas
    this.canvasCoords = this.canvas.getBoundingClientRect()
    this.animating = 0
    // current level is first on array
    this.levels = createLevels(this.ctx, this.canvasCoords)

    this.gameOver = false
  }

  isGameOver() {
    // testing stop when win
    //if (this.levels[0].leveWin) this.gameOver = true
    if (this.levels.some(l => l.levelLost)) this.gameOver = true
  }

  // WHEN CHANGING LVLS, remember to REMOVE AND bindEventListeners on new level again!!
  // Search if binding same listeners replaces old!!! no need to remove if so
  start() {
    this.levels[0].bindEventListeners()
    this.update()
  }

  // arrow fn as it needs to call itself, so the "this" context is lost?
  update = () => {
    if (!this.levels[0]) throw new Error("No level to animate")

    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    this.levels[0].update()

    this.isGameOver()
    if (this.gameOver) return cancelAnimationFrame(this.animating)
    this.animating = requestAnimationFrame(this.update)
  }
}
