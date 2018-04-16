import { IWordInfo, Difficulty } from "../../../../common/communication/types";
import { GridUtils } from "../models/grid/gridUtils";
import { IGridData, CrosswordLobbyGame } from "../../../../common/communication/events";
import { IValidationWord, IPlayer, IGrid, IWordContainer, WordDictionaryData } from "../dataStructures";

// TODO sortir

// TODO: renommer fichier

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

    public getOpenMultiplayerGames(difficulty: Difficulty): CrosswordLobbyGame[] {
        return Object.keys(this._grids[difficulty])
            .map((index: string) => ({ grid: this._grids[difficulty][index], id: index }))
            .filter((grid: { grid: ICacheGame, id: string }) => grid.grid.maxPlayers === 2 && grid.grid.players.length === 1)
            .map((grid: { grid: ICacheGame, id: string }) => ({ creator: grid.grid.players[0].name, gameId: grid.id }));
    }

    public getDifficulty(id: number): Difficulty {
        for (const difficulty in Difficulty) {
            if (this._grids[difficulty][id] !== undefined) {
                return Number(difficulty);
            }
        }

        return null;
    }

    public getPlayersSockets(id: number): SocketIO.Socket[] {
        return this.getGame(id).players.map((player: IPlayer) => player.socket);
    }

    public getOpponentSocket(id: number, socket: SocketIO.Socket): SocketIO.Socket {
        const sockets: SocketIO.Socket[] = this.getPlayersSockets(id);
        if (sockets.length === 2) {
            return sockets.filter((p: SocketIO.Socket) => p.id !== socket.id)[0];
        }

        return null;
    }

    public getWords(id: number): IValidationWord[] {
        return this.getGame(id).words.slice();
    }

    public createGame(creator: IPlayer, difficulty: Difficulty, nbPlayers: number): number {
        const id: number = this.gridUniqueKey();

        this._grids[difficulty][id] = {
            gridData: null,
            words: null,
            players: [creator],
            maxPlayers: nbPlayers
        };

        return id;
    }

    public joinGame(id: number, player: IPlayer): void {
        this.getGame(id).players.push(player);
    }

    // TODO: séparer
    public addGrid(grid: IGrid, id: number): IGridData {
        const cacheGrid: ICacheGame = this.getGame(id);
        cacheGrid.gridData = this.convertIGridToGridData(grid, id);
        cacheGrid.words = grid.words.map((w: IWordContainer): IValidationWord => {
            return {
                word: GridUtils.getText(w, grid).toUpperCase(),
                validatedBy: undefined
            };
        });

        return cacheGrid.gridData;
    }

    // TODO: utiliser
    public removeGrid(id: number): void {
        delete this._grids[id];
    }

    public validateWord(gridId: number, wordIndex: number, playerSocketId: string): void {
        const game: ICacheGame = this.getGame(gridId);
        game.words[wordIndex].validatedBy = playerSocketId;
    }

    public getGameNumberOfPlayers(gameId: number): number {
        return this.getGame(gameId).maxPlayers;
    }

    private getGame(id: number): ICacheGame {
        for (const difficulty in Difficulty) {
            if (this._grids[difficulty][id] !== undefined) {
                return this._grids[difficulty][id];
            }
        }

        return null;
    }

    private gridUniqueKey(): number {
        let key: number;
        do {
            key = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        } while (key in this._grids[Difficulty.Easy] || key in this._grids[Difficulty.Medium] || key in this._grids[Difficulty.Hard]);

        return key;
    }

    private convertIGridToGridData(grid: IGrid, id: number): IGridData {
        const sortedWords: IWordContainer[] = grid.words.sort(
            (w1: IWordContainer, w2: IWordContainer) => w1.id - w2.id
        );

        return {
            id: id,
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
