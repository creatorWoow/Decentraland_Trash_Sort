import {Planet} from "../entities/Planet";


@Component("lerpData")
export class LerpSizeData {

    public static DEFAULT_LERP_SPEED: number = 6;

    origin: number;
    target: number;
    fraction: number;
    speed: number;

    constructor(origin: number, target: number, speed: number = NORMAL_SPEED) {
        this.origin = origin;
        this.target = target;
        this.fraction = 0;
        this.speed = speed;
    }

    public getScalar(): number {
        return Scalar.Lerp(this.origin, this.target, this.fraction);
    }
}

/* Planet change speed */
const NORMAL_SPEED = 12;
const SUDDEN_JUMP = 5;

/* Directions */
const GETTING_WORSE = -1;
const WITHOUT_CHANGES = 0;
const GETTING_BETTER = 1;

/* Levels of planet health */
const HEALTHY_STATE = 0;
const GOOD_STATE = 1;
const INITIAL_STATE = 2;
const BAD_STATE = 3;
const REALLY_BAD_STATE = 4;


export const STAGES =
{
    HEALTHY_STATE: new LerpSizeData(0.1, 1.2),
    GOOD_STATE: new LerpSizeData(1.2, 2),
    INITIAL_STATE: new LerpSizeData(1, 5),
    BAD_STATE: new LerpSizeData(0.1, 2),
    REALLY_BAD_STATE: new LerpSizeData(0.1, 7),
}

export class PlanetSystem implements ISystem {

    private planet: Planet;
    private currentStage = INITIAL_STATE;
    private direction: number = WITHOUT_CHANGES;
    private _stateChanged = false;
    private eventManager: EventManager;

    constructor(planet: Planet, eventManager: EventManager) {
        this.planet = planet;
        this.eventManager = eventManager;
    }


    update(dt: number) {
        /* Если никаких действий не совершилось, состояние планеты постепенно
        *  будет либо улучшаться, либо ухудшаться, в зависимости от
        *  переменной direction  */
        if (!this._stateChanged) {
            if (this.direction == GETTING_BETTER)
                this.getBetter();
            else if (this.direction == GETTING_WORSE)
                this.getWorse();
        }
    }

    private getWorse() {

    }

    private getBetter() {
    }

    get stateChanged(): boolean {
        return this._stateChanged;
    }

    set stateChanged(value: boolean) {
        this._stateChanged = value;
    }
}

// a system to carry out the movement
export class LerpSize implements ISystem {

}