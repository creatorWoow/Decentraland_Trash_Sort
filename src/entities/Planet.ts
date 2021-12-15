import * as ui from '@dcl/ui-scene-utils'
import {Garbage} from "./Garbage";
import {MODELS_PATH} from "../core/Constants";

export class Planet extends Entity {

    public static TUBE_ANIM_NAME = "tubeanim_"
    public static X_INIT_POS = -1
    public static Y_INIT_POS = 0
    public static Z_INIT_POS = -2.7
    public static BIN_DISTANCE = 2.6

    private pollutionIndex: number;

    constructor(transform?: Transform) {
        super();
        this.pollutionIndex = 0;
        this.initEntity(transform || new Transform({
            position: new Vector3(12, 0, 8),
            scale: new Vector3(0.5, 0.5, 0.5)
        }))
    }
    private initEntity(transform: Transform) {

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

        this.addComponent(planetAnimator)
        this.addComponent(new GLTFShape(MODELS_PATH + '/planet.glb'))
        this.addComponent(transform)

        engine.addEntity(this)
    }

    public getGarbage(item: Garbage, pipeIndex: number): void {

        this.pollutionIndex += item.recycledRate;

        this.setAppearance();
        this.playPipeAnimation(pipeIndex);
    }

    private setAppearance() {
        ui.displayAnnouncement(`Current score ${this.pollutionIndex}`)
    }

    public getPositionByPipe(pipe: number) : Vector3 {
        let pipePosition: Vector3 = this.getComponent(Transform).position
        return new Vector3(
            pipePosition.x + Planet.X_INIT_POS,
            pipePosition.y + Planet.Y_INIT_POS,
            pipePosition.z + Planet.Z_INIT_POS + (Planet.BIN_DISTANCE * (2 - pipe)));
    }

    public playPipeAnimation(pipeIndex: number) {
        this.getComponent(Animator).getClip(Planet.TUBE_ANIM_NAME + pipeIndex)?.play();
    }

    public static init() : Planet { 
        return new Planet(new Transform({
            position: new Vector3(12, 0, 8),
            scale: new Vector3(1, 1, 1).scale(0.5)
        }))
    }
}


