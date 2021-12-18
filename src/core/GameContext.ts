import {Garbage, GARBAGE_GROUP_NAME} from "../entities/Garbage";
import {Clock} from "../entities/Clock";
import {GarbageGenerator} from "./GarbageGenerator";
import {OnPlanetChangeEvent} from "./PlanerChangeProducer";

export const GAME_CONTEXT_COMPONENT_NAME = "GameContextComponent"
export const GAME_CONTEXT_NAME = "GameContext"

@Component('coolDown')
export class CoolDown {}

@Component(GAME_CONTEXT_COMPONENT_NAME)
class GameContextComponent {}

export class GameContext extends Entity {
    private _score: number;
    private _started: boolean;

    private clock: Clock;
    private garbageGenerator: GarbageGenerator;



    constructor(garbageGenerator: GarbageGenerator,
                eventManager: EventManager) {
        super();
        this._score = 0;
        this.clock = new Clock();
        this._started = false;
        this.eventManager = eventManager;
        this.garbageGenerator = garbageGenerator;
        this.addComponent(new GameContextComponent());
        this.initPlanetChangeListener();
    }

    public startGame() {

        if (this._started) {
            this.clock.stopTimer();
            this.deleteAllGarbage();
        }
        this._started = true;

        let garbage = this.garbageGenerator.generateGarbage();
        log(`Запуск игры, количество мусора на сцене: ${garbage.length}`);
        garbage.forEach(e => e.enable());

        this.clock.startTimer(() => {
            this.endGame();
            log('TIMER GOT OUT')}
        );
    }

    /**
     * Инициализирует слушателя изменений планеты
     */
    public initPlanetChangeListener() {
        this.eventManager?.addListener(
            OnPlanetChangeEvent,
            GameContext,
            ({ garbage }) => {
                log("Было перехвачено событие OnPlanetChangeEvent");
                if (garbage?.isWorseRecycled()) {
                    this.garbageGenerator.generateGarbage(3).forEach(e => e.enable());
                }
                if (this.isGameEnded())
                    this.endGame();
        });
    }

    /**
     * Проверяет, завершена ли игра
     */
    public isGameEnded() : boolean {
        return this.getActiveGarbageQuantity() == 0;
    }

    /**
     * Завершает игру, останавливает таймер и делает вывод, победил игрок
     * или проиграл, исходя из количества мусора на сцене.
     */
    public endGame() {
        if(this._started) {
            this.clock.stopTimer();
            this._started = false;
        }
        log('ENDGAME')
        const activeGarbageCount = this.getActiveGarbageQuantity();
        if(activeGarbageCount > 0) {
            log("Вы не успели спасти планету, попробуте еще раз");
        } else {
            log("Планета была спасена, ура");
        }
        this.deleteAllGarbage();
    }

    /**
     * Убирает со сцены весь мусор
     */
    public deleteAllGarbage() {
        const garbage: Record<string, Garbage> =
            engine.getEntitiesWithComponent(GARBAGE_GROUP_NAME);
        for (let prop in garbage) {
            engine.removeEntity(garbage[prop]);
        }
    }

    /**
     * Возвращает singleton игрового контекста
     */
    public static getGameContext() : GameContext {
        const context = engine.getEntitiesWithComponent(GAME_CONTEXT_COMPONENT_NAME)
        const key = Object.keys(context)[0];
        return context[key];
    }

    /**
     * Возвращает количество мусора, которое в данный момент находится на сцене
     * (этот мусор еще не выброшен).
     * @return {number} количество мусора на сцене
     */
    public  getActiveGarbageQuantity() : number {
        const garbageQuantity =
            Object.keys(engine.getEntitiesWithComponent(GARBAGE_GROUP_NAME)).length;
        log(`Активное количество мусора: ${garbageQuantity}`);
        return garbageQuantity;
    }

    /**
     * Возвращает список выброшенного мусора
     * @return {Array<Garbage>} мусор, который был выброшен игроком и который
     * находится в неактивном состоянии
     */
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

    get score(): number {
        return this._score;
    }

    set score(value: number) {
        this._score = value;
    }

}