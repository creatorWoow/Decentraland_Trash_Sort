import {Garbage, GARBAGE_GROUP_NAME} from "../entities/Garbage";
import {Clock} from "../entities/Clock";
import {GarbageGenerator} from "./GarbageGenerator";
import {OnPlanetChangeEvent} from "./PlanerChangeProducer";
import {PlanetSystem} from "../systems/PlanetSystem";
import {PlayerHand} from "../entities/PlayerHand";
import * as ui from '@dcl/ui-scene-utils';
import resources from "../../resources";

export const GAME_CONTEXT_COMPONENT_NAME = "GameContextComponent"
export const GAME_CONTEXT_NAME = "GameContext"

@Component('coolDown')
export class CoolDown {
}

@Component(GAME_CONTEXT_COMPONENT_NAME)
class GameContextComponent {
}

export class GameContext extends Entity {
    private _started: boolean;
    private garbage: Array<Garbage>;
    private planetSystem: PlanetSystem;

    private clock: Clock;
    private playerHand: PlayerHand;
    private garbageGenerator: GarbageGenerator;

    private _successGameEndingSound = resources.sounds.game.successGameEndingSound;
    private _loseGameEndingSound = resources.sounds.game.loseGameEndingSound;


    constructor(garbageGenerator: GarbageGenerator,
                eventManager: EventManager,
                planetSystem: PlanetSystem,
                playerHand: PlayerHand) {
        super();
        this.clock = new Clock();
        this._started = false;
        this.playerHand = playerHand;
        this.eventManager = eventManager;
        this.garbageGenerator = garbageGenerator;
        this.addComponent(new GameContextComponent());
        this.initPlanetChangeListener();
        this.planetSystem = planetSystem;
        this.garbage = this.garbageGenerator.generateGarbage();
    }

    public startGame() {

        if (this._started)
            this.resetGame();

        this.planetSystem.planet.resetRedPlanet();
        this.planetSystem.stateChanged = false;

        if (this.getActiveGarbageQuantity() == 0)
            this.garbage = this.garbageGenerator.generateGarbage();

        this._started = true;
        this.garbage.forEach(e => e.enable());
        this.clock.startTimer(() => {
                this.endGame();
                log('TIMER GOT OUT')
            }
        );
    }

    resetGame() {
        this._started = false;
        this.playerHand.clearHand();
        this.clock.stopTimer();
        this.deleteAllGarbage();
    }

    /**
     * Инициализирует слушателя изменений планеты
     */
    initPlanetChangeListener() {
        this.eventManager?.addListener(
            OnPlanetChangeEvent,
            GameContext,
            ({garbage}) => {
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
    public isGameEnded(): boolean {
        return this.getActiveGarbageQuantity() == 0;
    }

    /**
     * Завершает игру, останавливает таймер и делает вывод, победил игрок
     * или проиграл, исходя из количества мусора на сцене.
     */
    public endGame() {

        const activeGarbageCount = this.getActiveGarbageQuantity();
        if (this._started)
            this.resetGame();

        log('ENDGAME')

        if (activeGarbageCount > 0) {
            this._loseGameEndingSound.getComponent(AudioSource).playOnce();
            this.planetSystem.setReallyBadState();
            ui.displayAnnouncement('The planet has suffered :(',
                3, new Color4(255, 255, 255, 50));
            log("Вы не успели спасти планету, попробуте еще раз");
        } else {
            ui.displayAnnouncement('The planet was saved, hurray!',
                3, new Color4(255, 255, 255, 50));
            this._successGameEndingSound.getComponent(AudioSource).playOnce();
            log("Планета была спасена, ура");
        }
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
    public static getGameContext()
        :
        GameContext {
        const context = engine.getEntitiesWithComponent(GAME_CONTEXT_COMPONENT_NAME)
        const key = Object.keys(context)[0];
        return context[key];
    }

    /**
     * Возвращает количество мусора, которое в данный момент находится на сцене
     * (этот мусор еще не выброшен).
     * @return {number} количество мусора на сцене
     */
    public getActiveGarbageQuantity()
        :
        number {
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
    public getDiscardedGarbage()
        :
        Array<Garbage> {
        const garbage = engine.getEntitiesWithComponent(GARBAGE_GROUP_NAME);
        const discardedGarbage
            :
            Array<Garbage> =
            new Array<Garbage>(Object.keys(garbage).length);
        for (let key in garbage) {
            if (!garbage[key].isActive) {
                discardedGarbage.push(garbage[key]);
            }
        }
        return discardedGarbage;
    }

}