import { GridWordInformation } from "./gridWordInformation";
import { ExternalApiService } from "./externalApi.service";

enum Difficulty {
    Easy,
    Medium,
    Hard
}

export class WordRetriever {

    private static _instance: WordRetriever;

    private constructor(
        private _wordsWithDefinitions: GridWordInformation[] = []) { }

    public async getWordsWithDefinitions(word: string): Promise<GridWordInformation[]> {
        this._wordsWithDefinitions = [];

        return this.createWordListWithDefinitions(word, (wordInfo: GridWordInformation) => true);
    }

    public static get instance(): WordRetriever {
        return ((this._instance) || (this._instance = new this()));
    }

    public async getEasyWordList(word: string): Promise<GridWordInformation[]> {
        const filter: (wordInfo: GridWordInformation) => boolean = (wordInfo: GridWordInformation) => wordInfo.isCommon;

        const easyWordList: GridWordInformation[] = await this.createWordListWithDefinitions(word, filter);
        easyWordList.forEach((element: GridWordInformation) => {
            element.definitions.splice(0);
        });

        return easyWordList;
    }

    private async createWordListWithDefinitions(word: string,
        filter: (word: GridWordInformation) => boolean): Promise<GridWordInformation[]> {
        const apiService: ExternalApiService = new ExternalApiService;
        const words: JSON = await apiService.requestWordInfo(word);
        for (const index in words) {
            if (words[index].hasOwnProperty("defs")) {
                const nonNumericalTag: number = 2; // Tag format : f:xxxx
                const tempFrequency: number = parseFloat(words[index].tags[0].substring(nonNumericalTag));
                const tempWord: GridWordInformation = new GridWordInformation(
                    words[index].word, words[index].defs, tempFrequency);
                this._wordsWithDefinitions.push(tempWord);
            }
        }
        this.removeDefinitions();
        this._wordsWithDefinitions = this._wordsWithDefinitions.filter(filter);

        return this._wordsWithDefinitions;
    }



    private removeDefinitions(): void {
        for (let indexWord: number = 0; indexWord < this._wordsWithDefinitions.length; indexWord++) {
            for (let indexDefs: number = 0; indexDefs < this._wordsWithDefinitions[indexWord].definitions.length; indexDefs++) {
                const isNoun: boolean = this._wordsWithDefinitions[indexWord].definitions[0].charAt(0) === "n";
                const isVerb: boolean = this._wordsWithDefinitions[indexWord].definitions[0].charAt(0) === "v";
                const hasWordInDefinition: boolean =
                    this._wordsWithDefinitions[indexWord].definitions[indexDefs].indexOf(this._wordsWithDefinitions[indexWord].word) >= 0;
                if ((!(isNoun) && !(isVerb)) || (hasWordInDefinition)) {
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
