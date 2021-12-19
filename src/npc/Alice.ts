import {NPC, NPCDelay} from '@dcl/npc-scene-utils'
import resources from './resources'
import {AliceDialog} from 'dialogData'
import {IMAGES_PATH} from "../core/Constants";
import {setTimeout} from "@dcl/ecs-scene-utils";

// Alice
export function createAlice(): NPC {

    let dialogWasEnded = false;
    const alice = new NPC(
        {
            position: new Vector3(5, 1.6, 12),
            rotation: Quaternion.Euler(0, 180, 0),
        },
        resources.models.robots.alice,
        () => {
            if (dialogWasEnded)
                return;
            // animations
            alice.playAnimation('Hello', true, 2)

            let dummyent = new Entity()
            dummyent.addComponent(
                new NPCDelay(2, () => {
                    alice.playAnimation('Talk')
                })
            )
            engine.addEntity(dummyent)

            // sound
            alice.addComponentOrReplace(new AudioSource(resources.sounds.alice))
            alice.getComponent(AudioSource).playOnce()

            // dialog UI
            alice.talk(AliceDialog)
            dialogWasEnded = true;
            setTimeout(120000, () => {
                dialogWasEnded = false;
            })
        },
        {
            faceUser: true,
            portrait: {
                path: IMAGES_PATH + '/portraits/alice.png',
                height: 256,
                width: 256,
                section: {
                    sourceHeight: 512,
                    sourceWidth: 512,
                },
            },
            onWalkAway: () => {
                alice.playAnimation('Goodbye', true, 2)
            },
        }
    )

    const ringShape = resources.models.robots.rings

    const aliceRings = new Entity()
    aliceRings.addComponent(ringShape)
    aliceRings.addComponent(
        new Transform({
            position: new Vector3(0, -0.65, 0),
        })
    )
    aliceRings.setParent(alice)
    return alice;
}