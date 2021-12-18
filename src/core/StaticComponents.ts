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
    floorBase.addComponent(new GLTFShape(MODELS_PATH + '/scene.glb'));
    floorBase.addComponent(new Transform({
        position: new Vector3(0, 0, 0)
    }));
    engine.addEntity(floorBase);
}

export function initStaticComponents() {
    // initSignBoards();
    initFloor();
    // initBoundary();
    // initPipe();
}
