import {Planet} from 'src/entities/Planet';
import * as ui from '@dcl/ui-scene-utils';
import * as utils from '@dcl/ecs-scene-utils';
import {PlayerHand} from './PlayerHand';
import {Garbage} from './Garbage';
import {MODELS_PATH} from '../core/Constants';

/**
 * Мусорка определенного типа
 */
export class GarbageBin extends Entity {

    TRASHBIN_WORK_ANIM = "trashbin_work";
    TRASHBIN_TANK_ANIM = "trashbin_work2";
    TRASHBIN_PIPE_ANIM = "trashbin_work3";
    TRASHBIN_BUTTON_ANIM = "buttonanim";
    TRASHBIN_SUCCESS_ANIM = "successanim";
    TRASHBIN_DENIED_ANIM = "denied_anim";

    private static garbageBinShape = new GLTFShape(MODELS_PATH + '/trashbin.glb');
    private static STOP_BIN_CLIP = 'Stop';
    private readonly animator: Animator;


    private planet: Planet;
    private readonly type: string;
    private readonly pipe: number;

    /**
     * Создает мусорку с переданным в аргументы типом и номером трубы
     * @param {PlayerHand} playerHand рука игрока, требуется для подсчета мусора
     * @param {string} garbageType тип мусорки (пластик, бумага, метал)
     * @param {Planet} planet планета, с которой взаимодействуют мусорки
     * @param {number} pipeNumber номер трубы
     */
    constructor(
        playerHand: PlayerHand,
        garbageType: string,
        planet: Planet,
        pipeNumber: number) {
        super();
        this.type = garbageType;
        this.planet = planet;
        this.pipe = pipeNumber;
        this.animator = new Animator();
        this.setupEntity();
        this.createEnterPoint(playerHand);
        this.initAnimations();
    }

    /**
     * Иницилазириует dcl сущность
     */
    private setupEntity() {
        /* Позиция, размер */
        this.addComponent(GarbageBin.garbageBinShape);
        this.addComponent(
            new Transform(
                {
                    position: this.planet.getPositionByPipe(this.pipe - 1),
                    scale: new Vector3(1, 1, 1).scale(0.5),
                }));


    }

    private initAnimations() {
        this.animator.addClip(new AnimationState(this.TRASHBIN_WORK_ANIM, {looping: false}));
        this.animator.addClip(new AnimationState(this.TRASHBIN_PIPE_ANIM, {looping: false}));
        this.animator.addClip(new AnimationState(this.TRASHBIN_TANK_ANIM, {looping: false}));
        this.animator.addClip(new AnimationState(this.TRASHBIN_BUTTON_ANIM, {looping: false}));
        this.animator.addClip(new AnimationState(this.TRASHBIN_DENIED_ANIM, {looping: false}));
        this.animator.addClip(new AnimationState(this.TRASHBIN_SUCCESS_ANIM, {looping: false}));
        this.addComponent(this.animator);
        engine.addEntity(this);
    }

    /**
     * Запускает анимацию переработки
     */
    private startRecycling() {
        this.getComponent(Animator).getClip(this.TRASHBIN_WORK_ANIM).play()
        this.getComponent(Animator).getClip(this.TRASHBIN_PIPE_ANIM).play()
        this.getComponent(Animator).getClip(this.TRASHBIN_BUTTON_ANIM).play()
        this.getComponent(Animator).getClip(this.TRASHBIN_TANK_ANIM).play()
    }

    private createEnterPoint(playerHand: PlayerHand) {
        const shape = new utils.TriggerBoxShape(
            new Vector3(1, 1, 1),
            new Vector3(-1, 2, 0),
        );

        this.addComponent(new utils.TriggerComponent(
            shape,
            {
                onCameraEnter: () => {
                    log("Пользователь пытается сдать мусор с типом " +
                    playerHand.prop?.type, "; тип мусорки: " + this.type)
                    if (!playerHand || !playerHand.prop)
                        return;

                    if (playerHand.prop.type === this.type)
                        this.recycleRightProp(playerHand.prop);
                    else
                        this.recycleWrongProp(playerHand.prop);
                    playerHand.prop.disable();
                    playerHand.clearHand();
                }
            },
        ));
    }

    recycleWrongProp(garbage: Garbage) {
        log(`Пользователь неправильно положил мусор с типом ${garbage.type}`)
        garbage.recycledRate = Garbage.WORSE_RECYCLED;
        this.startRecycling();
        ui.displayAnnouncement('You did wrong');
        this.getComponent(Animator).getClip(this.TRASHBIN_DENIED_ANIM).play();
        this.planet.getGarbage(garbage, this.pipe);
    }

    recycleRightProp(garbage: Garbage) {
        log(`Пользователь рассортировал мусор с типом ${garbage.type} правильно`)
        garbage.recycledRate = Garbage.BEST_RECYCLED;
        this.startRecycling();
        ui.displayAnnouncement("You did correct");
        this.getComponent(Animator).getClip(this.TRASHBIN_SUCCESS_ANIM).play();
        this.planet.getGarbage(garbage, this.pipe);
    }

    public static init(playerHand: PlayerHand, planet: Planet): Array<GarbageBin> {
        const leftGarbageBin = new GarbageBin(playerHand, 'plastic', planet, 1);
        const middleGarbageBin = new GarbageBin(playerHand, 'metal', planet, 2);
        const rightGarbageBin = new GarbageBin(playerHand, 'paper', planet, 3);
        return [leftGarbageBin, middleGarbageBin, rightGarbageBin];
    }
}
