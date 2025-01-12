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
    this.timestamp = null
    this.time = 0
    // current level is first on array
    this.levels = createLevels(this.ctx, this.canvasCoords)

    this.gameOver = false
    this.wonGame = false
  }

  checkGameOutcome() {
    this.gameOver = this.levels.some(l => l.levelLost)
    this.wonGame = this.levels[0].leveWin
  }

  // WHEN CHANGING LVLS, remember to REMOVE AND bindEventListeners on new level again!!
  // Search if binding same listeners replaces old!!! no need to remove if so
  start() {
    this.levels[0].bindEventListeners()
    requestAnimationFrame(this.update)
  }

  // arrow fn as it needs to call itself, sooo "this" context is lost??
  update = timestamp => {
    if (!this.levels[0]) throw new Error("No level to animate")

    this.checkGameOutcome()
    if (this.gameOver || this.wonGame) {
      console.log({ LOST: this.gameOver, WON: this.wonGame })
      cancelAnimationFrame(this.animating)
      this.animating = 0
      return
    }

    if (this.timestamp === null) this.timestamp = timestamp
    const elapsedInSeconds = (timestamp - this.timestamp) / 1000
    this.timestamp = timestamp
    this.time += elapsedInSeconds
    console.log("TIME FROM START:", `${Math.trunc(this.time)}s`)

    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    this.levels[0].update(elapsedInSeconds)

    this.animating = requestAnimationFrame(this.update)
  }
}
