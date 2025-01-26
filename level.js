import { boolRectCircleColliding } from "./boolRectCircleCollide.js"
import { canvasHeight, canvasWidth } from "./definitions.js"
import { Rectangle } from "./rectangle.js"
import { getAreaCovered } from "./utils.js"

export class Level {
  constructor({ ctx, canvasCoords, id, initRects, circles, winPercentage }) {
    this.id = id
    /** @type {CanvasRenderingContext2D} */
    this.ctx = ctx
    this.canvasCoords = canvasCoords
    this.rectangles = initRects || []
    this.rectanglesCount = 0
    this.circles = circles

    this.previewRect = null

    this.areaCovered = "0%"
    this.areaNeededToWin = winPercentage

    this.levelLost = false
    this.leveWin = false

    this.boundListeners = false
  }

  //xScale and yScale allow for canvas to not strictly be 800x600
  //try to not set any canvas width or height??
  mousedown = e => {
    const xScale = this.canvasCoords.width / canvasWidth
    const yScale = this.canvasCoords.height / canvasHeight

    const rx = (e.x - this.canvasCoords.left) / xScale
    const ry = (e.y - this.canvasCoords.top) / yScale

    this.previewRect = new Rectangle({ x: rx, y: ry, w: 0, h: 0 }, "green")
  }
  mousemove = e => {
    if (!this.previewRect) return
    const xScale = this.canvasCoords.width / canvasWidth
    const yScale = this.canvasCoords.height / canvasHeight
    const rw = e.x - this.canvasCoords.left - this.previewRect.coords.x * xScale
    const rh = e.y - this.canvasCoords.top - this.previewRect.coords.y * yScale
    console.log({ x: this.previewRect.coords.x, y: this.previewRect.coords.y, w: rw, h: rh })

    this.previewRect = new Rectangle(
      { x: this.previewRect.coords.x, y: this.previewRect.coords.y, w: rw, h: rh },
      "green"
    )
  }
  mouseup = () => {
    if (!this.previewRect) return

    const rw = Math.abs(this.previewRect.coords.w)
    const rh = Math.abs(this.previewRect.coords.h)
    const rx = this.previewRect.coords.w > 0 ? this.previewRect.coords.x : this.previewRect.coords.x - rw
    const ry = this.previewRect.coords.h > 0 ? this.previewRect.coords.y : this.previewRect.coords.y - rh

    const bigEnoughRect = rw > 5 && rh > 5
    if (bigEnoughRect) {
      const newRect = new Rectangle({ x: rx, y: ry, w: rw, h: rh }, "red")
      this.rectangles.push(newRect)
      console.log("NEW RECT ADDED:", newRect)
    }
    this.previewRect = null
  }

  // Can move into a Controls class if this file gets bloated
  bindEventListeners() {
    if (this.boundListeners) return
    this.boundListeners = true
    document.addEventListener("mousedown", this.mousedown)
    document.addEventListener("mousemove", this.mousemove)
    document.addEventListener("mouseup", this.mouseup)
  }

  removeEventListeners() {
    document.removeEventListener("mousedown", this.mousedown)
    document.removeEventListener("mousemove", this.mousemove)
    document.removeEventListener("mouseup", this.mouseup)
  }

  // Level lost if colliding
  checkPreviewRectCollision() {
    if (!this.previewRect) return

    const collisionRw = Math.abs(this.previewRect.coords.w)
    const collisionRh = Math.abs(this.previewRect.coords.h)
    const collisionRx =
      this.previewRect.coords.w > 0 ? this.previewRect.coords.x : this.previewRect.coords.x - collisionRw
    const collisionRy =
      this.previewRect.coords.h > 0 ? this.previewRect.coords.y : this.previewRect.coords.y - collisionRh

    let loseLevel = this.circles.some(c =>
      boolRectCircleColliding(c.coords, { x: collisionRx, y: collisionRy, w: collisionRw, h: collisionRh })
    )

    this.levelLost = this.levelLost || loseLevel
  }

  checkWinLevel() {
    if (Number(this.areaCovered) > this.areaNeededToWin) this.leveWin = true
  }

  drawRectangles() {
    this.rectangles.forEach(r => r.draw(this.ctx))
  }

  drawPreviewRect() {
    if (!this.previewRect) return
    this.previewRect.draw(this.ctx)
  }

  updateCircles(elapsed) {
    this.circles.forEach(c => c.update(this.rectangles, elapsed))
  }

  updateAreaCovered() {
    if (this.rectanglesCount < this.rectangles.length) {
      this.rectanglesCount = this.rectangles.length
      this.areaCovered = getAreaCovered(this.ctx)
    }
  }

  // Pass this to game class
  drawUI() {
    this.ctx.fillStyle = "white"
    this.ctx.font = "bold 20px serif"
    this.ctx.fillText(`Lvl: ${this.id}`, canvasWidth - 100, 40)
    this.ctx.fillText(`Area: ${this.areaCovered}% / ${this.areaNeededToWin}%`, 10, 40)
  }

  update(elapsed) {
    this.checkWinLevel()
    this.updateCircles(elapsed)
    this.drawRectangles()
    this.drawPreviewRect()
    this.checkPreviewRectCollision()
    this.updateAreaCovered()
    this.drawUI()
  }
}
