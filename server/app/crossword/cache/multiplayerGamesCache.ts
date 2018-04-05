import { Difficulty } from "../../../../common/communication/types";

interface Player {
    name: string;
    socket: SocketIO.Socket;
    selectedWord?: number;
}

interface Game {
    gridId?: number;
    players: Player[];
    difficulty: Difficulty;
}

export class MultiplayerGamesCache {
    private static _instance: MultiplayerGamesCache;

    private _games: Game[];

    private constructor() {
        this._games = [];
    }

    public static get Instance(): MultiplayerGamesCache {
        return this._instance || (this._instance = new this());
    }

    public getOpenGames(difficulty: Difficulty): Game[] {
        return this._games.filter((game: Game) => game.difficulty === difficulty);
    }

    public createGame(difficulty: Difficulty, player: Player): void {
        this._games.push({players:[player], difficulty: difficulty});
    }

    public joinGame(gridId: number, player: Player): void {
        const joinedGame: Game = this._games.find((game: Game) => game.gridId === gridId);
        joinedGame.players.push(player);
    }
}
