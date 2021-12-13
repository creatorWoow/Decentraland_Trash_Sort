import { initGarbage } from "./initFunctions/initGarbage"
import { loadColliders } from "./modules/colliders"
import { Garbage } from "./initFunctions/initGarbage"
import {Planet} from "./classes/Planet"
import {GarbageBin} from "./classes/GarbageBin";
import {initBoundary, initButton, initPipe} from "./modules/plainmodels";
import {initPowerMeterSystem} from "./initFunctions/initPowermeter";
import {PlayerHand} from './classes/PlayerHand';



const redPlanet = new Entity()
redPlanet.addComponent(new GLTFShape("models/planet_red.glb"))
redPlanet.addComponent(new Transform({
  position: new Vector3(12, 1, 8),
  scale: new Vector3(1, 1.25, 1).scale(0.4)
}));
engine.addEntity(redPlanet)

const planetTables = new Entity()
planetTables.addComponent(new GLTFShape("models/plasticmetalpaper.glb"))
planetTables.addComponent(new Transform({
  position: new Vector3(8, 0, 8)
}));
engine.addEntity(planetTables)

const floorBase = new Entity();
floorBase.addComponent(new GLTFShape("models/floorbase.glb"));
floorBase.addComponent(new Transform({
  position: new Vector3(8, 0, 8)
}));
engine.addEntity(floorBase)

const PLAYER_HAND = new PlayerHand()

// Setup our world
const world = new CANNON.World()
world.quatNormalizeSkip = 0
world.quatNormalizeFast = false
world.gravity.set(0, -9.82, 0) // m/s²

// Setup ground material
const physicsMaterial = new CANNON.Material("groundMaterial")
const ballContactMaterial = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, { friction: 1, restitution: 0.5 })
world.addContactMaterial(ballContactMaterial)

// Create a ground plane and apply physics material
const groundShape: CANNON.Plane = new CANNON.Plane()
const groundBody: CANNON.Body = new CANNON.Body({ mass: 0 })
groundBody.addShape(groundShape)
groundBody.material = physicsMaterial
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2) // Reorient ground plane to be in the y-axis
groundBody.position.set(0, 0.05, 0)
world.addBody(groundBody)

const pipe: Entity = initPipe()
const boundary: Entity = initBoundary()
const planet: Planet = Planet.init()
let bins = GarbageBin.init(PLAYER_HAND, planet)
const garbageOnFloor: Array<Garbage> = initGarbage(PLAYER_HAND, physicsMaterial, world)
initButton(garbageOnFloor)
loadColliders(bins, planet, boundary, world)
initPowerMeterSystem(garbageOnFloor)


// Set high to prevent tunnelling
const FIXED_TIME_STEPS = 1.0 / 60
const MAX_TIME_STEPS = 10

class PhysicsSystem implements ISystem {
  update(dt: number): void {
    world.step(FIXED_TIME_STEPS, dt, MAX_TIME_STEPS)

    for (let i = 0; i < garbageOnFloor.length; i++) {
      if (!garbageOnFloor[i].isActive) {
        garbageOnFloor[i].getComponent(Transform).position.copyFrom(garbageOnFloor[i].body.position)
        garbageOnFloor[i].getComponent(Transform).rotation.copyFrom(garbageOnFloor[i].body.quaternion)
      }
    }
  }
}

class PlanetSystem implements ISystem {
  update(dt: number): void {

    
  }
}

engine.addSystem(new PhysicsSystem())


// class RotatorSystem {
//   // this group will contain every entity that has a Transform component
//   group = engine.getComponentGroup(Transform)

//   update(dt: number) {
//     // planet
//     // iterate over the entities of the group
//     // get the Transform component of the entity
//     const transform = redPlanet.getComponent(Transform)

//     // mutate the rotation
//     transform.rotate(Vector3.Up(), dt * 40)
//   }
// }


// engine.addSystem(new RotatorSystem());