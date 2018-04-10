import { IGridData, IWordInfo, Difficulty } from "../../../../common/communication/types";
import { IGrid, IWordContainer } from "../models/grid/dataStructures";
import { GridUtils } from "../models/grid/gridUtils";
import { WordDictionaryData } from "../models/lexiconAPI/gridWordInformation";

interface ICacheWord {
    word: string;
    validated: boolean;
}

interface IPlayer {
    name: string;
    socket: SocketIO.Socket;
    selectedWord: number;
}

interface ICacheGrid {
    words: Array<ICacheWord>;
    gridData: IGridData;
    players: IPlayer[];
    maxPlayers: number;
}

interface IGridDictionary {
    [id: number]: ICacheGrid;
}

export class GridCache {
    private static _instance: GridCache;

    private _grids: IGridDictionary[];

    private constructor() {
        this._grids = [{}, {}, {}];
    }

    public static get Instance(): GridCache {
        return this._instance || (this._instance = new this());
    }

    public getOpenMultiplayerGames(difficulty: Difficulty) {
        console.log(Object.keys(this._grids[difficulty]).map((index: string) => this._grids[difficulty][index]))

        return Object.keys(this._grids[difficulty]).map((index: string) => this._grids[difficulty][index]).filter((grid: ICacheGrid) => grid.maxPlayers === 2 && grid.players.length === 1).map((grid: ICacheGrid) => {grid.players[0], grid.gridData.id});
    }

    public getGridData(id: number): IGridData {
        let grid: ICacheGrid = this.getGrid(id);

        return {
            id: grid.gridData.id,
            blackCells: grid.gridData.blackCells.slice(),
            wordInfos: grid.gridData.wordInfos.slice()
        };
    }

    public getWords(id: number): string[] {
        return this.getGrid(id).words.map((word: ICacheWord) => word.word).slice();
    }

    public createGame(creator: IPlayer, difficulty: Difficulty): number {
        const id: number = this.gridUniqueKey();

        this._grids[difficulty][id] = {
            gridData: null,
            words: null,
            players: [creator],
            maxPlayers: creator.name === undefined ? 1 : 2
        };

        return id;
   }

    public joinGame(id: number, player: IPlayer): void {
        this.getGrid(id).players.push(player);
    }

    public addGrid(grid: IGrid, id: number): IGridData {
        let cacheGrid: ICacheGrid = this.getGrid(id);
        cacheGrid.gridData = this.convertIGridToGridData(grid, id);
        cacheGrid.words = grid.words.map((w: IWordContainer): ICacheWord => {
                return {
                    word: GridUtils.getText(w, grid).toUpperCase(),
                    validated: false
                };
        });

        return cacheGrid.gridData;
    }

    public removeGrid(id: number): void {
        delete this._grids[id];
    }

    public validateWord(gridId: number, wordIndex: number): void {
        this.getGrid(gridId).words[wordIndex].validated = true;
    }

    private getGrid(id: number): ICacheGrid {
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
