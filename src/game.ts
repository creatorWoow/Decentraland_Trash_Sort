import {ButtonStand} from "./entities/ButtonStand";
import {PlayerHand} from "./entities/PlayerHand";
import {PhysicalWorld} from "./entities/PhysicalWorld";
import {Planet} from "./entities/Planet";
import {GarbageBin} from "./entities/GarbageBin";
import {GarbageGenerator} from "./core/GarbageGenerator";
import {GarbagePhysicsSystem} from "./systems/GarbagePhysicsSystem";
import {initStaticComponents} from "./core/StaticComponents";
import {GameContext} from "./core/GameContext";
import {PlanetSystem} from "./systems/PlanetSystem";
import {createAlice} from "./npc/Alice";

initStaticComponents()

const eventManager = new EventManager()

const playerHand = new PlayerHand();
const physicalWorld = new PhysicalWorld();
const garbageGenerator = new GarbageGenerator(playerHand, physicalWorld);
const planet = new Planet(eventManager);

GarbageBin.init(playerHand, planet);
ButtonStand.init();

const planetSystem = new PlanetSystem(planet, eventManager)
engine.addSystem(planetSystem);
engine.addSystem(new GarbagePhysicsSystem(physicalWorld.world));
engine.addEntity(new GameContext(garbageGenerator, eventManager,
    planetSystem, playerHand));

// setupWalls(physicalWorld.world);

class RotatorSystem implements ISystem {
    update(dt: number) {
        planet.redPlanet.getComponent(Transform).rotate(Vector3.Down(), 2);
    }
}
engine.addSystem(new RotatorSystem());
export const alice = createAlice();


