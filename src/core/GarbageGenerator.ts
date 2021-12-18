import {PlayerHand} from '../entities/PlayerHand';
import {Garbage} from "../entities/Garbage";
import {PhysicsWorld} from "../entities/PhysicsWorld";

export class GarbageGenerator {

    private readonly _world: PhysicsWorld;
    private readonly _playerHand: PlayerHand;
    private readonly _props: Array<Garbage>;
    private static INITIAL_X_POS = 5
    private static INITIAL_Y_POS = 7
    private static INITIAL_Z_POS = 9.7
    private static HORIZONTAL_DISTANCE = 0.2
    private static VERTICAL_DISTANCE =  0.3
    private static GARBAGE_INIT_QUANTITY = 2;
    private static GARBAGE_MODELS: Array<string> = [
        "plastic_1.glb", "plastic_2.glb", "plastic_3.glb",
        "paper_1.glb", "paper_2.glb",
        "metal_can.glb"]

    constructor(playerHand: PlayerHand, world: PhysicsWorld) {
        this._world = world;
        this._playerHand = playerHand;
        this._props = [];
    }

    private static _getRandomGarbage() {
        return GarbageGenerator.GARBAGE_MODELS[Math.floor(Math.random() * GarbageGenerator.GARBAGE_MODELS.length)];
    }

    private _generateGarbage(): Array<Garbage> {
        log("Начало генерации рандомного мусора, количество: ", GarbageGenerator.GARBAGE_MODELS)
        for (let i = 0; i < GarbageGenerator.GARBAGE_INIT_QUANTITY; i++) {
            this._props.push(new Garbage(
                GarbageGenerator._getRandomGarbage(),
                this._playerHand,
                new Vector3(
                    GarbageGenerator.INITIAL_X_POS + Math.random() * GarbageGenerator.HORIZONTAL_DISTANCE,
                    GarbageGenerator.INITIAL_Y_POS + i * GarbageGenerator.VERTICAL_DISTANCE,
                    GarbageGenerator.INITIAL_Z_POS + Math.random()),
                this._world));
        }
        return this._props;
    }

    get garbage() {
        return this._generateGarbage();
    }
}