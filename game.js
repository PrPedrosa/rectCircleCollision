import { canvasHeight, canvasWidth } from "./definitions.js"
import { createLevels } from "./levelsConfig.js"
import { SwitchLvlAnimation } from "./switchLvlAnimation.js"

// ### possible difficulty factors ###
// have max num of rectangles on levels
// balls go faster and bigger (random switching on direction/speed) / ++speed per circle bounce
// have init rectangles
// different percentages to complete level
// time limit to complete level
// make circle to circle collision?

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
    // time last frame took to render
    this.elapsedInSeconds = 0

    this.levels = createLevels(this.ctx, this.canvasCoords)
    this.totalLevels = this.levels.length
    this.lastLevelId = this.levels[this.levels.length - 1].id
    this.currentLevel = null

    this.gameOver = false
    this.wonGame = false

    this.switchLvlAnimation = new SwitchLvlAnimation(this)
  }

  isLastLevel = level => level?.id === this.lastLevelId

  checkGameOutcome() {
    this.gameOver = !!this.currentLevel?.levelLost
    this.wonGame = !this.levels.length && !!this.currentLevel?.leveWin
  }

  updateTimers(timestamp) {
    if (this.timestamp === null) this.timestamp = timestamp
    this.elapsedInSeconds = (timestamp - this.timestamp) / 1000
    this.timestamp = timestamp
    this.time += this.elapsedInSeconds
  }

  start() {
    this.currentLevel = this.levels[0]
    this.currentLevel.bindEventListeners()
    this.levels.shift()
    requestAnimationFrame(this.update)
  }

  update = timestamp => {
    if (!this.currentLevel) throw new Error("No level to animate")
    this.updateTimers(timestamp)

    // Handle game over and game won
    this.checkGameOutcome()
    if (this.gameOver || this.wonGame) {
      console.log({ LOST: this.gameOver, WON: this.wonGame })
      cancelAnimationFrame(this.animating)
      this.animating = 0
      return
    }

    // clear canvas and actually play the level
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    if (!this.switchLvlAnimation.active) {
      this.currentLevel.update(this.elapsedInSeconds)
    }

    // handles level switching
    this.switchLvlAnimation.update()

    this.animating = requestAnimationFrame(this.update)
  }
}
