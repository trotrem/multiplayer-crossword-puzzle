import { Difficulty } from "../../../../common/communication/types";
import { ILobbyGames, IConnectionInfo } from "../../../../common/communication/events";
import { IValidationWord, IPlayer, IGameDictionary, ICacheGame } from "../dataStructures";

export class CrosswordGamesCache {
    private static _instance: CrosswordGamesCache;

    private _grids: IGameDictionary[];

    private constructor() {
        this._grids = [{}, {}, {}];
    }

    public static get Instance(): CrosswordGamesCache {
        return this._instance || (this._instance = new this());
    }
    public set grids(grids: IGameDictionary[]) {
        this._grids = grids;
    }
    public get grids(): IGameDictionary[] {
        return this._grids;
    }

    public getOpenMultiplayerGames(difficulty: Difficulty): ILobbyGames {
        return {
            gameId: undefined, games: Object.keys(this._grids[difficulty])
                .map((index: string) => ({ game: this._grids[difficulty][index], id: index }))
                .filter((gameEntry: { game: ICacheGame, id: string }) =>
                    gameEntry.game.maxPlayers === 2 && gameEntry.game.players.length === 1)
                .map((gameEntry: { game: ICacheGame, id: string }) => ({
                    player: gameEntry.game.players[0].name,
                    gameId: gameEntry.id
                } as IConnectionInfo))
        } as ILobbyGames;
    }

    public getDifficulty(id: string): Difficulty {
        for (const difficulty in Difficulty) {
            if (this._grids[difficulty][id] !== undefined) {
                return Number(difficulty);
            }
        }

        return null;
    }

    public getGameWinner(id: string): SocketIO.Socket {
        const game: ICacheGame = this.getGame(id);
        if (game.words.filter((w: IValidationWord) => w.validatedBy === undefined).length !== 0) {
            return null;
        }
        const firstPlayerWordCount: number = game.words.filter((w: IValidationWord) => w.validatedBy === game.players[0].socket.id).length;
        if (firstPlayerWordCount > game.words.length / 2) {
            return game.players[0].socket;
        }
        if (firstPlayerWordCount < game.words.length / 2) {
            return game.players[1].socket;
        }

        return undefined;
    }

    public getPlayersSockets(id: string): SocketIO.Socket[] {
        return this.getGame(id).players.map((player: IPlayer) => player.socket);
    }

    public getOpponentSocket(id: string, socket: SocketIO.Socket): SocketIO.Socket {
        const sockets: SocketIO.Socket[] = this.getPlayersSockets(id);
        if (sockets.length === 2) {
            return sockets.filter((p: SocketIO.Socket) => p.id !== socket.id)[0];
        }

        return null;
    }

    public getWords(id: string): IValidationWord[] {
        return this.getGame(id).words.slice();
    }

    public getGameNumberOfPlayers(gameId: string): number {
        return this.getGame(gameId).maxPlayers;
    }

    public getGame(id: string): ICacheGame {
        for (const difficulty in Difficulty) {
            if (this._grids[difficulty][id] !== undefined) {
                return this._grids[difficulty][id];
            }
        }

        return null;
    }
}
