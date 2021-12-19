import * as utils from '@dcl/ecs-scene-utils';
import {Delay} from '@dcl/ecs-scene-utils';
import {CoolDown, GameContext} from "../core/GameContext";
import resources from "../../resources";

const BUTTON_ACTION_NAME = 'Button_Action';

/**
 * В этом классе создает кнопка и стенд для нее.
 * При нажатии на эту кнопку начинается или перезагружается игра
 */
export class ButtonStand {
  private stand: Entity;
  private button: Entity;
  private _clickSound = resources.sounds.buttonClick;
  /**
     * Создает стенд с кнопкой
     */
  constructor() {
    this.stand = ButtonStand.initStand();
    this.button = this.initButton();
  }

  public static init() : ButtonStand {
    return new ButtonStand();
  }

  /**
     * Инициализирует подставку для кнопки
     * @return {Entity} возвращает dcl сущность
     */
  private static initStand(): Entity {
    const buttonStand = new Entity();
    buttonStand.addComponent(new BoxShape());
    buttonStand.addComponent(new Transform({
      position: new Vector3(4, 0, 4),
      scale: new Vector3(0.5, 2.3, 0.5).scale(1.2),
    }).rotate(new Vector3(1, 0, 0), 10));
    engine.addEntity(buttonStand);
    return buttonStand;
  }

  /**
   * Инициализирует кнопку для запуска игры
   * @return {Entity} объект кнопки в dcl
   */
  private initButton() : Entity {
    const button = new Entity();

    const standPosition: Vector3 = this.stand.getComponent(Transform).position;
    button.addComponent(new GLTFShape(resources.models.button));
    button.addComponent(new Transform({
      position: new Vector3(
          standPosition.x,
          standPosition.y + 1.36,
          standPosition.z + 0.2),
    }));

    const buttonAnimator = new Animator();
    buttonAnimator.addClip(new AnimationState(BUTTON_ACTION_NAME,
        {looping: false}));
    button.addComponent(buttonAnimator);
    button.addComponent(new OnClick(() => {
      this._clickSound.getComponent(AudioSource).playOnce();
      if (button.hasComponent(CoolDown)) {
        return;
      }
      button.getComponent(Animator).getClip(BUTTON_ACTION_NAME).stop();
      button.getComponent(Animator).getClip(BUTTON_ACTION_NAME).play();
      button.addComponent(new CoolDown());
      button.addComponent(
          new utils.Delay(1000, () => {
            button.removeComponent(CoolDown);
          }),
      );
      GameContext.getGameContext().startGame();
      button.getComponent(Delay).onTargetTimeReached(button);
    }));
    engine.addEntity(button);
    return button;
  }
}
