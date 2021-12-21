import {NPC} from '@dcl/npc-scene-utils'
import {NPCDialog} from 'src/scenes/trashsort/components/npc/DialogData'
import {setTimeout} from "@dcl/ecs-scene-utils";
import resources from "../../resources";
import {OFFSET_VECTOR} from "../core/Constants";

// Monitor
export function createNPC(): NPC {

    let dialogWasEnded = false;
    const npc = new NPC(
        {
            position: new Vector3(5, 0, 12).add(OFFSET_VECTOR),
            rotation: Quaternion.Euler(0, -90, 0),
            scale: Vector3.One().scale(0.7)
        },
        resources.models.npc.monitor,
        () => {
            if (dialogWasEnded)
                return;

            let dummyent = new Entity()
            engine.addEntity(dummyent)

            // sound
            npc.addComponentOrReplace(new AudioSource(resources.sounds.monitor))
            npc.getComponent(AudioSource).playOnce()

            // dialog UI
            npc.talk(NPCDialog)
            dialogWasEnded = true;
            setTimeout(120000, () => {
                dialogWasEnded = false;
            })
        },
        {
            faceUser: false,
            portrait: {
                path: resources.textures.monitorPortrait,
                height: 256,
                width: 256,
                section: {
                    sourceHeight: 512,
                    sourceWidth: 512,
                },
            },
        }
    )
    return npc;
}