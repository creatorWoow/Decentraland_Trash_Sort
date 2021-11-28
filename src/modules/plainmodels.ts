import * as utils from "@dcl/ecs-scene-utils";
import {Delay} from "@dcl/ecs-scene-utils";
import { Garbage } from "./ball";

const BUTTON_ACTION_NAME: string = "Button_Action"

@Component("cooldown")
export class Cooldown {}

/**
 * Инициализирует трубу, из которой падает мусор
 */
export function initPipe(): Entity {
    const pipe = new Entity()
    pipe.addComponent(new GLTFShape("models/truba.glb"))
    pipe.addComponent(new Transform({
        position: new Vector3(5, 0, 9.7),
        scale: new Vector3(1, 1, 1).scale(0.5)}))
    engine.addEntity(pipe)
    return pipe
}

/**
 * Инициализирует границы сцены
 */
export function initBoundary() : Entity {
    const boundary = new Entity()
    boundary.addComponent(new GLTFShape("models/boundary.glb"))
    boundary.addComponent(new Transform({
        position: new Vector3(8, 0, 8),
        scale: Vector3.One().scale(0.95)
    }).rotate(Vector3.Down(), 90))
    engine.addEntity(boundary)
    return boundary
}

export function initButton(Cans: Array<Garbage>) {

    /* Инициализация подставки для кнопки */
    const buttonStand = new Entity()
    buttonStand.addComponent(new BoxShape())
    buttonStand.addComponent(new Transform({
        position: new Vector3(3, 0, 3),
        scale: new Vector3(0.5, 2.3, 0.5).scale(1.2),
    }).rotate(new Vector3(1, 0, 0), 10))
    engine.addEntity(buttonStand)

    /* Создание кнопки для старта игры */
    let bpos = buttonStand.getComponent(Transform).position
    const button = new Entity()
    button.addComponent(new GLTFShape("models/button.glb"))
    button.addComponent(new Transform({
        position: new Vector3(bpos.x, bpos.y + 1.36, bpos.z + 0.2)
    }))

    const buttonAnimator = new Animator()
    buttonAnimator.addClip(new AnimationState(BUTTON_ACTION_NAME, {looping: false}))
    button.addComponent(buttonAnimator)
    button.addComponent(new OnClick(() => {

        if (button.hasComponent(Cooldown))
            return

        button.getComponent(Animator).getClip(BUTTON_ACTION_NAME).stop()
        button.getComponent(Animator).getClip(BUTTON_ACTION_NAME).play()
        button.addComponent(new Cooldown())
        button.addComponent(
            new utils.Delay(1000, () => {
                button.removeComponent(Cooldown)
            })
        )
        Cans.forEach(can => {
            can.enable()
        })
        button.getComponent(Delay).onTargetTimeReached(button)


    }))
    engine.addEntity(button)
}