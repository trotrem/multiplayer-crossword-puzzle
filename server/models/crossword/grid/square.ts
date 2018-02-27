export class Square {
    private _id: number;
    public _isBlack: boolean;
    private _letter: string;

    constructor(id: number, isBlack: boolean, letter: string) {
        this._id = id;
        this._isBlack = isBlack;
        this._letter = letter;
    }

    public setId(id: number): void {
        this._id = id;
    }
    public setIsBlack(isBlack: boolean): void {
        this._isBlack = isBlack;
    }
    public setLetter(letter: string): void {
        this._letter = letter;
    }
    public getId(): number {
        return this._id;
    }
    public getIsBlack(): boolean {
        return this._isBlack;
    }
    public getLetter(): string {
        return this._letter;
    }
}
