import { WordDictionaryData } from "../lexiconAPI/gridWordInformation";
import { Direction, IPoint } from "../../../../../common/communication/types";

export interface ICell {
    isBlack: boolean;
    letter: string;
    x: number;
    y: number;
}

export interface IGrid {
    cells: ICell[][];
    blackCells: IPoint[];
    words: IWordContainer[];
}

export interface IWordContainer {
    data?: WordDictionaryData;
    id: number;
    direction: Direction;
    gridSquares: IPoint[];
}
