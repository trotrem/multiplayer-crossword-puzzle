import { Direction, IPoint } from "../../../common/communication/types-crossword";
import { IGridData } from "../../../common/communication/events-crossword";

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
export interface ICacheGame {
    words: Array<IValidationWord>;
    gridData: IGridData;
    players: IPlayer[];
    maxPlayers: number;
}

export interface IGameDictionary {
    [id: string]: ICacheGame;
}

const COMMON_TRESHOLD: number = 1;
const UNCOMMON_TRESHOLD: number = 15;

export class WordDictionaryData {
    constructor(
        public word: string,
        public definitions: string[],
        public frequency: number
    ) { }

    get isCommon(): boolean {
        return this.frequency > COMMON_TRESHOLD;
    }

    get isUncommon(): boolean {
        return this.frequency < UNCOMMON_TRESHOLD;
    }
}
