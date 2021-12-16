import {Garbage} from './Garbage';

export class PlayerHand {
  private _body: CANNON.Body | undefined
  private _prop: Garbage | undefined
  
  constructor(body?: CANNON.Body | undefined, entity?: Garbage | undefined) {
    this._body = body
    this._prop = entity
  }

  clearHand() {
    if (!this.hasProp())
      return;
    this._prop = undefined;
    this._body = undefined;
  }

  hasProp() : boolean {
    return this._body !== undefined && this._prop !== undefined;
  }

  get body(): CANNON.Body | undefined {
    return this._body;
  }

  set body(value: CANNON.Body | undefined) {
    this._body = value;
  }

  get prop(): Garbage | undefined {
    return this._prop;
  }

  set prop(value: Garbage | undefined) {
    this._prop = value;
  }
}