export class Word {
    private _length: number;
    private _num: number;
    private _text: string;

    constructor(length: number, num: number, text: string) {
        this._length = length;
        this._num = num;
        this._text = text;
    }

    public get Word(): string {
        return this._text;
    }
    public get Length(): number {
        return this._length;
    }
    public get Number(): number {
        return this._num;
    }
    public setWord(word: string): void {
        this._text = word;
    }
}
