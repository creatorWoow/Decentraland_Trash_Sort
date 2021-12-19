import {Garbage} from "./Garbage";
import {MODELS_PATH} from "../core/Constants";
import {PlanetChangeProducer} from "../core/PlanerChangeProducer";

/**
 * Начальные координаты основной планеты
 */
const X_INIT_POS = -1;
const Y_INIT_POS = 0;
const Z_INIT_POS = -2.7;
const BIN_DISTANCE = 2.6;

/**
 * Начальный координаты плохой планеты
 */
const X_RED_INIT_POS = 12.15;
const Y_RED_INIT_POS = 3.55;
const Z_RED_INIT_POS = 8;
const RED_INIT_SCALE = 0.5;

export class Planet extends Entity {

    public static TUBE_ANIM_NAME = "tubeanim_";


    planetChangeProducer: PlanetChangeProducer;

    private pollutionIndex: number;

    private _redPlanet: Entity;

    constructor(eventManger: EventManager) {
        super();
        this.planetChangeProducer = new PlanetChangeProducer(eventManger);
        this.pollutionIndex = 0;
        this.eventManager = eventManger;
        this.initMainPlanet();
        this._redPlanet = this.initRedPlanet();
    }

    private initMainPlanet() {

        /* Animations */
        const planetAnimator = new Animator()
        planetAnimator.addClip(new AnimationState(Planet.TUBE_ANIM_NAME + 1, {looping: false}))
        planetAnimator.addClip(new AnimationState(Planet.TUBE_ANIM_NAME + 2, {looping: false}))
        planetAnimator.addClip(new AnimationState(Planet.TUBE_ANIM_NAME + 3, {looping: false}))

        this.addComponent(planetAnimator);
        this.addComponent(new GLTFShape(MODELS_PATH + '/planet.glb'))
        this.addComponent(new Transform({
            position: new Vector3(10, 0, 8),
            scale: new Vector3(1, 1, 1).scale(RED_INIT_SCALE)
        }));

        engine.addEntity(this)
    }

    private initRedPlanet() {
        const redPlanet = new Entity();
        redPlanet.addComponent(new GLTFShape(MODELS_PATH + '/red_planet2.glb'));

        const planetPos = this.getComponent(Transform);
        redPlanet.addComponent(new Transform(
            {position: new Vector3(X_RED_INIT_POS, Y_RED_INIT_POS, Z_RED_INIT_POS),
                scale: Vector3.One().scale(RED_INIT_SCALE),
            }
        ));
        engine.addEntity(redPlanet);
        return redPlanet;
    }


    public getGarbage(garbage: Garbage, pipeIndex: number): void {

        log(`В планету попал мусор: ${garbage.toString()}`);
        engine.removeEntity(garbage);
        /* Объясните, пожалуйста, почему это не работает???? */
        // this.eventManager?.fireEvent(new OnPlanetChangeEvent(garbage));
        /* а это работает */
        this.planetChangeProducer.produce(garbage);

        this.pollutionIndex += garbage.recycledRate;
        this.playPipeAnimation(pipeIndex);
    }

    public getPositionByPipe(pipe: number): Vector3 {
        let pipePosition: Vector3 = this.getComponent(Transform).position
        return new Vector3(
            pipePosition.x + X_INIT_POS,
            pipePosition.y + Y_INIT_POS,
            pipePosition.z + Z_INIT_POS + (BIN_DISTANCE * (2 - pipe)));
    }

    public playPipeAnimation(pipeIndex: number) {
        this.getComponent(Animator).getClip(Planet.TUBE_ANIM_NAME + pipeIndex)?.play();
    }

    get redPlanet(): Entity {
        return this._redPlanet;
    }

    set redPlanet(value: Entity) {
        this._redPlanet = value;
    }

    public resetRedPlanet() {
        this.redPlanet.getComponent(Transform).scale.setAll(RED_INIT_SCALE);
    }
}