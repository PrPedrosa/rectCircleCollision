import {
  canvasHeight,
  canvasWidth,
  SWITCH_LVL_ANIMATION_COLOR,
  SWITCH_LVL_ANIMATION_FONT,
  SWITCH_LVL_ANIMATION_TIMER,
} from "./definitions.js"
import { fillText } from "./utils.js"

// do like a sequence with all levels and animation is scratching off the old level and going to new one
export class SwitchLvlAnimation {
  constructor(game) {
    this.game = game
    this.switchLvlCountdown = 0
    this.active = false
    this.goTimer = 0
  }

  drawSwitchLvlCountdown() {
    const countdown = Math.ceil(SWITCH_LVL_ANIMATION_TIMER - this.switchLvlCountdown)
    this.switchLvlCountdown += this.game.elapsedInSeconds
    fillText(
      this.game.ctx,
      countdown,
      SWITCH_LVL_ANIMATION_COLOR,
      SWITCH_LVL_ANIMATION_FONT,
      canvasWidth / 2,
      canvasHeight / 2
    )
  }

  switchLevel() {
    this.active = false
    this.game.currentLevel.removeEventListeners()

    this.game.currentLevel = this.game.levels[0]
    this.game.levels.shift()
    this.game.currentLevel.bindEventListeners()

    this.switchLvlCountdown = 0
    this.goTimer++
  }

  switchLevelAnimation() {
    if (this.game.isLastLevel(this.game.currentLevel) && this.game.isSwitchingLvls) {
      throw new Error("No level to switch to")
    }

    if (this.active) this.drawSwitchLvlCountdown()

    // actual switch levels when switchLvlCountdown over
    if (this.switchLvlCountdown > SWITCH_LVL_ANIMATION_TIMER) this.switchLevel()
  }

  update() {
    if (this.goTimer) {
      this.goTimer++
      if (this.goTimer >= 120) this.goTimer = 0
      else
        fillText(
          this.game.ctx,
          "GO",
          SWITCH_LVL_ANIMATION_COLOR,
          SWITCH_LVL_ANIMATION_FONT,
          canvasWidth / 2,
          canvasHeight / 2
        )
    }
    this.active = this.game.currentLevel.leveWin && !this.game.isLastLevel(this.game.currentLevel)
    if (this.active) {
      this.switchLevelAnimation()
    }
  }
}
