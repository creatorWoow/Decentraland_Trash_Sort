import {GarbageBin} from "../entities/GarbageBin";
import {Planet} from "../entities/Planet";
import {trashBinIndexes, trashBinVertices} from "../meshdata/binMesh";
import {boundaryIndexes, boundaryVertices} from "../meshdata/boundaryMesh";

export function colliders(bins: Array<GarbageBin>,
                          planet: Planet,
                          boundary: Entity,
                          cannonWorld: CANNON.World): void {

    /* Trimesh for trash bins */
    let binShape = new CANNON.Trimesh(trashBinVertices, trashBinIndexes)
    bins.forEach(bin => {
        const transform = bin.getComponent(Transform).position
        const binBody = new CANNON.Body({
            mass: 0,
            position:
                new CANNON.Vec3(transform.x, transform.y, transform.z).scale(0.3)
        })
        binBody.addShape(binShape)
        cannonWorld.addBody(binBody)
    })


    /* Trimesh for the components */
    let boundaryShape = new CANNON.Trimesh(boundaryVertices, boundaryIndexes)
    const transform = boundary.getComponent(Transform).position
    const boundaryBody = new CANNON.Body({
        mass: 0,
        position:
            new CANNON.Vec3(8, 0, 8)
    })
    boundaryBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, -1, 0), 90)
    boundaryBody.addShape(boundaryShape)
    cannonWorld.addBody(boundaryBody)

    // Invisible walls
    //#region
    const wallShape = new CANNON.Box(new CANNON.Vec3(8, 32, 0.5))
    const wallNorth = new CANNON.Body({
        mass: 0,
        shape: wallShape,
        position: new CANNON.Vec3(8, 0, 16.45),
    })
    cannonWorld.addBody(wallNorth)

    const wallSouth = new CANNON.Body({
        mass: 0,
        shape: wallShape,
        position: new CANNON.Vec3(8, 0, -0.45),
    })
    cannonWorld.addBody(wallSouth)

    const wallWest = new CANNON.Body({
        mass: 0,
        shape: wallShape,
        position: new CANNON.Vec3(-0.45, 0, 8),
    })
    wallWest.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2)
    cannonWorld.addBody(wallWest)

    const wallEast = new CANNON.Body({
        mass: 0,
        shape: wallShape,
        position: new CANNON.Vec3(16.45, 0, 8),
    })
    wallEast.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2)
    cannonWorld.addBody(wallEast)
    //#endregion


    //#endregion
}
