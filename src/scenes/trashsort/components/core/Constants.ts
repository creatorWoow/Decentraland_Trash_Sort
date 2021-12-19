export const MODELS_PATH = 'models';
export const SOUNDS_PATH = 'sounds';
export const IMAGES_PATH = 'images';

export const GARBAGE_SHAPES : {[key: string]: CANNON.Shape} = {
    "plastic_1.glb" : new CANNON.Cylinder(0.115, 0.1, 0.486, 28),
    "plastic_2.glb": new CANNON.Cylinder(0.115, 0.1, 0.486, 28),
    "plastic_3.glb": new CANNON.Cylinder(0.115, 0.1, 0.486, 28),
    "paper_1.glb" : new CANNON.Cylinder(0.115, 0.1, 0.486, 28),
    "paper_2.glb" : new CANNON.Cylinder(0.115, 0.1, 0.486, 28),
    "metal_can.glb": new CANNON.Cylinder(0.115, 0.1, 0.486, 28),
}

export const GARBAGE_MODELS: Array<string> = [
    "plastic_1.glb", "plastic_2.glb", "plastic_3.glb",
    "paper_1.glb", "paper_2.glb",
    "metal_can.glb",
]
