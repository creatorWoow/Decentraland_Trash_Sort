import {Garbage, GARBAGE_GROUP_NAME} from "../entities/Garbage";

export const GAME_CONTEXT_COMPONENT_NAME = "GameContextComponent"
export const GAME_CONTEXT_NAME = "GameContext"

@Component('coolDown')
export class CoolDown {}

@Component(GAME_CONTEXT_COMPONENT_NAME)
class GameContextComponent {}

export class GameContext extends Entity {
    private _score: number;
    private _started: boolean;

    constructor(currentScore?: number) {
        super();
        this._started = false;
        this.addComponent(new GameContextComponent());
        this._score = currentScore || 0;
    }

    public startGame() {
        if (this._started)
            this.resetGame();
        const garbage: Record<string, Garbage> =
            engine.getEntitiesWithComponent(GARBAGE_GROUP_NAME);
        log(`Запуск игры, количество мусора на сцене: ` +
            Object.keys(garbage).length);

        for (let prop in garbage) {
            garbage[prop].enable();
        }
        this._started = true;
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

}