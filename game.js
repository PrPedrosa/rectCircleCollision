import { canvasHeight, canvasWidth } from "./definitions.js"
import { createLevels } from "./levelsConfig.js"

// ### possible difficulty factors ###
// have max num of rectangles on levels
// balls go faster and bigger (random switching on direction/speed) / ++speed per circle bounce
// have init rectangles
// different percentages to complete level
// time limit to complete level

// make circle to circle collision?
// DO SWITCHING LEVELS LOGIC
// do next level button and win level logic
export class Game {
  constructor(ctx, canvas) {
    /** @type {CanvasRenderingContext2D} */
    this.ctx = ctx
    this.canvas = canvas
    this.canvasCoords = this.canvas.getBoundingClientRect()
    this.animating = 0
    this.timestamp = null
    this.time = 0

    this.levels = createLevels(this.ctx, this.canvasCoords)
    this.currentLevel = null

    this.gameOver = false
    this.wonGame = false
  }

  checkGameOutcome() {
    this.gameOver = this.currentLevel?.levelLost
    this.wonGame = this.currentLevel?.leveWin
  }

  // WHEN CHANGING LVLS, remember to REMOVE AND bindEventListeners on new level again!!
  // Search if binding same listeners replaces old!!! no need to remove if so
  start() {
    this.currentLevel = this.levels[0]
    this.currentLevel.bindEventListeners()
    this.levels.shift()
    requestAnimationFrame(this.update)
  }

  startLevelAnimation() {}

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

    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    this.currentLevel.update(elapsedInSeconds)

    this.animating = requestAnimationFrame(this.update)
  }
}
