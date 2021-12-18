import {Garbage} from "./Garbage";
import {MODELS_PATH} from "../core/Constants";
import {PlanetChangeProducer} from "../core/PlanerChangeProducer";

export class Planet extends Entity {

    public static TUBE_ANIM_NAME = "tubeanim_";

    public static X_INIT_POS = -1;
    public static Y_INIT_POS = 0;
    public static Z_INIT_POS = -2.7;
    public static BIN_DISTANCE = 2.6;


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
        planetAnimator.addClip(new AnimationState('0idle', {looping: false}))
        planetAnimator.addClip(new AnimationState('-1idle', {looping: false}))
        planetAnimator.addClip(new AnimationState('f-1to0', {looping: false}))
        planetAnimator.addClip(new AnimationState('f0to-1', {looping: false}))
        planetAnimator.addClip(new AnimationState('f0to1', {looping: false}))
        planetAnimator.addClip(new AnimationState(Planet.TUBE_ANIM_NAME + 1, {looping: false}))
        planetAnimator.addClip(new AnimationState(Planet.TUBE_ANIM_NAME + 2, {looping: false}))
        planetAnimator.addClip(new AnimationState(Planet.TUBE_ANIM_NAME + 3, {looping: false}))

        this.addComponent(planetAnimator);
        this.addComponent(new GLTFShape(MODELS_PATH + '/planet.glb'))
        this.addComponent(new Transform({
            position: new Vector3(10, 0, 8),
            scale: new Vector3(1, 1, 1).scale(0.5)
        }));

        engine.addEntity(this)
    }

    private initRedPlanet() {
        const redPlanet = new Entity();
        redPlanet.addComponent(new GLTFShape(MODELS_PATH + '/planet_red.glb'));

        const planetPos = this.getComponent(Transform);
        redPlanet.addComponent(new Transform(
            {position: new Vector3(
                    planetPos.position.x,
                    planetPos.position.y + 2,
                    planetPos.position.z),
                scale: new Vector3(1, 1, 1).scale(0.3),
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
            pipePosition.x + Planet.X_INIT_POS,
            pipePosition.y + Planet.Y_INIT_POS,
            pipePosition.z + Planet.Z_INIT_POS + (Planet.BIN_DISTANCE * (2 - pipe)));
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
}