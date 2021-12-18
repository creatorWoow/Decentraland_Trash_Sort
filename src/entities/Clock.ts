import {MODELS_PATH} from "../core/Constants";
import {setTimeout} from "@dcl/ecs-scene-utils";

export class Clock extends Entity {

    private static CLOCKWORK_ANIMATION = 'Circle.001Action';

    /* Время, когда таймер закончится 45 секунд */
    public static TIMER_DURATION: number = 45000;
    private timer: Entity | undefined;

    constructor() {
        super();
        this.initEntity();
    }

    private initEntity(): void {
        this.addComponent(new GLTFShape(MODELS_PATH + "/clockwork.glb"));
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
    }

    /**
     * Останавливает таймер и сбрасывает
     */
    public stopTimer() {
        if (this.timer !== undefined)
            engine.removeEntity(this.timer);
        this.getComponent(Animator).getClip(Clock.CLOCKWORK_ANIMATION).stop();
        this.getComponent(Animator).getClip(Clock.CLOCKWORK_ANIMATION).reset();
    }

    /**
     * Останавливает анимацию таймера и сбрасывает его в начальное состояние
     */
    public resetTimer() {
        if (this.timer !== undefined)
            engine.removeEntity(this.timer);
        this.getComponent(Animator).getClip(Clock.CLOCKWORK_ANIMATION).stop();
        this.getComponent(Animator).getClip(Clock.CLOCKWORK_ANIMATION).reset();
        this.getComponent(Animator).getClip(Clock.CLOCKWORK_ANIMATION).play();
    }
}
