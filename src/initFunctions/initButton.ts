import {Garbage} from '../classes/Garbage';
import * as utils from '@dcl/ecs-scene-utils';
import {Delay} from '@dcl/ecs-scene-utils';

@Component("cooldown")
export class Cooldown {}


const BUTTON_ACTION_NAME: string = "Button_Action"
/**
 *
 * Инициализация подставки для кнопки
 */
export function initButton(Cans: Array<Garbage>) {
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