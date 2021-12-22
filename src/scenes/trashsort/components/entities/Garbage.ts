import {PlayerHand} from './PlayerHand';
import {GARBAGE_SHAPES, MODELS_PATH} from '../core/Constants';
import {PhysicalWorld} from './PhysicalWorld';
import resources from "../../resources";
import {GarbageGenerator} from "../core/GarbageGenerator";

const pickUpSound = resources.sounds.garbage.pickup;
const cantPickUpSound = resources.sounds.garbage.cantPickUp;

export const GARBAGE_GROUP_NAME = 'Garbage';
export const ACTIVE_GARBAGE_COMPONENT = "ActiveGarbage";

@Component(GARBAGE_GROUP_NAME)
class GarbageGroup {
}

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
    garbageGenerator: GarbageGenerator;

    /**
     * Создает объект мусора
     * @param {string} modelFilename имя файла модели мусора
     * @param {PlayerHand} playerHand рука пользователя, в которую будет
     * кластаться мусор
     * @param {Transform} position начальная позиция мусора на сцене
     * @param {PhysicalWorld} physicsWorld физический мир библиотеки Cannon
     */
    constructor(
        modelFilename: string,
        playerHand: PlayerHand,
        position: Vector3,
        physicsWorld: PhysicalWorld,
        garbageGenerator: GarbageGenerator) {
        super();

        this.world = physicsWorld.world;
        this.material = physicsWorld.physicsMaterial
        this._type = modelFilename.split('_')[0];
        this._recycledRate = 1;
        this.playerHand = playerHand;
        this.garbageGenerator = garbageGenerator;
        this.initialPosition = new Vector3(position.x, position.y, position.z);
        this.currentPosition = new Vector3(position.x, position.y, position.z);

        log(`Создание мусора с параметрами: (type=${this.type},` +
            `initialPosition=${position})`)

        /* Инициализация модели */
        const canShape = new GLTFShape(MODELS_PATH + "/garbage/" + modelFilename);
        canShape.withCollisions = false;
        this.addComponent(canShape);
        canShape.visible = false;
        this.body = this.initGarbagePhysics(modelFilename)
        this.addComponent(new Transform({position: position}));

        this.toggleOnPointerDown(true);

        this.addComponent(new Animator());
        this.getComponent(Animator).addClip(new AnimationState('PickUp',
            {looping: false}));

        this.addComponent(new GarbageGroup());
        engine.addEntity(this);
    }

    initGarbagePhysics(modelName: string): CANNON.Body {
        const body = new CANNON.Body({
            mass: 1, // kg
            position: new CANNON.Vec3(
                this.currentPosition.x,
                this.currentPosition.y,
                this.currentPosition.z),
            shape: GARBAGE_SHAPES[modelName],
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
        if (this.playerHand.hasProp()) {
            cantPickUpSound.getComponent(AudioSource).playOnce();
            return;
        }
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
    public enable(): void {
        this.body.wakeUp();
        this.isEnabled = false;
        this.isActive = true;
        this.getComponent(GLTFShape).visible = true;
    }

    /**
     * Делает объект невидимым
     */
    public disable(): void {
        if (!this.isActive)
            return;
        this.body.sleep();
        this.isActive = false;
        this.isEnabled = true;
        this.setParent(null);
        this.toggleOnPointerDown(true);
        this.getComponent(GLTFShape).visible = false;
        this.getComponent(GLTFShape).withCollisions = false;
        log("Текущее положение мусора: ", this.initialPosition);
        this.body.position.set(
            this.initialPosition.x,
            this.initialPosition.y,
            this.initialPosition.z);
        this.getComponent(Transform).position.set(
            this.initialPosition.x,
            this.initialPosition.y,
            this.initialPosition.z)
        this.garbageGenerator.returnToBuffer(this);
    }

    toggleOnPointerDown(isOn: boolean): void {
        if (isOn) {
            this.addComponentOrReplace(
                new OnPointerDown(
                    () => {
                        this.playerPickup();
                    },
                    {
                        hoverText: 'Pick up',
                        distance: 6,
                        button: ActionButton.PRIMARY
                    },
                ),
            );
        } else {
            if (this.hasComponent(OnPointerDown)) this.removeComponent(OnPointerDown);
        }
    }

    /**
     * Проигрывает анимацию мусора с земли
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

    public toString = (): string => {
        return `Garbage (type: ${this.type},` +
            `recycledRate: ${this.recycledRate}, ` +
            `position: ${this.initialPosition})`;
    }

    public isWorseRecycled(): boolean {
        return this.recycledRate === Garbage.WORSE_RECYCLED;
    }
}
