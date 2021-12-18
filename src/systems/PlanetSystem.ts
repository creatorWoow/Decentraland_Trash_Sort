import {Planet} from "../entities/Planet";


@Component("lerpData")
export class LerpSizeData {

    public static DEFAULT_LERP_SPEED:number = 6;

    origin: number;
    target: number;
    fraction: number;
    speed: number;

    constructor(origin: number, target: number, speed: number = 0) {
        this.origin = origin;
        this.target = target;
        this.fraction = 0;
        this.speed = speed;
    }
}
const HEALTHY_STATE = 0;
const GOOD_STATE = 1;
const INITIAL_STATE = 2;
const BAD_STATE = 3;
const REALLY_BAD_STATE = 4;


export const STAGES = {
    HEALTHY_STATE: new LerpSizeData(0.1, 1.2),
    GOOD_STATE: new LerpSizeData(1.2, 2),
    INITIAL_STATE: new LerpSizeData(1, 10),
    BAD_STATE: new LerpSizeData(0.1, 2),
    REALLY_BAD_STATE: new LerpSizeData(0.1, 2),
}

export class PlanetSystem implements ISystem {

    private planet: Planet;
    private entity: Entity;

    constructor(planet: Planet) {
        this.planet = planet;
        this.entity = new Entity();
        this.entity.addComponent(new BoxShape());
        this.entity.addComponent(new Transform(
            {position: new Vector3(8, 0, 8),
            }));
        this.entity.addComponent(STAGES.INITIAL_STATE);
        // engine.addEntity(this.entity);
    }
    

    update(dt: number) {
        let transform = this.entity.getComponent(Transform);
        let lerp = this.entity.getComponent(LerpSizeData);
        if (lerp.fraction < 1) {
            let newScale = Scalar.Lerp(lerp.origin, lerp.target, lerp.fraction);
            transform.scale.setAll(newScale);
            lerp.fraction += dt / 10;
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