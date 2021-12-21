import {setTimeout} from "@dcl/ecs-scene-utils";
import resources from "../../resources";
import {OFFSET_VECTOR} from "../core/Constants";

export class Clock extends Entity {

    private static CLOCKWORK_ANIMATION = 'Circle.001Action';

    /* Время, когда таймер закончится 45 секунд */
    public static TIMER_DURATION: number = 45000;
    private timer: Entity | undefined;
    private _clockingSound = resources.sounds.clock;

    constructor() {
        super();
        this.initEntity();
    }

    private initEntity(): void {
        this.addComponent(new GLTFShape(resources.models.clock));
        this.addComponent(new Transform({position :
                Vector3.Zero().add(OFFSET_VECTOR)}))
        this.initAnimation();
        engine.addEntity(this);
    }

    private initAnimation() {
        const animator = new Animator();
        animator.addClip(
            new AnimationState(Clock.CLOCKWORK_ANIMATION, {looping: false}));
        this.addComponent(animator);
    }

    /**
     * Запускает анимацию таймера
     */
    public startTimer(callback: () => void) {
        this.timer = setTimeout(Clock.TIMER_DURATION, callback);
        this.getComponent(Animator).getClip(Clock.CLOCKWORK_ANIMATION).play();
        this._clockingSound.getComponent(AudioSource).playing = true;
    }

    /**
     * Останавливает таймер и сбрасывает
     */
    public stopTimer() {
        if (this.timer !== undefined)
            engine.removeEntity(this.timer);
        this.getComponent(Animator).getClip(Clock.CLOCKWORK_ANIMATION).stop();
        this.getComponent(Animator).getClip(Clock.CLOCKWORK_ANIMATION).reset();
        this._clockingSound.getComponent(AudioSource).playing = false;
    }

    /**
     * Останавливает анимацию таймера и сбрасывает его в начальное состояние
     */
    public resetTimer() {
        if (this.timer !== undefined)
            engine.removeEntity(this.timer);
        this.getComponent(AudioSource).playing = false;
        this.getComponent(Animator).getClip(Clock.CLOCKWORK_ANIMATION).stop();
        this.getComponent(Animator).getClip(Clock.CLOCKWORK_ANIMATION).reset();
        this.getComponent(Animator).getClip(Clock.CLOCKWORK_ANIMATION).play();
        this._clockingSound.getComponent(AudioSource).playing = true;
    }
}
