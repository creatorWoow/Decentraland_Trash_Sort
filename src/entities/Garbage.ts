import {PlayerHand} from './PlayerHand';
import {Sound} from './Sound';
import {MODELS_PATH, SOUNDS_PATH} from '../core/Constants';
import {PhysicsWorld} from './PhysicsWorld';

const pickUpSound = new Sound(
    new AudioClip(SOUNDS_PATH + '/pickup.mp3'), false);
const throwSound = new Sound(
    new AudioClip(SOUNDS_PATH + '/throw.mp3'), false);
const THROW_STRENGTH_MULTIPLIER = 0.125;
export const GARBAGE_GROUP_NAME = 'Garbage';
export const ACTIVE_GARBAGE_COMPONENT = "ActiveGarbage";

@Component(GARBAGE_GROUP_NAME)
class GarbageGroup {}

/**
 * Этот класс представляет из себя сущность мусора в игре. Мусор может
 * быть пластиком, металом или бумагой.
 */
export class Garbage extends Entity {

  public playerHand;

  /* True, если объект находится на сцене */
  public isActive = false;

  /* Если для предмета включена физика */
  public isEnabled = false;

  public body: CANNON.Body;
  public world: CANNON.World;
  public material: CANNON.Material
  public static BEST_RECYCLED = 1;
  public static WORSE_RECYCLED = -1;
  private _type: string;
  private _recycledRate: number;

  initialPosition: Vector3;
  currentPosition: Vector3;

  /**
   * Создает объект мусора
   * @param {string} modelFilename имя файла модели мусора
   * @param {PlayerHand} playerHand рука пользователя, в которую будет
   * кластаться мусор
   * @param {Transform} position начальная позиция мусора на сцене
   * @param {PhysicsWorld} physicsWorld физический мир библиотеки Cannon
   */
  constructor(
      modelFilename: string,
      playerHand: PlayerHand,
      position: Vector3,
      physicsWorld: PhysicsWorld) {
    super();

    this.world = physicsWorld.world;
    this.material = physicsWorld.physicsMaterial
    this._type = modelFilename.split('_')[0];
    this._recycledRate = 1;
    this.playerHand = playerHand;
    this.initialPosition = new Vector3(position.x, position.y, position.z);
    this.currentPosition = new Vector3(position.x, position.y, position.z);

    log(`Создание мусора с параметрами: (type=${this.type},` +
        `initialPosition=${position})`)

    /* Инициализация модели */
    const canShape = new GLTFShape(MODELS_PATH + "/garbage/" + modelFilename);
    canShape.withCollisions = false;
    this.addComponent(canShape);
    canShape.visible = false;
    this.body = this.initGarbagePhysics()
    this.addComponent(new Transform({position: position}));

    this.toggleOnPointerDown(true);

    this.addComponent(new Animator());
    this.getComponent(Animator).addClip(new AnimationState('PickUp',
        {looping: false}));

    this.addComponent(new GarbageGroup());
    engine.addEntity(this);
  }

  initGarbagePhysics() : CANNON.Body {
    // Create physics body for ball
    const body = new CANNON.Body({
      mass: 1, // kg
      position: new CANNON.Vec3(this.currentPosition.x,
          this.currentPosition.y,
          this.currentPosition.z), // m
      // Create sphere shaped body with a diameter of 0.22m
      shape: new CANNON.Cylinder(0.115, 0.115, 0.286, 28),
    });

    body.sleep();
    body.material = this.material;
    body.linearDamping = 0.4;
    body.angularDamping = 0.4;
    this.world.addBody(body);
    return body;
  }

  /**
   * Метод, который выполняется, когда пользователь поднимает мусор с земли
   */
  playerPickup(): void {
    pickUpSound.getComponent(AudioSource).playOnce();
    this.playerHand.body = this.body;
    this.playerHand.prop = this;
    this.isEnabled = true;
    this.body.sleep();
    this.body.position.set(
        Camera.instance.position.x,
        Camera.instance.position.y,
        Camera.instance.position.z,
    );
    this.setParent(Attachable.FIRST_PERSON_CAMERA);
    this.getComponent(Transform).position.set(0, -0.2, 0.5);
    this.playPickUpAnim();
    this.toggleOnPointerDown(false);
  }

  /**
   * Делает объект видимым
   */
  public enable() : void {
    this.body.wakeUp();
    this.isActive = true;
    this.getComponent(GLTFShape).visible = true;
  }

  /**
   * Делает объект невидимым
   */
  public disable() : void {
    this.body.sleep();
    this.isActive = false;
    this.isEnabled = false;
    this.setParent(null);
    this.toggleOnPointerDown(true);
    this.getComponent(GLTFShape).visible = false;
    this.getComponent(GLTFShape).withCollisions = false;
    log("Текущее положение мусора: ", this.initialPosition);
    this.body.position.set(
        this.initialPosition.x,
        this.initialPosition.y,
        this.initialPosition.z)
  }

  /**
   * Выполняет бросок мусора
   * @param {Vector3} throwDirection направление броска
   * @param {number} throwPower сила броска
   */
  playerThrow(throwDirection: Vector3, throwPower: number): void {
    throwSound.getComponent(AudioSource).playOnce();
    this.playerHand.clearHand()

    this.isEnabled = false;
    this.setParent(null);
    this.toggleOnPointerDown(true);

    // Physics
    this.body.wakeUp();
    this.body.velocity.setZero();
    this.body.angularVelocity.setZero();


    this.body.position.set(
        Camera.instance.feetPosition.x + throwDirection.x,
        throwDirection.y + Camera.instance.position.y,
        Camera.instance.feetPosition.z + throwDirection.z,
    );

    const throwPowerAdjusted = throwPower * THROW_STRENGTH_MULTIPLIER;

    this.body.applyImpulse(
        new CANNON.Vec3(
            throwDirection.x * throwPowerAdjusted,
            throwDirection.y * throwPowerAdjusted,
            throwDirection.z * throwPowerAdjusted,
        ),
        new CANNON.Vec3(
            this.body.position.x,
            this.body.position.y,
            this.body.position.z,
        ),
    );
  }

  toggleOnPointerDown(isOn: boolean): void {
    if (isOn) {
      this.addComponentOrReplace(
          new OnPointerDown(
              () => {
                this.playerPickup();
              },
              {hoverText: 'Pick up', distance: 6, button: ActionButton.PRIMARY},
          ),
      );
    } else {
      if (this.hasComponent(OnPointerDown)) this.removeComponent(OnPointerDown);
    }
  }

  /**
   * Проигрывает анимацию поднятия банки с земли
   */
  playPickUpAnim() {
    this.getComponent(GLTFShape).visible = true;
    this.getComponent(Animator).getClip('PickUp').stop();
    this.getComponent(Animator).getClip('PickUp').play();
  }

  /**
   * Возвращает уровень переработки мусора
   * @return {number} уровень переработки от 0 до 1
   */
  public get recycledRate(): number {
    return this._recycledRate;
  }

  /**
   * Устанавливает уровень переработки мусора
   * @param {number} value уровень переработки мусора
   */
  public set recycledRate(value: number) {
    this._recycledRate = value;
  }

  /**
   * Возвращает тип мусора
   * @return {string} тип мусора
   */
  public get type(): string {
    return this._type;
  }

  /**
   * Устанавливает тип мусора
   * @param {string} value тип мусора
   */
  public set type(value: string) {
    this._type = value;
  }
}
