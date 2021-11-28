import * as ui from '@dcl/ui-scene-utils'
import { Garbage } from './ball'

export class Planet extends Entity {

    public static TUBE_ANIM_NAME = "tubeanim_"
    public static X_INIT_POS = -1
    public static Y_INIT_POS = 0
    public static Z_INIT_POS = -3.3
    public static BIN_DISTANCE = 3

    private pollutionIndex: number;

    constructor(transform: Transform) {
        super();
        this.pollutionIndex = 0;

        this.initEntity(transform)
    }

    private initEntity(transform: Transform) {

        /* Animations */
        const planetAnimator = new Animator()
        planetAnimator.addClip(new AnimationState("0idle", {looping: false}))
        planetAnimator.addClip(new AnimationState("-1idle", {looping: false}))
        planetAnimator.addClip(new AnimationState("f-1to0", {looping: false}))
        planetAnimator.addClip(new AnimationState("f0to-1", {looping: false}))
        planetAnimator.addClip(new AnimationState("f0to1", {looping: false}))
        planetAnimator.addClip(new AnimationState(Planet.TUBE_ANIM_NAME + 1, {looping: false}))
        planetAnimator.addClip(new AnimationState(Planet.TUBE_ANIM_NAME + 2, {looping: false}))
        planetAnimator.addClip(new AnimationState(Planet.TUBE_ANIM_NAME + 3, {looping: false}))

        this.addComponent(planetAnimator)
        this.addComponent(new GLTFShape("models/planet.glb"))
        this.addComponent(transform)

        engine.addEntity(this)
    }

    public getGarbage(item: Garbage, pipeIndex: number): void {

        this.pollutionIndex += item.resycledRate;

        this.setAppearance();
        this.playPipeAnimation(pipeIndex);
    }

    private setAppearance() {
        ui.displayAnnouncement(`Current pollution ${this.pollutionIndex}`)
    }

    public getPositionByPipe(pipe: number) : Vector3 {
        let ppos: Vector3 = this.getComponent(Transform).position

        if (pipe === 0)
        {
            return new Vector3(
                ppos.x + Planet.X_INIT_POS,
                ppos.y + Planet.Y_INIT_POS,
                ppos.z + Planet.Z_INIT_POS + (Planet.BIN_DISTANCE * 2))
        } else if (pipe === 1)
        {
            return new Vector3(
                ppos.x + Planet.X_INIT_POS,
                ppos.y + Planet.Y_INIT_POS,
                ppos.z + Planet.Z_INIT_POS + (Planet.BIN_DISTANCE * 1))
        }
        else
        {
            return new Vector3(
                ppos.x + Planet.X_INIT_POS,
                ppos.y + Planet.Y_INIT_POS,
                ppos.z + Planet.Z_INIT_POS + (Planet.BIN_DISTANCE * 0))
        }
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


