import { Circle } from "./circle.js"
import { canvasHeight, canvasWidth } from "./definitions.js"
import { Level } from "./level.js"
import { Rectangle } from "./rectangle.js"

const levelsConfig = [
  {
    id: 1,
    winPercentage: 50,
    circlesDefs: [{ x: canvasWidth / 2, y: canvasHeight / 2, r: 20, xDir: 1, yDir: -1, speedX: 40, speedY: 2 }],
    rectanglesDefs: [],
  },
  {
    id: 2,
    winPercentage: 60,
    circlesDefs: [
      { x: canvasWidth / 2, y: canvasHeight / 2, r: 20, xDir: 1, yDir: -1, speedX: 50, speedY: 2 },
      {
        x: Math.floor(canvasWidth / 10),
        y: Math.floor(canvasHeight / 10),
        r: 20,
        xDir: 1,
        yDir: 1,
        speedX: 30,
        speedY: 10,
      },
    ],
    rectanglesDefs: [
      {
        x: Math.floor(canvasWidth / 1.5),
        y: Math.floor(canvasWidth / 1.5),
        w: Math.floor(canvasHeight / 8),
        h: Math.floor(canvasHeight / 8),
      },
    ],
  },
]

export const createLevels = (ctx, canvasCoords) => {
  return levelsConfig.map(
    ({ id, winPercentage, rectanglesDefs, circlesDefs }) =>
      new Level({
        ctx,
        canvasCoords,
        id,
        winPercentage,
        initRects: rectanglesDefs.length ? rectanglesDefs.map(rectDef => new Rectangle(rectDef)) : [],
        circles: circlesDefs.length ? circlesDefs.map(circleDef => new Circle({ ...circleDef, ctx })) : [],
      })
  )
}