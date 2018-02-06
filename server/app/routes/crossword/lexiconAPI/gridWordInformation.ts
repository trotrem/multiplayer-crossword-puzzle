export class GridWordInformation {
    constructor(
        private _word: string, private _defs: string[], private _frequency: number, private _isCommon: boolean = true) {
        const commonFactor: number = 15;
        if (_frequency < commonFactor) {
            this._isCommon = false;
        }
    }

    public get word(): string {
        return this._word;
    }

    public getDefinitions(): string[] {
        return this._defs;
    }

    public get frequency(): number {
        return this._frequency;
    }

    public get isCommon(): boolean {
        return this._isCommon;
    }
}
