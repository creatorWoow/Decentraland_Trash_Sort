import {PlayerHand} from '../entities/PlayerHand';
import {Garbage} from "../entities/Garbage";
import {PhysicsWorld} from "../entities/PhysicsWorld";

const INITIAL_X_POS = 5
const INITIAL_Y_POS = 7
const INITIAL_Z_POS = 9.7

const HORIZONTAL_DISTANCE = 0.2
const VERTICAL_DISTANCE =  0.3

const GARBAGE_INIT_QUANTITY = 15;
const GARBAGE_MODELS: Array<string> = [
    "plastic_1.glb", "plastic_2.glb", "plastic_3.glb",
    "paper_1.glb", "paper_2.glb",
    "metal_can.glb"]

function getRandomGarbage(): string {
    return GARBAGE_MODELS[Math.floor(Math.random() * GARBAGE_MODELS.length)]
}

export function garbageGenerator(playerHand: PlayerHand, world: PhysicsWorld): Array<Garbage> {
    const props: Array<Garbage> = []

    log("Начало генерации рандомного мусора, количество: ", GARBAGE_INIT_QUANTITY)
    for (let i = 0; i < GARBAGE_INIT_QUANTITY; i++) {
        props.push(new Garbage(
            getRandomGarbage(),
            playerHand,
            new Vector3(
                INITIAL_X_POS + Math.random() * HORIZONTAL_DISTANCE,
                INITIAL_Y_POS + i * VERTICAL_DISTANCE,
                INITIAL_Z_POS + Math.random()),
            world));
    }
    return props
}