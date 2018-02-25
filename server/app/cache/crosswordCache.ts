import { GridData, WordInfo } from "../../../common/communication/message"

interface Word extends WordInfo {
    word: string;
}

interface Grid extends GridData {
    wordInfos: Array<Word>;
}

interface GridDictionary {
    [index: number]: {
        grid: Grid;
    }
}

export class CrosswordCache {

    private static _instance: CrosswordCache;

    private _grids: GridDictionary;

    private constructor() { }

    public static get Instance(): CrosswordCache {
        return ((this._instance) || (this._instance = new this()));
    }

    public getGridData(id: number) {
        
    }

    public getWords(id: number) {

    }

    public addGrid(grid: Grid) {
        
    }

    public removeGrid(id: number) {

    }
}
