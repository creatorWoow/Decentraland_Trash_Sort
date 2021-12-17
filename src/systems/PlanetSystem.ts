import {Planet} from "../entities/Planet";

@Component("lerpData")
export class LerpSizeData {

    constructor(origin: number, target: number) {
        this.origin = origin;
        this.fraction = target;
    }

    origin: number = 0.1
    target: number = 2
    fraction: number = 0
}
const HEALTHY_STATE = 0;
const GOOD_STATE = 1;
const INITIAL_STATE = 2;
const BAD_STATE = 3;
const REALLY_BAD_STATE = 4;


export const STAGES = {
    HEALTHY_STATE: new LerpSizeData(0.1, 1.2),
    GOOD_STATE: new LerpSizeData(0.1, 2),
    INITIAL_STATE: new LerpSizeData(0.1, 2),
    BAD_STATE: new LerpSizeData(0.1, 2),
    REALLY_BAD_STATE: new LerpSizeData(0.1, 2),

}

export class PlanetSystem implements ISystem {

    private planet: Planet;

    constructor(planet: Planet) {
        this.planet = planet;

        this.planet.redPlanet.addComponent(LerpSizeData);
    }

    update(dt: number) {
        let transform = this.planet.redPlanet.getComponent(Transform)
        let lerp = this.planet.redPlanet.getComponent(LerpSizeData)
        if (lerp.fraction < 1) {
            let newScale = Scalar.Lerp(lerp.origin, lerp.target, lerp.fraction)
            transform.scale.setAll(newScale)
            lerp.fraction += dt / 6
        }
    }

    private getWorse() {

    }

    private getBetter() {

    }
}

// a system to carry out the movement
export class LerpSize implements ISystem {

}