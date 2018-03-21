import { IGridData, IWordInfo } from "../../../common/communication/types";
import { IGrid, IWordContainer } from "../models/crossword/grid/dataStructures";
import { GridUtils } from "../models/crossword/grid/gridUtils";
import { WordDictionaryData } from "../models/crossword/lexiconAPI/gridWordInformation";

interface CacheWord {
  word: string;
  validated: boolean;
}

interface CacheGrid {
  words: Array<CacheWord>;
  gridData: IGridData;
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
    return this._instance || (this._instance = new this());
  }

  public getGridData(id: number): IGridData {
    const grid: CacheGrid = this._grids[id];

    return {
      id: grid.gridData.id,
      blackCells: grid.gridData.blackCells.slice(),
      wordInfos: grid.gridData.wordInfos.slice()
    };
  }

  public getWords(id: number): string[] {
    return this._grids[id].words.map((word: CacheWord) => word.word).slice();
  }

  public addGrid(grid: IGrid): IGridData {
    const gridData: IGridData = this.convertIGridToGridData(grid);
    this._grids[gridData.id] = {
      gridData: gridData,
      words: grid.words.map((w: IWordContainer): CacheWord => {
        return {
          word: GridUtils.getText(w, grid).toUpperCase(),
          validated: false
        };
      })
    };

    return gridData;
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
    } while (key in this._grids);

    return key;
  }

  private convertIGridToGridData(grid: IGrid): IGridData {
    const id: number = this.gridUniqueKey();
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
