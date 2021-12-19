import {Garbage} from "../entities/Garbage";

// Set high to prevent tunnelling
export const FIXED_TIME_STEPS = 1.0 / 60;
export const MAX_TIME_STEPS = 10;

export class GarbagePhysicsSystem implements ISystem {

    garbageOnFloor: Array<Garbage>;
    world: CANNON.World;

    constructor(world: CANNON.World) {
        this.garbageOnFloor = [];
        this.world = world;
    }

    onAddEntity(entity: IEntity) {
        if (entity instanceof Garbage) {
            log("В GarbagePhysicsSystem был добавлен новый мусор: " + entity.toString());
            this.garbageOnFloor.push(entity);
        }
    }

    /**
     * Удаляет из массива garbageOnFloor сущности с типом Garbage, если
     * они были удалены со сцены
     * @param entity сущность с типом Garbage
     */
    onRemoveEntity(entity: IEntity) {
        if (entity instanceof Garbage) {
            const index = this.garbageOnFloor.indexOf(entity);
            if (index > -1) {
                log("Из GarbagePhysicsSystem был удален мусор: " + entity.toString());
                this.garbageOnFloor.splice(index);
            }
        }
    }

    update(dt: number): void {
        this.world.step(FIXED_TIME_STEPS, dt, MAX_TIME_STEPS);

        for (let i = 0; i < this.garbageOnFloor.length; i++) {
            if (!this.garbageOnFloor[i].isEnabled) {
                this.garbageOnFloor[i].getComponent(Transform).position
                    .copyFrom(this.garbageOnFloor[i].body.position);

                this.garbageOnFloor[i].getComponent(Transform).rotation
                    .copyFrom(this.garbageOnFloor[i].body.quaternion);
            }
        }
    }
}