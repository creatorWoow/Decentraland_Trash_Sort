/**
 * Инициализирует границы сцены
 */
import {MODELS_PATH} from './Constants';

/**
 * Инициализирует границы сцены
 */
export function initBoundary(): Entity {
    const boundary = new Entity();
    boundary.addComponent(new GLTFShape(MODELS_PATH + '/boundary.glb'));
    boundary.addComponent(new Transform({
        position: new Vector3(8, 0, 8),
        scale: Vector3.One().scale(0.95),
    }).rotate(Vector3.Down(), 90));
    engine.addEntity(boundary);
    return boundary;
}

/**
 * Инициализирует пол сцены
 */
export function initFloor() {
    const floorBase = new Entity();
    floorBase.addComponent(new GLTFShape(MODELS_PATH + '/floorbase.glb'));
    floorBase.addComponent(new Transform({
        position: new Vector3(8, 0, 8),
    }));
    engine.addEntity(floorBase);
}

/**
 * Инициализирует трубу, из которой падает мусор
 */
export function initPipe(): Entity {
    const pipe = new Entity()
    pipe.addComponent(new GLTFShape(MODELS_PATH + "/truba.glb"))
    pipe.addComponent(new Transform({
        position: new Vector3(5, 0, 9.7),
        scale: new Vector3(1, 1, 1).scale(0.5)
    }))
    engine.addEntity(pipe)
    return pipe
}

export function initStaticComponents() {
    initFloor();
    initBoundary();
    initPipe();
}
