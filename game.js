import {
  canvasHeight,
  canvasWidth,
  SWITCH_LVL_ANIMATION_COLOR,
  SWITCH_LVL_ANIMATION_FONT,
  SWITCH_LVL_ANIMATION_TIMER,
} from "./definitions.js"
import { createLevels } from "./levelsConfig.js"
import { fillText } from "./utils.js"

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
    // time last frame took to render
    this.elapsedInSeconds = 0

    this.levels = createLevels(this.ctx, this.canvasCoords)
    this.lastLevelId = this.levels[this.levels.length - 1].id
    this.currentLevel = null

    this.gameOver = false
    this.wonGame = false

    this.switchLvlCountdown = 0
    this.isSwitchingLvls = false
  }

  isLastLevel = level => level?.id === this.lastLevelId

  checkGameOutcome() {
    this.gameOver = !!this.currentLevel?.levelLost
    this.wonGame = !this.levels.length && !!this.currentLevel?.leveWin
  }

  drawSwitchLvlCountdown() {
    const countdown = Math.ceil(SWITCH_LVL_ANIMATION_TIMER - this.switchLvlCountdown)
    this.switchLvlCountdown += this.elapsedInSeconds
    fillText(
      this.ctx,
      countdown,
      SWITCH_LVL_ANIMATION_COLOR,
      SWITCH_LVL_ANIMATION_FONT,
      canvasWidth / 2,
      canvasHeight / 2
    )
  }

  switchLevel() {
    this.isSwitchingLvls = false
    this.currentLevel.removeEventListeners()

    this.currentLevel = this.levels[0]
    this.levels.shift()
    this.currentLevel.bindEventListeners()

    this.switchLvlCountdown = 0
  }

  switchLevelAnimation() {
    if (this.isLastLevel(this.currentLevel) && this.isSwitchingLvls) {
      throw new Error("No level to switch to")
    }
    if (this.currentLevel.leveWin && !this.isLastLevel(this.currentLevel)) {
      this.isSwitchingLvls = true
    }

    if (this.isSwitchingLvls) this.drawSwitchLvlCountdown()

    // actual switch levels when switchLvlCountdown over
    if (this.switchLvlCountdown > SWITCH_LVL_ANIMATION_TIMER) this.switchLevel()
  }

  start() {
    this.currentLevel = this.levels[0]
    this.currentLevel.bindEventListeners()
    this.levels.shift()
    requestAnimationFrame(this.update)
  }

  // arrow fn as it needs to call itself, sooo "this" context is lost??
  update = timestamp => {
    if (!this.currentLevel) throw new Error("No level to animate")

    if (this.timestamp === null) this.timestamp = timestamp
    this.elapsedInSeconds = (timestamp - this.timestamp) / 1000
    this.timestamp = timestamp
    this.time += this.elapsedInSeconds

    this.checkGameOutcome()
    if (this.gameOver || this.wonGame) {
      console.log({ LOST: this.gameOver, WON: this.wonGame })
      cancelAnimationFrame(this.animating)
      this.animating = 0
      return
    }

    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    if (!this.isSwitchingLvls && this.currentLevel) {
      this.currentLevel.update(this.elapsedInSeconds)
    }
    this.switchLevelAnimation()

    this.animating = requestAnimationFrame(this.update)
  }
}
