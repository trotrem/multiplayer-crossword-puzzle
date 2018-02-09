import { GridWordInformation } from "../lexiconAPI/gridWordInformation"
enum Direction{
    Y,
    X
}
export class Word {
    private _length: number;
    private _id: number;
    private _text: GridWordInformation;
    private _posX: number;
    private _posY: number;
    private direction : Direction;

    constructor(length: number, id: number, text: GridWordInformation) {
        this._length = length;
        this._id = id;
        this._text = text;
    }

    public get Word(): GridWordInformation {
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
}
