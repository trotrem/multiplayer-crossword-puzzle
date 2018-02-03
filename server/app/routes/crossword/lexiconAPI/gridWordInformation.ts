
// Classe contenant les infos d'un mot
export class GridWordInformation {
    private word: string;
    private defs: string[];
    private frequency: number;
    private isCommon: boolean;
    private wordInfo: [string, string[], number];

    constructor(_word: string, _defs: string[], _frequency: number) {
        this.word = _word;
        this.defs = _defs;
        this.frequency = _frequency;
        if(this.frequency < 15) {
            this.isCommon = false;
        }else {
            this.isCommon = true;
        }
        this.wordInfo = [_word, _defs, _frequency]
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

    public getInfo(): [string, string[], number] {
        return this.wordInfo;
    }


}