import { WordDictionaryData } from "../lexiconAPI/gridWordInformation";
import { Direction } from "../../../../common/communication/types";
import { Square } from "./square";

/*export enum Direction {
    Y,
    X
}*/
export class Word {
    private _data: WordDictionaryData;

    constructor(private _id: number, private _direction: Direction, private _gridSquares: Square[]) {}

    public get DictionaryData(): WordDictionaryData {
        return this._data;
    }
    public get Length(): number {
        return this._gridSquares.length;
    }
    public get Number(): number {
        return this._id;
    }
    public get PosX(): number {
        return this._gridSquares[0].x;
    }
    public get PosY(): number {
        return this._gridSquares[0].y;
    }
    public get Direction(): Direction {
        return this._direction;
    }
    public get Text(): string {
        return this._gridSquares.map((square) => square.letter).join("");
    }
    public trySetData(word: WordDictionaryData): boolean {
        if (this.trySetText(word.word)) {
            this._data = word;
            return true;
        }

        return false;
    }
    private trySetText(text: string): boolean {
        for (let i = 0; i < this._gridSquares.length; i++) {
            if (this._gridSquares[i].letter !== "?" && this._gridSquares[i].letter !== text[i]) {
                return false;
            }
        }
        this.setText(text);

        return true;
    }
    public setData(word: WordDictionaryData): void {
        this._data = word;
        this.setText(word.word);
    }
    private setText(text: string): void {
        for (let i = 0; i < this._gridSquares.length; i++) {
            this._gridSquares[i].letter = text[i];
        }
    }
}
