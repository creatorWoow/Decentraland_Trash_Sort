import {Garbage} from './Garbage';

export class PlayerHand {
  body: CANNON.Body | undefined
  entity: Garbage | undefined
  
  constructor(body?: CANNON.Body | undefined, entity?: Garbage | undefined) {
    this.body = body
    this.entity = entity
  }
}