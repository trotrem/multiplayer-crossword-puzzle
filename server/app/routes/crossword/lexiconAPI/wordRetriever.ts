import { GridWordInformation } from "./gridWordInformation";
import { ExternalApiService } from "./externalApi.service";

export class WordRetriever {

    private static _instance: WordRetriever;

    private constructor(
        private _wordsWithDefinitions: GridWordInformation[] = []) { }

    public async getWordsWithDefinitions(word: string): Promise<GridWordInformation[]> {
        this._wordsWithDefinitions = [];

        return this.createWordListWithDefinitions(word);
    }

    public static get instance(): WordRetriever {
        return ((this._instance) || (this._instance = new this()));
    }

    private async createWordListWithDefinitions(word: string): Promise<GridWordInformation[]> {
        const apiService: ExternalApiService = new ExternalApiService;
        const words: JSON = await apiService.requestWordInfo(word);
        for (const index in words) {
            const wordIsNumerical: boolean = words[index].word.match(/d/) !== null;
            if (words[index].hasOwnProperty("defs") && !wordIsNumerical) {
                const nonNumericalTag: number = 2; // Tag format : f:xxxx
                const tempFrequency: number = parseFloat(words[index].tags[0].substring(nonNumericalTag));
                const tempWord: GridWordInformation = new GridWordInformation(
                    words[index].word.toUpperCase(), words[index].defs, tempFrequency);
                this._wordsWithDefinitions.push(tempWord);
            }
        }
        this.removeDefinitions();

        return this._wordsWithDefinitions;
    }

    private removeDefinitions(): void {
        for (let indexWord: number = 0; indexWord < this._wordsWithDefinitions.length; indexWord++) {
            for (let indexDefs: number = 0; indexDefs < this._wordsWithDefinitions[indexWord].definitions.length; indexDefs++) {
                const wordIsNoun: boolean = this._wordsWithDefinitions[indexWord].definitions[0].charAt(0) === "n";
                const wordIsVerb: boolean = this._wordsWithDefinitions[indexWord].definitions[0].charAt(0) === "v";
                if (!(wordIsNoun) && !(wordIsVerb)) {
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

    /* private wordRefactoring(): void {
         const hasSpace: boolean =
     }*/

    /*private hasWordInDefinition(): boolean {

    }*/

}
