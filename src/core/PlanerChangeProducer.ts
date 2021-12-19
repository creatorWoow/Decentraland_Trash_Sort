import {Garbage} from "../entities/Garbage";

@EventConstructor()
export class OnPlanetChangeEvent {

    garbage: Garbage;

    constructor(garbage: Garbage) {
        log("Создано новое событие");
        this.garbage = garbage;
    }
}

export class PlanetChangeProducer extends Entity {

    constructor(eventManger: EventManager) {
        super();
        this.eventManager = eventManger;
    }

    public produce(garbage: Garbage) {
        this.eventManager?.fireEvent(new OnPlanetChangeEvent(garbage));
    }
}