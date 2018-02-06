import { GridWordInformation } from "./gridWordInformation";

export class WordRetriever {
    private _wordsWithDefinitions: GridWordInformation[];

    constructor() {
        this._wordsWithDefinitions = [];
    }

    public getWordsWithDefinitions(words: JSON): GridWordInformation[] {
        this._wordsWithDefinitions = [];
        this.createWordListWithDefinitions(words);

        return this._wordsWithDefinitions;
    }

    private createWordListWithDefinitions(words: JSON): void {
        for (const index in words) {
            if (words[index].hasOwnProperty("defs")) {
                const nonNumericalTag: number = 2; // Tag format : f:xxxx
                const tempFrequency: string = words[index].tags[0].substring(nonNumericalTag);
                const tempWord: GridWordInformation = new GridWordInformation(
                    words[index].word, words[index].defs, parseFloat(tempFrequency));
                this._wordsWithDefinitions.push(tempWord);
            }
        }
        this.removeDefinitions();
    }

    private removeDefinitions(): void {
        for (let indexWord: number = 0; indexWord < this._wordsWithDefinitions.length; indexWord++) {
            for (let indexDefs: number = 0; indexDefs < this._wordsWithDefinitions[indexWord].getDefinitions().length; indexDefs++) {
                const isNoun: boolean = this._wordsWithDefinitions[indexWord].getDefinitions()[0].charAt(0) === "n";
                const isVerb: boolean = this._wordsWithDefinitions[indexWord].getDefinitions()[0].charAt(0) === "v";
                if (!(isNoun) && !(isVerb)) {
                    this._wordsWithDefinitions[indexWord].getDefinitions().splice(indexDefs, 1);
                    indexDefs--; // next object is at same index as the one removed
                }
            }
            if (this._wordsWithDefinitions[indexWord].getDefinitions() === undefined
                || this._wordsWithDefinitions[indexWord].getDefinitions().length === 0) {
                this._wordsWithDefinitions.splice(indexWord, 1);
                indexWord--; // next object is at same index as the one removed
            }
        }
    }

}
