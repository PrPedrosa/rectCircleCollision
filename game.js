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
export class Game {
  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx, canvas) {
    const initRectangles = [
      new Rectangle({ x: 100, y: 250, w: 30, h: 100 }),
      new Rectangle({ x: 400, y: 250, w: 30, h: 100 }),
    ]

    // no scrolling or this gets f'ed
    const canvasCoords = canvas.getBoundingClientRect()

    this.ctx = ctx
    this.rectangles = initRectangles || []
    this.rectanglesCount = initRectangles.length
    this.circles = createCircles(2, this.ctx)

    this.playerRectX = 0
    this.playerRectY = 0
    this.playerRectH = 0
    this.playerRectW = 0
    this.drawingRect = false

    // need to paint first to get init Rectangles area
    this.areaCovered = (() => {
      this.drawRectangles()
      return getAreaCovered(ctx)
    })()
    this.areaNeededToWin = 50 // percent, get from level configs

    this.levelLost = false
    this.leveWin = false

    document.addEventListener("mousedown", e => {
      this.drawingRect = true
      this.playerRectX = e.x - canvasCoords.left
      this.playerRectY = e.y - canvasCoords.top
    })

    document.addEventListener("mousemove", e => {
      if (this.drawingRect) {
        this.playerRectW = e.x - canvasCoords.left - this.playerRectX
        this.playerRectH = e.y - canvasCoords.top - this.playerRectY
      }
    })

    // get this into a separate fn?
    document.addEventListener("mouseup", _ => {
      if (!this.drawingRect) return
      this.drawingRect = false

      // calc new rectangle coords
      const rw = Math.abs(this.playerRectW)
      const rh = Math.abs(this.playerRectH)
      let rx = this.playerRectW > 0 ? this.playerRectX : this.playerRectX - rw
      let ry = this.playerRectH > 0 ? this.playerRectY : this.playerRectY - rh

      // reset player rectangle coords
      this.playerRectX = 0
      this.playerRectY = 0
      this.playerRectH = 0
      this.playerRectW = 0

      const bigEnoughRect = rw > 5 && rh > 5
      if (!bigEnoughRect) return

      const newRect = new Rectangle({ x: rx, y: ry, w: rw, h: rh })
      this.rectangles.push(newRect)
      console.log("NEW RECT ADDED:", { x: rx, y: ry, w: rw, h: rh })

      // if a circle is colling with this rect, lose level
      let loseLevel = this.circles.some(c => boolRectCircleColliding(c.coords, newRect.coords))
      this.levelLost = this.levelLost || loseLevel
    })
  }

  drawRectangles() {
    this.rectangles.forEach(r => r.draw(this.ctx))
  }

  previewPlayerRectangle() {
    if (!this.drawingRect) return
    this.ctx.strokeStyle = "green"
    this.ctx.strokeRect(this.playerRectX, this.playerRectY, this.playerRectW, this.playerRectH)
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
    this.previewPlayerRectangle()
    this.updateDrawAreaCovered()
    console.log(this.levelLost)
  }
}
