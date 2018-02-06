//classe temporaire qui serait remplacé par gridWordInformation.ts lors de l'ajout de mot dans la grille
export class Word {
    private _length: number;
    private _id: number;
    private _text: string;

    constructor(length: number, id: number, text: string) {
        this._length = length;
        this._id = id;
        this._text = text;
    }

    public get Word(): string {
        return this._text;
    }
    public get Length(): number {
        return this._length;
    }
    public get Number(): number {
        return this._id;
    }
    public setWord(word: string): void {
        this._text = word;
    }
}
