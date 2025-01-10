import { boolRectCircleColliding, getCollisionVector } from "./boolRectCircleCollide.js"
import { canvasHeight, canvasWidth } from "./definitions.js"

export class Circle {
  constructor({ x, y, r, xDir, yDir, speedX, speedY, ctx }) {
    this.coords = { x, y, r }
    this.speedX = speedX
    this.speedY = speedY
    this.xDir = xDir
    this.yDir = yDir
    this.rects = []
    this.ctx = ctx
    this.color = "blue"
  }

  draw() {
    this.ctx.fillStyle = this.color
    this.ctx.beginPath()
    this.ctx.arc(this.coords.x, this.coords.y, this.coords.r, 0, 2 * Math.PI)
    this.ctx.fill()
    this.color = "blue"
  }

  move() {
    const { colliding, rect } = this.isColliding()
    if (colliding) {
      this.color = "green"
      const collisionVector = getCollisionVector(this.coords, rect.coords)
      this.xDir = collisionVector.x === 0 ? this.xDir : collisionVector.x > 0 ? 1 : -1
      this.yDir = collisionVector.y === 0 ? this.yDir : collisionVector.y > 0 ? 1 : -1
    }
    this.coords.x = this.coords.x + (this.speedX / 10) * this.xDir
    this.coords.y = this.coords.y + (this.speedY / 10) * this.yDir
  }

  isColliding() {
    for (let i = 0; i < this.rects.length; i++) {
      const rect = this.rects[i]
      if (boolRectCircleColliding(this.coords, rect.coords)) {
        return { rect, colliding: true }
      }
    }
    return { colliding: false }
  }

  touchingCanvas() {
    if (this.coords.x + this.coords.r > canvasWidth || this.coords.x - this.coords.r < 0) {
      this.xDir = -this.xDir
    }
    if (this.coords.y + this.coords.r > canvasHeight || this.coords.y - this.coords.r < 0) {
      this.yDir = -this.yDir
    }
  }

  update(rects) {
    this.rects = rects
    this.touchingCanvas()
    this.move()
    this.draw()
  }
}
