export class Rectangle {
  constructor({ x, y, w, h }) {
    this.coords = { x, y, w, h }
  }

  draw(ctx) {
    ctx.fillStyle = "red"
    ctx.fillRect(this.coords.x, this.coords.y, this.coords.w, this.coords.h)
  }
}
