import { Direction, IPoint } from "../../../common/communication/types";

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

export interface IPlayer {
    name: string;
    socket: SocketIO.Socket;
    selectedWord: number;
}

export interface IValidationWord {
    word: string;
    validatedBy: string;
}
const COMMON_TRESHOLD: number = 1;
const UNCOMMON_TRESHOLD: number = 15;

export class WordDictionaryData {
  constructor(
    public word: string,
    public definitions: string[],
    public frequency: number
  ) {}

  get isCommon(): boolean {
    return this.frequency > COMMON_TRESHOLD ? true : false;
  }

  get isUncommon(): boolean {
    return this.frequency < UNCOMMON_TRESHOLD ? true : false;
  }
}
