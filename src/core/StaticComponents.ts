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

export function initFallingCoins() {
    const coins = new Entity();
    coins.addComponent(new GLTFShape(MODELS_PATH + '/falling_coins.glb'));
    coins.addComponent(new Transform({
        position: new Vector3(8, 1, 8),
        scale: new Vector3(1, 1, 1).scale(0.4),
    }));
    engine.addEntity(coins);
}

export function initStaticComponents() {
    initFloor();
}
