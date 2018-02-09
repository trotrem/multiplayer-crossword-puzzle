import { GridWordInformation } from "./gridWordInformation";
import { ExternalApiService } from "./externalApi.service"

export class WordRetriever {

    private static _instance: WordRetriever;

    private constructor(
        private _wordsWithDefinitions: GridWordInformation[] = [] ) {}

    public async getWordsWithDefinitions(word: string): Promise<GridWordInformation[]> {
        this._wordsWithDefinitions = [];
        let temp: GridWordInformation[] = await this.createWordListWithDefinitions(word);

        return temp;
    }

    public static get instance(): WordRetriever {
        return ((this._instance) || (this._instance = new this()));
    }

    private async createWordListWithDefinitions(word: string): Promise<GridWordInformation[]> {
        const apiService: ExternalApiService = new ExternalApiService;
        let words: JSON = await apiService.requestWordInfo(word)
        for (const index in words) {
            if (words[index].hasOwnProperty("defs")) {
                const nonNumericalTag: number = 2; // Tag format : f:xxxx
                const tempFrequency: number = parseFloat(words[index].tags[0].substring(nonNumericalTag));
                const tempWord: GridWordInformation = new GridWordInformation(
                    words[index].word, words[index].defs, tempFrequency, words[index].word.length);
                this._wordsWithDefinitions.push(tempWord);
            }
        }
        this.removeDefinitions();
        return this._wordsWithDefinitions;
    }

    private removeDefinitions(): void {
        for (let indexWord: number = 0; indexWord < this._wordsWithDefinitions.length; indexWord++) {
            for (let indexDefs: number = 0; indexDefs < this._wordsWithDefinitions[indexWord].definitions.length; indexDefs++) {
                const isNoun: boolean = this._wordsWithDefinitions[indexWord].definitions[0].charAt(0) === "n";
                const isVerb: boolean = this._wordsWithDefinitions[indexWord].definitions[0].charAt(0) === "v";
                if (!(isNoun) && !(isVerb)) {
                    this._wordsWithDefinitions[indexWord].definitions.splice(indexDefs, 1);
                    indexDefs--; // next object is at same index as the one removed
                }
            }
            if (this._wordsWithDefinitions[indexWord].definitions === undefined
                || this._wordsWithDefinitions[indexWord].definitions.length === 0) {
                this._wordsWithDefinitions.splice(indexWord, 1);
                indexWord--; // next object is at same index as the one removed
            }
        }
    }

    

}
