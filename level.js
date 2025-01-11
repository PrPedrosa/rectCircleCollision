import { boolRectCircleColliding } from "./boolRectCircleCollide.js"
import { Rectangle } from "./rectangle.js"
import { createCircles, getAreaCovered } from "./utils.js"

// ### possible difficulty factors ###
// have max num of rectangles on levels
// balls go faster and bigger (random switching on direction/speed)
// have init rectangles
// different percentages to complete level

// maybe make this class Level and pass level num here or level configs fetched from class Game
// and create class Game that manages levels and other stuff

//Stop moving balls when level lost
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

    //this.ctx.fillRect(this.playerRectX, this.playerRectY, this.playerRectW, this.playerRectH)
    this.previewRect.draw(this.ctx)
  }

  updateCircles() {
    this.circles.forEach(c => c.update(this.rectangles))
  }

  updateDrawAreaCovered() {
    if (this.rectanglesCount < this.rectangles.length) {
      this.rectanglesCount = this.rectangles.length
      this.areaCovered = getAreaCovered(this.ctx)
    }
    this.ctx.fillStyle = "white"
    this.ctx.font = "bold 20px serif"
    this.ctx.fillText(`${this.areaCovered}%`, 10, 40)
  }

  update() {
    this.updateCircles()
    this.drawRectangles()
    this.drawPreviewRect()
    this.checkPreviewRectCollision()
    this.updateDrawAreaCovered()
  }
}