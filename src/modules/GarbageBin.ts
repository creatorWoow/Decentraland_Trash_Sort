import { Planet } from "Planet";
import * as ui from '@dcl/ui-scene-utils'

import * as utils from '@dcl/ecs-scene-utils'
import { Garbage } from "./ball";
import { PlayerHand } from "src/game";



export class GarbageBin extends Entity {

    private static garbageBinShape = new GLTFShape("models/trashbin.glb")
    private static START_BIN_CLIP = "trashbin_work"
    private static STOP_BIN_CLIP = "Stop"
    private animator: Animator;


    private planet: Planet;
    private readonly type: string;
    private readonly pipe: number;

    constructor(propInHand: PlayerHand, rightGarbageType: string, planet: Planet, pipe: number) {
        super();
        this.type = rightGarbageType;
        this.planet = planet;
        this.pipe = pipe;
        this.animator = new Animator();
        this.setupEntity()
        this.createEnterPoint(propInHand);
    }

    private setupEntity() {
        /* Позиция, размер */
        this.addComponent(GarbageBin.garbageBinShape)
        this.addComponent(
            new Transform(
                {position: this.planet.getPositionByPipe(this.pipe - 1),
                    scale: new Vector3(1, 1, 1).scale(0.5)}))

        /* Анимация */
        this.animator.addClip(new AnimationState(GarbageBin.START_BIN_CLIP, {looping: false}))
        this.animator.addClip(new AnimationState(GarbageBin.STOP_BIN_CLIP, {looping: false}))
        this.addComponent(this.animator)


        engine.addEntity(this)
    }

    private startRecycling() {
        // this.getComponent(Animator).getClip(GarbageBin.START_BIN_CLIP).stop()
        this.getComponent(Animator).getClip(GarbageBin.START_BIN_CLIP).play()
    }

    private stopRecycling() {
        this.getComponent(Animator).getClip(GarbageBin.STOP_BIN_CLIP).stop()
        this.getComponent(Animator).getClip(GarbageBin.STOP_BIN_CLIP).play()
    }

    private createEnterPoint(playerHand: PlayerHand) {
        const coords = this.getComponent(Transform).position;
        let shape = new utils.TriggerBoxShape(
            new Vector3(1, 1, 1),
            new Vector3(-1, 2, 0),
        )
        
        this.addComponent(new utils.TriggerComponent(
            shape,
                {
                    onCameraEnter: () => {
                        if(playerHand !== null && playerHand["body"] !== undefined && playerHand["entity"]) {

                            playerHand.entity.isActive = false
                            playerHand.entity.isThrown = true
                            playerHand.entity.setParent(null)
                            playerHand.entity.toggleOnPointerDown(true)
                            playerHand.entity.disable()
                            playerHand.entity.getComponent(GLTFShape).withCollisions = false

                            switch(playerHand["entity"].type === this.type) {
                                case true:
                                    ui.displayAnnouncement('You did correct')
                                    break;
                                case false: 
                                    ui.displayAnnouncement('You did wrong')
                                    break;
                            }

                            this.getProp(playerHand["entity"]);

                            playerHand.body = undefined
                            playerHand.entity = undefined
                        }
                    },
                }
        ))
    }

    public getProp(garbage: Garbage): void {
        this.startRecycling();
        garbage.resycledRate = garbage.type === this.type ? Garbage.BEST_RECYCLED : Garbage.WORSE_RECYCLED;
        this.planet.getGarbage(garbage, this.pipe);
    }

    public static init(playerHand: PlayerHand, planet: Planet): Array<GarbageBin> {
        const leftGarbageBin = new GarbageBin(playerHand, "plastic", planet, 1)
        const middleGarbageBin = new GarbageBin(playerHand, "metal", planet, 2)
        const rightGarbageBin = new GarbageBin(playerHand, "paper", planet, 3)
        return [leftGarbageBin, middleGarbageBin,  rightGarbageBin]
    }

}