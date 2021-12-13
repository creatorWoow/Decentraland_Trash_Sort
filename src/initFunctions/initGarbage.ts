import {Garbage} from '../classes/Garbage';
import {PlayerHand} from '../classes/PlayerHand';


const Cans: Array<Garbage> = []


function getRandomGarbage() {
  let models = ["plastic_1.glb", "plastic_2.glb", "plastic_3.glb", "paper_1.glb", "paper_2.glb", "metal_can.glb", ""]
  const randomElement = models[Math.floor(Math.random() * models.length)];
  return randomElement
}


export function initGarbage(propInHand: PlayerHand, cannonMaterial: CANNON.Material, cannonWorld: CANNON.World) : Array<Garbage> {
  /* Creating */
  if (Cans.length != 0)
  {
      Cans.forEach(can => {
          can.getComponent(Transform).position.set(5 + Math.random() * 0.2, 7 + Math.random() * 0.3, 9.7 + Math.random() * 0.3)
          can.disable()
      });
      return Cans
  }
  for (let i = 0 ; i < Garbage.GARBAGE_INIT_QUANTITY; i++) {
      Cans.push(new Garbage(
        getRandomGarbage(),
        propInHand,
        new Transform({
          position: new Vector3(5 + Math.random() * 0.2, 7 + i * 0.3, 9.7 + Math.random() * 0.3)}),
          cannonMaterial, cannonWorld))
  }
  return Cans
}