import { PlayerHand } from "src/game"
import { Sound } from "./sound"

const pickUpSound = new Sound(new AudioClip("sounds/pickUp.mp3"), false)
const throwSound = new Sound(new AudioClip("sounds/throw.mp3"), false)

const THROW_STRENGTH_MULTIPLIER = 0.125

const GARBAGE_QUANTITY = 10

const Cans: Array<Garbage> = []


export class Garbage extends Entity {

  public propInHand
  public isActive: boolean = false
  public isThrown: boolean = true
  public body: CANNON.Body
  public world: CANNON.World

  public static BEST_RECYCLED = 1
  public static WORSE_RECYCLED = 0

  private _type: string

  private _resycledRate: number

  constructor(modelFilename: string,
              propInHand: PlayerHand,
              transform: Transform,
              cannonMaterial: CANNON.Material,
              cannonWorld: CANNON.World) {
    super()
    this._type = modelFilename.split("_")[0]
    this._resycledRate = 1
    this.propInHand =  propInHand
    const canShape = new GLTFShape("models/" + modelFilename)
    canShape.withCollisions = false
    this.addComponent(canShape)
    canShape.visible = false
    this.addComponent(transform)
    this.world = cannonWorld
    this.toggleOnPointerDown(true)

    // Create physics body for ball
    this.body = new CANNON.Body({
      mass: 1, // kg
      position: new CANNON.Vec3(transform.position.x, transform.position.y, transform.position.z), // m
      shape: new CANNON.Cylinder(0.115, 0.115, 0.286, 28), // Create sphere shaped body with a diameter of 0.22m
    })


    // Add material and dampening to stop the ball rotating and moving continuously
    this.body.sleep()
    this.body.material = cannonMaterial
    this.body.linearDamping = 0.4
    this.body.angularDamping = 0.4
    this.world.addBody(this.body)

    // Ball collision
    // this.body.addEventListener("collide", () => {
    //   let randomTrackNo = Math.floor(Math.random() * 2)
    //   hitSounds[randomTrackNo].playAudioOnceAtPosition(this.getComponent(Transform).position)
    // })

    this.addComponent(new Animator())
    this.getComponent(Animator).addClip(new AnimationState("PickUp", { looping: false }))

    engine.addEntity(this)
  }

  playerPickup(): void {
    pickUpSound.getComponent(AudioSource).playOnce()
    this.propInHand.body = this.body
    this.propInHand.entity = this
    log(this.propInHand)
    this.isActive = true
    this.body.sleep()
    this.isThrown = false
    this.body.position.set(Camera.instance.position.x, Camera.instance.position.y, Camera.instance.position.z)
    this.setParent(Attachable.FIRST_PERSON_CAMERA)
    this.getComponent(Transform).position.set(0, -0.2, 0.5)
    this.playPickUpAnim()
    this.toggleOnPointerDown(false)
  }

  public enable() : void {
      this.body.wakeUp()
      this.getComponent(GLTFShape).visible = true
  }

  public disable() : void {
    this.body.sleep()
    this.getComponent(GLTFShape).visible = false
    }

  playerThrow(throwDirection: Vector3, throwPower: number): void {
    throwSound.getComponent(AudioSource).playOnce()
    this.propInHand.body = undefined
    this.propInHand.entity = undefined

    this.isActive = false
    this.isThrown = true
    this.setParent(null)
    this.toggleOnPointerDown(true)

    // Physics
    this.body.wakeUp()
    this.body.velocity.setZero()
    this.body.angularVelocity.setZero()


    this.body.position.set(
      Camera.instance.feetPosition.x + throwDirection.x,
      throwDirection.y + Camera.instance.position.y,
      Camera.instance.feetPosition.z + throwDirection.z
    )

    let throwPowerAdjusted = throwPower * THROW_STRENGTH_MULTIPLIER

    // Throw
    this.body.applyImpulse(
      new CANNON.Vec3(throwDirection.x * throwPowerAdjusted, throwDirection.y * throwPowerAdjusted, throwDirection.z * throwPowerAdjusted),
      new CANNON.Vec3(this.body.position.x, this.body.position.y, this.body.position.z)
    )
  }

  toggleOnPointerDown(isOn: boolean): void {
    if (isOn) {
      this.addComponentOrReplace(
        new OnPointerDown(
          () => {
            this.playerPickup()
          },
          { hoverText: "Pick up", distance: 6, button: ActionButton.PRIMARY }
        )
      )
    } else {
      if (this.hasComponent(OnPointerDown)) this.removeComponent(OnPointerDown)
    }
  }

  playPickUpAnim() {
    this.getComponent(GLTFShape).visible = true
    this.getComponent(Animator).getClip("PickUp").stop()
    this.getComponent(Animator).getClip("PickUp").play()
  }

  public get resycledRate(): number {
      return this._resycledRate
  }

  public set resycledRate(value: number) {
      this._resycledRate = value
  }

  public get type(): string {
      return this._type
  }
  
  public set type(value: string) {
      this._type = value
  }

}

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
  for (let i = 0 ; i < GARBAGE_QUANTITY; i++) {
      Cans.push(new Garbage(
        getRandomGarbage(),
        propInHand,
        new Transform({
          position: new Vector3(5 + Math.random() * 0.2, 7 + i * 0.3, 9.7 + Math.random() * 0.3)}),
          cannonMaterial, cannonWorld))
  }
  return Cans
}