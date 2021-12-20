import {ButtonStand} from "./components/entities/ButtonStand";
import {PlayerHand} from "./components/entities/PlayerHand";
import {PhysicalWorld} from "./components/entities/PhysicalWorld";
import {Planet} from "./components/entities/Planet";
import {GarbageBin} from "./components/entities/GarbageBin";
import {GarbageGenerator} from "./components/core/GarbageGenerator";
import {GarbagePhysicsSystem} from "./components/systems/GarbagePhysicsSystem";
import {initMainScene} from "./components/core/StaticComponents";
import {GameContext} from "./components/core/GameContext";
import {PlanetSystem} from "./components/systems/PlanetSystem";
import {setupWalls} from "./components/core/SetupWalls";
import {createNPC} from "./components/npc/MetaEcologyRobot";
import {LikeMeter} from "./components/entities/LikeMeter";


export function createTrashSort(): void {
    initMainScene();

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
    setupWalls(physicalWorld.world);
    LikeMeter.init();
    createNPC();
}


