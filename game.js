import { canvasHeight, canvasWidth, SWITCH_LVL_ANIMATION_TIMER } from "./definitions.js"
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

    this.countdown = 0
    this.isSwitchingLvls = false
  }

  checkGameOutcome() {
    this.gameOver = this.currentLevel?.levelLost ?? false
    if (this.currentLevel.leveWin /* && this.levels.length */) {
      this.isSwitchingLvls = true
    }
  }

  switchLevelAnimation(elapsed) {
    // if no more levels, won game
    if (!this.levels[0]) {
      this.wonGame = true
      cancelAnimationFrame(this.update)
      this.animating = 0
      return
    }

    // DRAW COUNTDOWN
    if (this.isSwitchingLvls) {
      const countdown = Math.ceil(3 - this.countdown)
      this.countdown += elapsed
      this.ctx.fillStyle = "white"
      this.ctx.font = "bold 34px serif"
      this.ctx.fillText(countdown, canvasWidth / 2, canvasHeight / 2)
    }

    // actual switch levels when countdown over
    if (this.countdown > SWITCH_LVL_ANIMATION_TIMER) {
      this.isSwitchingLvls = false
      this.currentLevel.removeEventListeners()

      this.currentLevel = this.levels[0]
      this.levels.shift()
      this.currentLevel.bindEventListeners()

      this.countdown = 0
    }
  }

  // WHEN CHANGING LVLS, remember to REMOVE AND bindEventListeners on new level again!!
  // Search if binding same listeners replaces old!!! no need to remove if so
  start() {
    this.currentLevel = this.levels[0]
    this.currentLevel.bindEventListeners()
    this.levels.shift()
    requestAnimationFrame(this.update)
  }

  // arrow fn as it needs to call itself, sooo "this" context is lost??
  update = timestamp => {
    if (!this.currentLevel) throw new Error("No level to animate")

    this.checkGameOutcome()
    if (this.gameOver) {
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
    if (!this.isSwitchingLvls && this.currentLevel) {
      this.currentLevel.update(elapsedInSeconds)
    }
    this.switchLevelAnimation(elapsedInSeconds)

    this.animating = requestAnimationFrame(this.update)
  }
}
