import { GridWordInformation } from "../lexiconAPI/gridWordInformation";
import { Direction, IPoint } from "../../../../common/communication/types";

/*export enum Direction {
    Y,
    X
}*/
export class Word {
    private _length: number;
    private _id: number;
    private _text: GridWordInformation;
    private _posX: number;
    private _posY: number;
    private _direction: Direction;

    constructor(length: number, id: number, text: GridWordInformation, posX: number, posY: number, direction: Direction) {
        this._length = length;
        this._id = id;
        this._text = text;
        this._posX = posX;
        this._posY = posY;
        this._direction = direction;
    }

    public get GridWord(): GridWordInformation {
        return this._text;
    }
    public get Length(): number {
        return this._length;
    }
    public get Number(): number {
        return this._id;
    }
    public setWord(word: GridWordInformation): void {
        this._text = word;
    }
    public get PosX(): number {
        return this._posX;
    }
    public get PosY(): number {
        return this._posY;
    }
    public get MainPos(): number {
        return this.Direction === Direction.Horizontal ? this._posX : this.PosY;
    }
    public get SecondaryPos(): number {
        return this.Direction === Direction.Horizontal ? this._posY : this.PosX;
    }
    public get Direction(): Direction {
        return this._direction;
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
