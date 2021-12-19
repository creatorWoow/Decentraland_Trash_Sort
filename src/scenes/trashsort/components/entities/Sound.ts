/**
 * Класс-обертка над классом AudioSource из sdk децентраленда
 */
export class Sound extends Entity {
    constructor(audio: AudioClip, loop: boolean, transform?: Vector3) {
        super()
        engine.addEntity(this);
        this.addComponent(new AudioSource(audio));
        this.getComponent(AudioSource).loop = loop;
        this.addComponent(new Transform());
        if (transform) {
            this.getComponent(Transform).position = transform
        } else {
            this.getComponent(Transform).position = Camera.instance.position
        }
    }
}
