import {
    IMAGES_PATH,
    MODELS_PATH,
    SOUNDS_PATH
} from "./components/core/Constants";
import {Sound} from "./components/entities/Sound";

export default {
    sounds: {
        monitor: new AudioClip(SOUNDS_PATH + '/robots/alice.mp3'),
        clock: new Sound(new AudioClip(SOUNDS_PATH + "/clocking.mp3"), false),
        buttonClick: new Sound(new AudioClip(SOUNDS_PATH + "/button-click.mp3"), false),
        garbage: {
            pickup: new Sound(new AudioClip(SOUNDS_PATH + '/pickup.mp3'), false),
            cantPickUp: new Sound(new AudioClip(SOUNDS_PATH + '/cant_pickup.mp3'), false)
        },
        garbageBin: {
            successRecyclingSound: new Sound(new AudioClip(SOUNDS_PATH + "/success-recycling-sound.wav"), false),
            errorRecyclingSound: new Sound(new AudioClip(SOUNDS_PATH + "/error-recycling-sound.wav"), false),
            recyclingSound: new Sound(new AudioClip(SOUNDS_PATH + "/bin-working-sound.wav"), false),
        },
        game: {
            successGameEndingSound: new Sound(new AudioClip(SOUNDS_PATH + "/success-game-end.wav"), false),
            loseGameEndingSound: new Sound(new AudioClip(SOUNDS_PATH + "/lose-game-ending.mp3"), false),
        },
    },
    models: {
        npc: {
            monitor: MODELS_PATH + '/monitor.glb'
        },
        button: MODELS_PATH + "/button.glb",
        clock: MODELS_PATH + "/clockwork.glb",
        garbageBin: MODELS_PATH + '/trashbin.glb',
        planet: {
            main: MODELS_PATH + '/planet.glb',
            red: MODELS_PATH + '/red_planet.glb',
        },
        likeHeart: MODELS_PATH + '/heart.glb',
        scene: MODELS_PATH + '/scene.glb',
    },
    textures: {
        monitorPortrait: IMAGES_PATH + '/portraits/monitor.png',
        blank: new Texture(IMAGES_PATH + '/ui/blank.png'),
        buttonE: new Texture(IMAGES_PATH + '/ui/buttonE.png'),
        buttonF: new Texture(IMAGES_PATH + '/ui/buttonF.png'),
        leftClickIcon: new Texture(IMAGES_PATH + '/ui/leftClickIcon.png'),
        textPanel: new Texture(IMAGES_PATH + '/ui/textPanel.png'),
    },
    sceneId: "61b906c4dd08def8380ababf"
}
