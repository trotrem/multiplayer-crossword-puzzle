import { GridData, WordInfo } from "../../../common/communication/message"


interface Grid extends GridData {
    words: Array<string>;
}

interface GridDictionary {
    [id: number]: Grid;
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
        let grid = this._grids[id];

        return { blackCells: grid.blackCells, wordInfos: grid.wordInfos as WordInfo[] };
    }

    public getWords(id: number): Word[] {
        return this._grids[id].wordInfos.slice();
    }

    public addGrid(grid: Grid): void {
        let id = this.gridUniqueKey();
        this._grids[id] = grid;
    }

    public removeGrid(id: number): void {
        delete this._grids[id];
    }

    private gridUniqueKey(): number {
        let key;
        do{
            key = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        }while( key in this._grids );

        return key;
    }
}
