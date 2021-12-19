import {PlayerHand} from '../entities/PlayerHand';
import {Garbage} from "../entities/Garbage";
import {PhysicalWorld} from "../entities/PhysicalWorld";
import {GARBAGE_MODELS, GARBAGE_SHAPES} from "./Constants";

export class GarbageGenerator {

    private readonly _world: PhysicalWorld;
    private readonly _playerHand: PlayerHand;
    private readonly _props: Array<Garbage>;
    private static INITIAL_X_POS = 3
    private static INITIAL_Y_POS = 2
    private static INITIAL_Z_POS = 7.7
    private static HORIZONTAL_DISTANCE = 0.1
    private static VERTICAL_DISTANCE =  0.7
    private static GARBAGE_INIT_QUANTITY = 10;

    constructor(playerHand: PlayerHand, world: PhysicalWorld) {
        this._world = world;
        this._playerHand = playerHand;
        this._props = [];
    }

    private static getRandomGarbageModel(): string {
        Math.floor(Math.random() * GARBAGE_MODELS.length)
        return GARBAGE_MODELS[
            Math.floor(Math.random() * GARBAGE_MODELS.length)];
    }

    public generateGarbage(quantity: number = GarbageGenerator.GARBAGE_INIT_QUANTITY): Array<Garbage> {
        log("Начало генерации рандомного мусора, количество: ", GARBAGE_SHAPES)
        for (let i = 0; i < quantity; i++) {
            this._props.push(new Garbage(
                GarbageGenerator.getRandomGarbageModel(),
                this._playerHand,
                new Vector3(
                    GarbageGenerator.INITIAL_X_POS + Math.random() * GarbageGenerator.HORIZONTAL_DISTANCE,
                    GarbageGenerator.INITIAL_Y_POS + i * GarbageGenerator.VERTICAL_DISTANCE,
                    GarbageGenerator.INITIAL_Z_POS + Math.random()),
                this._world));
        }
        return this._props;
    }
}