import {Dialog} from '@dcl/npc-scene-utils'

export const AliceDialog: Dialog[] = [
  {
    text: "Hi, we are codepower team",
  },
  {
    text: "Our facility was created in order to draw the attention of the inhabitants of the digital universe",
  },
  {
    text: "to one of the main problems of our physical world. Do you want to know more? ",
    isQuestion: true,
    buttons: [
      { label: 'Yeah!', goToDialog: 4 },
      { label: 'Later...', goToDialog: 3 },
    ],
  },
  {
    text: "Okay, come again",
    isEndOfDialog: true,
    triggeredByNext: () => {
    },
  },
  {
    text:
      'Littering up the planet is actually a disaster :(',
  },
  {
    text:
      'Recycling is an expensive and time-consuming process, but by sorting waste we greatly simplify and speed up it.',
  },
  {
    text:
      'Thus, just one little habit will help preserve the planet for us and our descendants.',
  },
  {
    text:
      'Help the planet, start sorting trash now ^_^',
    isQuestion: true,
    buttons: [
      { label: "Let's go-o!", goToDialog: 8 },
      { label: "I'd love to.", goToDialog: 8 },
    ],
  },
  {
    text: "Great!",
    isEndOfDialog: true,
  }
]