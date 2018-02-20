
export class GridWordInformation {
    private _isCommon: boolean = true;

    constructor(
        private _word: string, private _defs: string[], private _frequency: number) {
        const commonFactor: number = 15;
        if (_frequency < commonFactor) {
            this._isCommon = false;
        }
    }

    public get word(): string {
        return this._word;
    }

    public setWord(newWord: string): void {
        this._word = newWord;
    }

    public get definitions(): string[] {
        return this._defs;
    }

    public set definitions(newDefs: string[]) {
        this._defs = newDefs;
    }

    public get frequency(): number {
        return this._frequency;
    }

    public get isCommon(): boolean {
        return this._isCommon;
    }

    
}
