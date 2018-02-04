
// Classe contenant les infos d'un mot
export class GridWordInformation {
    private word: string;
    private defs: string[];
    private frequency: number;
    private isCommon: boolean = true;
    private wordInfo: [string, string[], number];

    constructor(requestWord: string, requestDefs: string[], requestFrequency: number) {
        this.word = requestWord;
        this.defs = requestDefs;
        this.frequency = requestFrequency;
        const commonFactor: number = 15;
        if (this.frequency < commonFactor) {
            this.isCommon = false;
        }
        this.wordInfo = [word, defs, frequency];
    }

    public getWord(): string {
        return this.word;
    }

    public getDefinitions(): string[] {
        return this.defs;
    }

    public getFrequency(): number {
        return this.frequency;
    }

    public getIsCommon(): boolean {
        return this.isCommon;
    }

    public getInfo(): [string, string[], number] {
        return this.wordInfo;
    }

}
