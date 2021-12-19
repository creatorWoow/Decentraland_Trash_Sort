import {IMAGES_PATH, MODELS_PATH, SOUNDS_PATH} from "../core/Constants";

export default {
  sounds: {
    alice: new AudioClip(SOUNDS_PATH + '/robots/alice.mp3')
  },
  models: {
    robots: {
      alice: MODELS_PATH + '/robots/alice.glb',
      rings: new GLTFShape(MODELS_PATH + '/robots/rings.glb'),
    },
  },
  textures: {
    blank: new Texture(IMAGES_PATH + '/ui/blank.png'),
    buttonE: new Texture(IMAGES_PATH + '/ui/buttonE.png'),
    buttonF: new Texture(IMAGES_PATH + '/ui/buttonF.png'),
    leftClickIcon: new Texture(IMAGES_PATH + '/ui/leftClickIcon.png'),
    textPanel: new Texture(IMAGES_PATH + '/ui/textPanel.png'),
  },
}
