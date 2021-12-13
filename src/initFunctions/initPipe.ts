/**
 * Инициализирует трубу, из которой падает мусор
 */

export function initPipe(): Entity {
  const pipe = new Entity()
  pipe.addComponent(new GLTFShape("models/truba.glb"))
  pipe.addComponent(new Transform({
    position: new Vector3(5, 0, 9.7),
    scale: new Vector3(1, 1, 1).scale(0.5)}))
  engine.addEntity(pipe)
  return pipe
}
