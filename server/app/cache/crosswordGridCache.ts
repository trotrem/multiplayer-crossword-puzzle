import { GridData } from "../../../common/communication/message";

interface CacheWord {
    word: string;
    validated: boolean;
}

interface CacheGrid {
    words: Array<CacheWord>;
    gridData: GridData;
}

interface GridDictionary {
    [id: number]: CacheGrid;
}

export class GridCache {

    private static _instance: GridCache;

    private _grids: GridDictionary;

    private constructor() {
        this._grids = {};
    }

    public static get Instance(): GridCache {
        return ((this._instance) || (this._instance = new this()));
    }

    public getGridData(id: number): GridData {
        const grid: CacheGrid = this._grids[id];

        return { id: grid.gridData.id, blackCells: grid.gridData.blackCells.slice(), wordInfos: grid.gridData.wordInfos.slice() };
    }

    public getWords(id: number): string[] {
        return this._grids[id].words.map((word: CacheWord) => word.word).slice();
    }

    public addGrid(grid: CacheGrid): GridData {
        const id: number = this.gridUniqueKey();
        grid.gridData.id = id;
        this._grids[id] = grid;

        return grid.gridData;
    }

    public removeGrid(id: number): void {
        delete this._grids[id];
    }

    public validateWord(gridId: number, wordIndex: number): void {
        this._grids[gridId].words[wordIndex].validated = true;
    }

    private gridUniqueKey(): number {
        let key: number;
        do {
            key = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        }while ( key in this._grids );

        return key;
    }
}
