import { IWordInfo, Difficulty } from "../../../../common/communication/types-crossword";
import { GridUtils } from "../models/grid/gridUtils";
import { IGridData, ILobbyGames, IConnectionInfo } from "../../../../common/communication/events-crossword";
import { IValidationWord, IPlayer, IGrid, IWordContainer, WordDictionaryData } from "../dataStructures";

// TODO: renommer fichier

// TODO: split en deux (cache et logique)

interface ICacheGame {
    words: Array<IValidationWord>;
    gridData: IGridData;
    players: IPlayer[];
    maxPlayers: number;
}

interface IGameDictionary {
    [id: string]: ICacheGame;
}

export class CrosswordGamesCache {
    private static _instance: CrosswordGamesCache;

    private _grids: IGameDictionary[];

    private constructor() {
        this._grids = [{}, {}, {}];
    }

    public static get Instance(): CrosswordGamesCache {
        return this._instance || (this._instance = new this());
    }

    public getOpenMultiplayerGames(difficulty: Difficulty): ILobbyGames {
        return {gameId: undefined, games: Object.keys(this._grids[difficulty])
            .map((index: string) => ({ game: this._grids[difficulty][index], id: index }))
            .filter((gameEntry: { game: ICacheGame, id: string }) => gameEntry.game.maxPlayers === 2 && gameEntry.game.players.length === 1)
                .map((gameEntry: { game: ICacheGame, id: string }) => ({
                    player: gameEntry.game.players[0].name,
                    gameId: gameEntry.id
                } as IConnectionInfo))} as ILobbyGames;
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

    public getPlayers(id: string): IPlayer[] {
        return this.getGame(id).players;
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

    public createGame(creator: IPlayer, difficulty: Difficulty, nbPlayers: number): string {
        const id: string = this.gridUniqueKey();
        this._grids[difficulty][id] = {
            gridData: null,
            words: null,
            players: [creator],
            maxPlayers: nbPlayers
        };

        return id;
    }

    public joinGame(id: string, player: IPlayer): void {
        this.getGame(id).players.push(player);
    }

    // TODO: séparer
    public addGrid(grid: IGrid, id: string): IGridData {
        const cacheGrid: ICacheGame = this.getGame(id);
        cacheGrid.gridData = this.convertIGridToGridData(grid, id);
        cacheGrid.words = grid.words.map((w: IWordContainer): IValidationWord => {
            return {
                word: GridUtils.getText(w.gridSquares, grid).toUpperCase(),
                validatedBy: undefined
            };
        });

        return cacheGrid.gridData;
    }

    // TODO: utiliser
    public removeGrid(id: number): void {
        delete this._grids[id];
    }

    public validateWord(gridId: string, wordIndex: number, playerSocketId: string): void {
        const game: ICacheGame = this.getGame(gridId);
        game.words[wordIndex].validatedBy = playerSocketId;
    }

    public getGameNumberOfPlayers(gameId: string): number {
        return this.getGame(gameId).maxPlayers;
    }

    private getGame(id: string): ICacheGame {
        for (const difficulty in Difficulty) {
            if (this._grids[difficulty][id] !== undefined) {
                return this._grids[difficulty][id];
            }
        }

        return null;
    }

    private gridUniqueKey(): string {
        let key: number;
        do {
            key = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        } while (key in this._grids[Difficulty.Easy] || key in this._grids[Difficulty.Medium] || key in this._grids[Difficulty.Hard]);

        return key.toString();
    }

    private convertIGridToGridData(grid: IGrid, id: string): IGridData {
        const sortedWords: IWordContainer[] = grid.words.sort(
            (w1: IWordContainer, w2: IWordContainer) => w1.id - w2.id
        );

        return {
            gameId: id,
            blackCells: grid.blackCells,
            wordInfos: sortedWords.map((word: IWordContainer): IWordInfo => {
                return {
                    id: word.id,
                    direction: word.direction,
                    x: word.gridSquares[0].x,
                    y: word.gridSquares[0].y,
                    definition: (word.data as WordDictionaryData).definitions[0],
                    length: word.gridSquares.length
                };
            })
        };
    }
}
