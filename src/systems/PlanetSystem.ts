import {MODELS_PATH} from "../core/Constants";

function initPlanetComponent() {
  const redPlanet = new Entity();
  redPlanet.addComponent(new GLTFShape(MODELS_PATH + '/planet_red.glb'));
  redPlanet.addComponent(new Transform({
    position: new Vector3(12, 1, 8),
    scale: new Vector3(1, 1.25, 1).scale(0.4),
  }));
  engine.addEntity(redPlanet);

  const planetTables = new Entity();
  planetTables.addComponent(new GLTFShape(MODELS_PATH + '/plasticmetalpaper.glb'));
  planetTables.addComponent(new Transform({
    position: new Vector3(8, 0, 8),
  }));
  engine.addEntity(planetTables);
}

export class PlanetSystem implements ISystem {

  constructor() {
    initPlanetComponent()
  }
}
