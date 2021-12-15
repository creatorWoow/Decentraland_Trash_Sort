import {Garbage, GARBAGE_GROUP_NAME} from "../entities/Garbage";

export function startGame() {
    const garbage: Record<string, Garbage> =
        engine.getEntitiesWithComponent(GARBAGE_GROUP_NAME);
    log(`Запуск игры, количество мусора на сцене: ` +
    Object.keys(garbage).length);
}

export function resetGame() {

}