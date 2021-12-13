/**
 * Инициализирует границы сцены
 */
export function initBoundary() : Entity {
  const boundary = new Entity()
  boundary.addComponent(new GLTFShape("models/boundary.glb"))
  boundary.addComponent(new Transform({
    position: new Vector3(8, 0, 8),
    scale: Vector3.One().scale(0.95)
  }).rotate(Vector3.Down(), 90))
  engine.addEntity(boundary)
  return boundary
}