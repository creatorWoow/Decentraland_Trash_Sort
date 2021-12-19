/**
 * Инициализирует главную сцену
 */
import resources from "../../resources";

export function initMainScene() {
    const floorBase = new Entity();
    floorBase.addComponent(new GLTFShape(resources.models.scene));
    floorBase.addComponent(new Transform({
        position: new Vector3(0, 0, 0)
    }));
    engine.addEntity(floorBase);
}
