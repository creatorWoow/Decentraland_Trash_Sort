import {ButtonStand} from "./entities/ButtonStand";
import {PlayerHand} from "./entities/PlayerHand";
import {PhysicsWorld} from "./entities/PhysicsWorld";
import {Planet} from "./entities/Planet";
import {GarbageBin} from "./entities/GarbageBin";
import {garbageGenerator} from "./core/GarbageGenerator";
import {Garbage} from "./entities/Garbage";
import {GarbagePhysicsSystem} from "./systems/GarbagePhysicsSystem";
import {initPowerMeterSystem} from "./systems/PowermeterSystem";
import {initStaticComponents} from "./core/StaticComponents";
import {GameContext} from "./core/GameContext";

initStaticComponents()
engine.addEntity(new GameContext())
const buttonStand = new ButtonStand();
const playerHand = new PlayerHand();
const physicsWorld = new PhysicsWorld();
const planet = new Planet();
const garbageBins = GarbageBin.init(playerHand, planet);

const garbageOnFloor: Array<Garbage> = garbageGenerator(
    playerHand,
    physicsWorld
);

engine.addSystem(new GarbagePhysicsSystem(garbageOnFloor, physicsWorld.world))
initPowerMeterSystem(garbageOnFloor)
// colliders(garbageBins, planet, components, physicsWorld.world);

