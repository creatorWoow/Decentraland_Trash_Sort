import {Garbage, GARBAGE_GROUP_NAME} from "../entities/Garbage";
import {Clock} from "../entities/Clock";
import {setTimeout} from "@dcl/ecs-scene-utils";

export const GAME_CONTEXT_COMPONENT_NAME = "GameContextComponent"
export const GAME_CONTEXT_NAME = "GameContext"

@Component('coolDown')
export class CoolDown {}

@Component(GAME_CONTEXT_COMPONENT_NAME)
class GameContextComponent {}

export class GameContext extends Entity {
    private _score: number;
    private _started: boolean;
    private clockWork: Clock;
    private garbage: Record<string, Garbage>;

    constructor(clockWork: Clock) {
        super();
        this.clockWork = clockWork;
        this._started = false;
        this.addComponent(new GameContextComponent());
        this._score = 0;
        this.garbage = {};
    }

    public startGame() {
        if (this._started)
            this.resetGame();

        this.garbage =
            engine.getEntitiesWithComponent(GARBAGE_GROUP_NAME);
        log(`Запуск игры, количество мусора на сцене: ` +
            Object.keys(this.garbage).length);

        for (let prop in this.garbage) {
            this.garbage[prop].enable();
        }

        this._started = true;
        this.clockWork.startTimer();
        setTimeout(45000, () => {
            this.endGame();
        });
    }

    public endGame() {
        if(this._started) {
            this.clockWork.stopTimer();
            this._started = false;
        }

        let hasActive = false;

        for(const prop in this.garbage) {
            if(this.garbage[prop].isActive) {
                hasActive = true;
            }
            this.garbage[prop].disable();
        }

        if(hasActive) {
            log("Вы не успели спасти планету, попробуте еще раз");
        } else {
            log("Планета была спасена, ура")
        }
    }

    public resetGame() {
        log("Перезапуск игры")
        const garbage: Record<string, Garbage> =
            engine.getEntitiesWithComponent(GARBAGE_GROUP_NAME);
        for (let prop in garbage) {
            garbage[prop].disable();
        }
    }

    get score(): number {
        return this._score;
    }

    set score(value: number) {
        this._score = value;
    }

    public static getGameContext() : GameContext {
        const gameContextKey =
            Object.keys(engine.getEntitiesWithComponent(GAME_CONTEXT_COMPONENT_NAME))[0];
        return engine.getEntitiesWithComponent(GAME_CONTEXT_COMPONENT_NAME)[gameContextKey]
    }

    /**
     * Возвращает количество мусора, которое в данный момент находится на сцене
     * (этот мусор еще не выброшен).
     * @return {number} количество мусора на сцене
     */
    public getActiveGarbageQuantity() : number {
        const garbage = engine.getEntitiesWithComponent(GARBAGE_GROUP_NAME);
        let activeGarbageLen = 0;
        for (let key in garbage) {
            activeGarbageLen += garbage[key].isActive ? 1 : 0; /* си на месте */
        }
        return activeGarbageLen;
    }

    public getDiscardedGarbage() : Array<Garbage>  {
        const garbage = engine.getEntitiesWithComponent(GARBAGE_GROUP_NAME);
        const discardedGarbage: Array<Garbage> =
            new Array<Garbage>(Object.keys(garbage).length);
        for (let key in garbage) {
            if (!garbage[key].isActive) {
                discardedGarbage.push(garbage[key]);
            }
        }
        return discardedGarbage;
    }

}