export class PhysicsWorld {

    private readonly _world: CANNON.World;
    private readonly _physicsMaterial: CANNON.Material;

    constructor() {
        this._world = PhysicsWorld.initWorld();
        this._physicsMaterial = this.initPhysicsMaterial();
    }

    private static initWorld(): CANNON.World {
        const world = new CANNON.World();
        world.quatNormalizeSkip = 0;
        world.quatNormalizeFast = false;
        world.gravity.set(0, -9.82, 0);
        return world;
    }

    private initPhysicsMaterial(): CANNON.Material {
        // Setup ground material
        const physicsMaterial = new CANNON.Material('groundMaterial');
        const ballContactMaterial = new CANNON.ContactMaterial(
            physicsMaterial, physicsMaterial, {friction: 1, restitution: 0.5});
        this._world.addContactMaterial(ballContactMaterial);

        // Create a ground plane and apply physics material
        const groundShape: CANNON.Plane = new CANNON.Plane();
        const groundBody: CANNON.Body = new CANNON.Body({mass: 0});
        groundBody.addShape(groundShape);
        groundBody.material = physicsMaterial;

        // Reorient ground plane to be in the y-axis
        groundBody.quaternion.setFromAxisAngle(
            new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        groundBody.position.set(0, 0.05, 0);
        this._world.addBody(groundBody);

        return physicsMaterial;
    }

    get world(): CANNON.World {
        return this._world;
    }

    get physicsMaterial(): CANNON.Material {
        return this._physicsMaterial;
    }
}
