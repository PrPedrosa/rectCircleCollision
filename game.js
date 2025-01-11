import { canvasHeight, canvasWidth } from "./definitions.js"
import { createLevels } from "./levelsConfig.js"

export class Game {
  constructor(ctx, canvas) {
    this.ctx = ctx
    this.canvas = canvas
    this.canvasCoords = this.canvas.getBoundingClientRect()
    this.animating = 0
    this.levels = createLevels(this.ctx, this.canvasCoords)
    //this.currentLevel = null

    this.gameOver = false
  }

  isGameOver() {
    if (this.levels.some(l => l.levelLost)) this.gameOver = true
  }

  drawCurrentLvl() {
    this.ctx.fillStyle = "white"
    this.ctx.font = "bold 20px serif"
    this.ctx.fillText(`Lvl: ${this.levels[0].id}`, canvasWidth - 100, 40)
  }

  start() {
    this.update()
  }
  // arrow fn as it needs to call itself, so "this" context is lost?
  update = () => {
    if (!this.levels[0]) throw new Error("No level to animate")

    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    this.drawCurrentLvl()
    this.levels[0].update()

    this.isGameOver()
    if (this.gameOver) return cancelAnimationFrame(this.animating)
    this.animating = requestAnimationFrame(this.update)
  }
}
