import {PlayerHand} from '../entities/PlayerHand';
import {Garbage} from "../entities/Garbage";
import {PhysicalWorld} from "../entities/PhysicalWorld";
import {GARBAGE_MODELS, GARBAGE_SHAPES, OFFSET_VECTOR} from "./Constants";

export class GarbageGenerator {

    private readonly _world: PhysicalWorld;
    private readonly _playerHand: PlayerHand;
    private buffer: Array<Garbage>;
    private _allCreatedProps: Array<Garbage>;
    private static INITIAL_X_POS = 3
    private static INITIAL_Y_POS = 4
    private static INITIAL_Z_POS = 7.7
    private static HORIZONTAL_DISTANCE = 0.1
    private static VERTICAL_DISTANCE =  0.3
    private static GARBAGE_BUFFER_QUANTITY = 18;
    private static GARBAGE_INIT_QUANTITY = 10;

    constructor(playerHand: PlayerHand, world: PhysicalWorld) {
        this._world = world;
        this._playerHand = playerHand;
        this._allCreatedProps = []
        this.buffer = this.createNewEntities(
            GarbageGenerator.GARBAGE_BUFFER_QUANTITY);
    }

    private static getRandomGarbageModel(): string {
        Math.floor(Math.random() * GARBAGE_MODELS.length)
        return GARBAGE_MODELS[
            Math.floor(Math.random() * GARBAGE_MODELS.length)];
    }

    private createNewEntities(quantity: number) : Array<Garbage> {
        log("Начало генерации рандомного мусора, количество: ", GARBAGE_SHAPES)
        let newProps: Array<Garbage> = []
        for (let i = 0; i < quantity; i++) {
            newProps.push(new Garbage(
                GarbageGenerator.getRandomGarbageModel(),
                this._playerHand,
                new Vector3(
                    GarbageGenerator.INITIAL_X_POS + Math.random() * GarbageGenerator.HORIZONTAL_DISTANCE,
                    GarbageGenerator.INITIAL_Y_POS + i * GarbageGenerator.VERTICAL_DISTANCE,
                    GarbageGenerator.INITIAL_Z_POS + Math.random()).add(OFFSET_VECTOR),
                this._world,
                this));
        }
        newProps.forEach(e => {
            this._allCreatedProps.push(e);
        })
        return newProps;
    }

    public resetBuffer() {
        log("Сброс буфера")
        this.buffer = []
        this._allCreatedProps.forEach(e => {
            this.buffer.push(e);
        })
    }

    public returnToBuffer(garbage: Garbage) {
        this.buffer.push(garbage);
    }

    public generateGarbage(quantity: number = GarbageGenerator.GARBAGE_INIT_QUANTITY): Array<Garbage> {
        if (this.buffer.length < quantity)
            return [];

        let spliceOfBuffer = this.buffer.splice(0, quantity);
        log("Размер буфера: ", this.buffer.length)
        return spliceOfBuffer;
    }

    get allCreatedProps(): Array<Garbage> {
        return this._allCreatedProps;
    }
}