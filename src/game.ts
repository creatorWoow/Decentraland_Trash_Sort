import {ButtonStand} from "./entities/ButtonStand";
import {PlayerHand} from "./entities/PlayerHand";
import {PhysicsWorld} from "./entities/PhysicsWorld";
import {Planet} from "./entities/Planet";
import {GarbageBin} from "./entities/GarbageBin";
import {GarbageGenerator} from "./core/GarbageGenerator";
import {Garbage} from "./entities/Garbage";
import {GarbagePhysicsSystem} from "./systems/GarbagePhysicsSystem";
import {initStaticComponents} from "./core/StaticComponents";
import {GameContext} from "./core/GameContext";
import {Clock} from "./entities/Clock";
import {PlanetSystem} from "./systems/PlanetSystem";

const clock = new Clock();
initStaticComponents()
engine.addEntity(new GameContext(clock))
const buttonStand = new ButtonStand();
const playerHand = new PlayerHand();
const physicsWorld = new PhysicsWorld();
const planet = new Planet();
const garbageBins = GarbageBin.init(playerHand, planet);

const garbageOnFloor: Array<Garbage> = new GarbageGenerator(playerHand, physicsWorld).garbage;

engine.addSystem(new GarbagePhysicsSystem(garbageOnFloor, physicsWorld.world))
const planetSystem: PlanetSystem = new PlanetSystem(planet);
engine.addSystem(planetSystem);
// colliders(garbageBins, planet, components, physicsWorld.world);

