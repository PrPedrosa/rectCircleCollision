export class Rectangle {
  constructor({ x, y, w, h }, color = "red") {
    this.coords = { x, y, w, h }
    this.color = color
  }

  draw(ctx) {
    ctx.fillStyle = this.color
    ctx.fillRect(this.coords.x, this.coords.y, this.coords.w, this.coords.h)
  }
}
