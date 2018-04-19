import { Injectable } from "@angular/core";
import { Difficulty } from "../../../../../../common/communication/types-crossword";

@Injectable()
export class GameConfigurationService {

    public opponentName: string;
    private _difficulty: Difficulty;
    private _playerName: string;
    private _nbPlayers: number;

    public get difficulty(): Difficulty {
        return this._difficulty;
    }

    public get playerName(): string {
        return this._playerName;
    }

    public get nbPlayers(): number {
        return this._nbPlayers;
    }

    public constructor() {
        this._difficulty = null;
        this._playerName = null;
        this._nbPlayers = null;
    }

    public configureGame(difficulty: Difficulty, playerName: string, nbPlayers: number): void {
        this._difficulty = difficulty;
        this._playerName = playerName;
        this._nbPlayers = nbPlayers;
    }
}
