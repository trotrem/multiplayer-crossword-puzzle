import { WordDictionaryData } from "../lexiconAPI/gridWordInformation";
import { Direction, IPoint } from "../../../../common/communication/types";
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
    public get MainPos(): number {
        return this.Direction === Direction.Horizontal ? this.PosX : this.PosY;
    }
    public get SecondaryPos(): number {
        return this.Direction === Direction.Horizontal ? this.PosY : this.PosX;
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
    public getCellFromDistance(distance: number): IPoint {
        return this.Direction === Direction.Horizontal ? 
               { x: this.PosX + distance, y: this.PosY } : 
               { x: this.PosX, y: this.PosY + distance }
    }
    public crossingIndexOf(word: Word): number {
        if(!this.isCrossing(word)) {
            return -1;
        }

        return word.SecondaryPos - this.MainPos;
    }

    private isCrossing(word: Word): boolean {
        if(this.Direction === word.Direction) {
            return false;
        }

        return this.MainPos <= word.SecondaryPos && 
               this.MainPos + this.Length > word.SecondaryPos &&
               this.SecondaryPos >= word.MainPos &&
               this.SecondaryPos < word.MainPos + word.Length;
    }
}
