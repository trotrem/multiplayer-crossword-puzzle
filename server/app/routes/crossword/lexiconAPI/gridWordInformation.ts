
// Classe contenant les infos d'un mot
export class gridWordInformation {
    private word: string;
    private defs: string[];
    private frequency: number;

    constructor(_word: string, _defs: string[], _frequency: number) {
        this.word = _word;
        this.defs = _defs;
        this.frequency = _frequency;
    }

    public getWord(): string {
        return this.word;
    }

    public getDefs(): string[] {
        return this.defs;
    }

    public getFrequency(): number {
        return this.frequency;
    }


}