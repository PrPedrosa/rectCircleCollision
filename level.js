import { boolRectCircleColliding } from "./boolRectCircleCollide.js"
import { canvasWidth } from "./definitions.js"
import { Rectangle } from "./rectangle.js"
import { getAreaCovered } from "./utils.js"

export class Level {
  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor({ ctx, canvasCoords, id, initRects, circles, winPercentage }) {
    this.id = id
    this.ctx = ctx
    this.canvasCoords = canvasCoords
    this.rectangles = initRects || []
    this.rectanglesCount = initRects.length || 0
    this.circles = circles

    this.previewRect = null

    // need to paint first to get init Rectangles area
    this.areaCovered = (() => {
      this.drawRectangles()
      return getAreaCovered(this.ctx)
    })()
    this.areaNeededToWin = winPercentage

    this.levelLost = false
    this.leveWin = false

    document.addEventListener("mousedown", e => {
      console.log("HII", this.id)
      const rx = e.x - this.canvasCoords.left
      const ry = e.y - this.canvasCoords.top
      this.previewRect = new Rectangle({ x: rx, y: ry, w: 0, h: 0 }, "green")
    })

    document.addEventListener("mousemove", e => {
      if (this.previewRect) {
        const rw = e.x - this.canvasCoords.left - this.previewRect.coords.x
        const rh = e.y - this.canvasCoords.top - this.previewRect.coords.y

        this.previewRect = new Rectangle(
          { x: this.previewRect.coords.x, y: this.previewRect.coords.y, w: rw, h: rh },
          "green"
        )
      }
    })

    document.addEventListener("mouseup", _ => {
      if (!this.previewRect) return

      const rw = Math.abs(this.previewRect.coords.w)
      const rh = Math.abs(this.previewRect.coords.h)
      const rx = this.previewRect.coords.w > 0 ? this.previewRect.coords.x : this.previewRect.coords.x - rw
      const ry = this.previewRect.coords.h > 0 ? this.previewRect.coords.y : this.previewRect.coords.y - rh

      const bigEnoughRect = rw > 5 && rh > 5
      if (!bigEnoughRect) {
        this.previewRect = null
        return
      }

      const newRect = new Rectangle({ x: rx, y: ry, w: rw, h: rh }, "red")
      this.rectangles.push(newRect)
      console.log("NEW RECT ADDED:", this.previewRect)
      this.previewRect = null
    })
  }

  bindEventListeners() {}

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
    if (loseLevel) console.log("LOOOOOOOST PREVIEWWWW")

    this.levelLost = this.levelLost || loseLevel
  }

  drawRectangles() {
    this.rectangles.forEach(r => r.draw(this.ctx))
  }

  drawPreviewRect() {
    if (!this.previewRect) return
    this.previewRect.draw(this.ctx)
  }

  updateCircles() {
    this.circles.forEach(c => c.update(this.rectangles))
  }

  updateAreaCovered() {
    if (this.rectanglesCount < this.rectangles.length) {
      this.rectanglesCount = this.rectangles.length
      this.areaCovered = getAreaCovered(this.ctx)
    }
  }

  drawUI() {
    this.ctx.fillStyle = "white"
    this.ctx.font = "bold 20px serif"
    this.ctx.fillText(`Lvl: ${this.id}`, canvasWidth - 100, 40)
    this.ctx.fillText(`Area: ${this.areaCovered}% / ${this.areaNeededToWin}%`, 10, 40)
  }

  update() {
    this.updateCircles()
    this.drawRectangles()
    this.drawPreviewRect()
    this.checkPreviewRectCollision()
    this.updateAreaCovered()
    this.drawUI()
  }
}
