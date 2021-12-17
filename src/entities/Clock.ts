import {MODELS_PATH} from "../core/Constants";

export class Clock extends Entity {

    private static CLOCKWORK_ANIMATION = 'Circle.001Action';
    private readonly _position = new Vector3(8, 0, 13);
    private readonly _animation = new AnimationState(Clock.CLOCKWORK_ANIMATION, {looping: false})
    private readonly _animator = new Animator();
    private readonly _scale = new Vector3(1, 1, 1).scale(0.5)

    constructor() {
        super();
        this.initEntity();
    }

    private initEntity(): void {
        this.addComponent(new GLTFShape(MODELS_PATH + "/clockwork.glb"));
        this.addComponent(new Transform({
            position: this._position,
            scale: this._scale,
        }).rotate(Vector3.Down(), 180));

        this._animator.addClip(this._animation);
        this.addComponent(this._animator);
        engine.addEntity(this);
    }


    /**
     * Запускает анимацию таймера
     */
    public startTimer() {
        this.getComponent(Animator).getClip(Clock.CLOCKWORK_ANIMATION).play();
    }

    /**
     * Останавливает таймер и сбрасывает
     */
    public stopTimer() {
        this.getComponent(Animator).getClip(Clock.CLOCKWORK_ANIMATION).stop();
        this.getComponent(Animator).getClip(Clock.CLOCKWORK_ANIMATION).reset();
    }

    /**
     * Останавливает анимацию таймера и сбрасывает его в начальное состояние
     */
    public resetTimer() {
        this.getComponent(Animator).getClip(Clock.CLOCKWORK_ANIMATION).stop();
        this.getComponent(Animator).getClip(Clock.CLOCKWORK_ANIMATION).reset();
        this.getComponent(Animator).getClip(Clock.CLOCKWORK_ANIMATION).play();
    }
}
