import { GridData } from "../../../common/communication/message"


interface Grid {
    words: Array<string>;
    gridData: GridData;
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

        return { id: grid.gridData.id, blackCells: grid.gridData.blackCells, wordInfos: grid.gridData.wordInfos };
    }

    public getWords(id: number): string[] {
        return this._grids[id].words.slice();
    }

    public addGrid(grid: Grid): GridData {
        let id = this.gridUniqueKey();
        grid.gridData.id = id;
        this._grids[id] = grid;

        return grid.gridData;
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
