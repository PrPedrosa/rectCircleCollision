// return true if the rectangle and circle are colliding
export function boolRectCircleColliding(circle, rect) {
  let distX = Math.abs(circle.x - rect.x - rect.w / 2)
  let distY = Math.abs(circle.y - rect.y - rect.h / 2)

  if (distX > rect.w / 2 + circle.r) {
    return false
  }
  if (distY > rect.h / 2 + circle.r) {
    return false
  }

  if (distX <= rect.w / 2) {
    return true
  }
  if (distY <= rect.h / 2) {
    return true
  }

  let dx = distX - rect.w / 2
  let dy = distY - rect.h / 2

  return dx * dx + dy * dy <= circle.r * circle.r
}

export function getCollisionVector(circle, rect) {
  const { x: cx, y: cy } = circle
  const { x: rx, y: ry, w: rw, h: rh } = rect

  const closestRectX = Math.max(rx, Math.min(cx, rx + rw))
  const closestY = Math.max(ry, Math.min(cy, ry + rh))

  const distanceX = cx - closestRectX
  const distanceY = cy - closestY
  const distanceSquared = distanceX * distanceX + distanceY * distanceY
  const distance = Math.sqrt(distanceSquared)
  const responseX = distanceX / distance // Normalize the x component
  const responseY = distanceY / distance // Normalize the y component
  const vec = { x: responseX, y: responseY } // Directional vector after collision

  return vec
}
