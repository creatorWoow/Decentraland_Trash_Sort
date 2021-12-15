import {Garbage} from "../entities/Garbage";

// Set high to prevent tunnelling
export const FIXED_TIME_STEPS = 1.0 / 60;
export const MAX_TIME_STEPS = 10;

export class GarbagePhysicsSystem implements ISystem {

    garbageOnFloor: Array<Garbage>;
    world: CANNON.World;

    constructor(garbageOnFloor: Array<Garbage>, world: CANNON.World) {
        this.garbageOnFloor = garbageOnFloor;
        this.world = world;
    }

    update(dt: number): void {
        this.world.step(FIXED_TIME_STEPS, dt, MAX_TIME_STEPS);

        for (let i = 0; i < this.garbageOnFloor.length; i++) {
            if (!this.garbageOnFloor[i].isActive) {
                this.garbageOnFloor[i].getComponent(Transform).position
                    .copyFrom(this.garbageOnFloor[i].body.position);

                this.garbageOnFloor[i].getComponent(Transform).rotation
                    .copyFrom(this.garbageOnFloor[i].body.quaternion);
            }
        }
    }
}