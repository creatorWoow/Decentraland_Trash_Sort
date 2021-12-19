import {Planet} from "../entities/Planet";
import {OnPlanetChangeEvent} from "../core/PlanerChangeProducer";

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
const NORMAL_SPEED = 10;
const SUDDEN_JUMP = 5;

/* Levels of planet health */
const GOOD_STATE = 1;
const INITIAL_STATE = 2;
const BAD_STATE = 3;
const REALLY_BAD_STATE = 4;

export const TARGETS: { [key: number]: number } =
    {
        1: 0.4,
        2: 0.5,
        3: 0.6,
        4: 0.7,
    }

export class PlanetSystem implements ISystem {

    public planet: Planet;

    private speed: number = NORMAL_SPEED;
    private currentLerp: LerpSizeData | undefined;
    private stage: number = INITIAL_STATE;
    private _stateChanged = false;
    private eventManager: EventManager;

    constructor(planet: Planet, eventManager: EventManager) {
        this.planet = planet;
        this.eventManager = eventManager;
        this.currentLerp = new LerpSizeData(1, 10, NORMAL_SPEED);
        this.initPlanetChangeListener();
    }

    initPlanetChangeListener() {
        this.eventManager.addListener(OnPlanetChangeEvent, PlanetSystem,
            ({garbage}) => {
                log("PlanetSystem перехватил событие изменения планеты")
                if (garbage.isWorseRecycled()) {
                    this.stage = Math.min(this.stage + 2, REALLY_BAD_STATE);
                    this.speed = SUDDEN_JUMP;
                } else {
                    this.stage = Math.max(this.stage - 1, GOOD_STATE);
                    this.speed = NORMAL_SPEED;
                }
                this.currentLerp = new LerpSizeData(
                    this.planet.redPlanet.getComponent(Transform).scale.x,
                    TARGETS[this.stage], this.speed);
                this.stateChanged = true;
            });
    }


    update(dt: number) {
        if (this.stateChanged) {
            if (this.currentLerp === undefined)
                return;

            if (this.currentLerp.fraction < 1) {
                let newScale = this.currentLerp.getScalar();
                this.planet.redPlanet.getComponent(Transform).scale.setAll(newScale)
                this.currentLerp.fraction += dt / this.currentLerp.speed;
            }
        }
    }

    public setReallyBadState() {
        this.currentLerp = new LerpSizeData(
            this.planet.redPlanet.getComponent(Transform).scale.x,
            TARGETS[REALLY_BAD_STATE], this.speed);
        this._stateChanged = true;
    }

    get stateChanged(): boolean {
        return this._stateChanged;
    }

    set stateChanged(value: boolean) {
        this._stateChanged = value;
    }
}