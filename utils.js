import { Circle } from "./circle.js"
import { canvasHeight, canvasWidth } from "./definitions.js"

const rng10 = () => Math.floor(Math.random() * 100) + 1

function getRandomInt() {
  const values = [1, -1]
  const randomIndex = Math.floor(Math.random() * values.length)
  return values[randomIndex]
}

export const createCircles = (num, ctx) =>
  new Array(num).fill().map(
    _ =>
      new Circle({
        x: 300,
        y: 300,
        r: 15,
        xDir: getRandomInt(),
        yDir: getRandomInt(),
        speedX: 2,
        speedY: 2,
        ctx,
      })
  )

/**
 * @param {CanvasRenderingContext2D} ctx
 * @returns {String} string containg percentage of area covered by rgb(255,0,0) rectangles
 */
export const getAreaCovered = ctx => {
  const data = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data

  const totalPixels = data.length / 4 // a pixel is 4bytes - r,g,b,a
  let redPixels = 0
  for (let i = 0; i < data.length; i += 4) {
    // if all rects color have specific alpha channel possibly could just use that to check them instead of 3 colors,
    // making alpha channel work like a sort of key for finding rects pixels
    const red = data[i]
    const green = data[i + 1]
    const blue = data[i + 2]

    if (green === 0 && blue === 0 && red === 255) redPixels++
  }

  return ((redPixels / totalPixels) * 100).toFixed(2)
}
