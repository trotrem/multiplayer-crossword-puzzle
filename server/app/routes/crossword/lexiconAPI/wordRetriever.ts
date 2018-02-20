import { GridWordInformation } from "./gridWordInformation";
import { ExternalApiService } from "./externalApi.service";

export class WordRetriever {

    private static _instance: WordRetriever;

    private constructor() { }

    public static get instance(): WordRetriever {
        return ((this._instance) || (this._instance = new this()));
    }

    public async getWordsWithDefinitions(word: string): Promise<GridWordInformation[]> {

        return this.createWordListWithDefinitions(word, (wordInfo: GridWordInformation) => true);
    }

    public async getEasyWordList(word: string): Promise<GridWordInformation[]> {
        const filter: (wordInfo: GridWordInformation) => boolean = (wordInfo: GridWordInformation) => wordInfo.isCommon;

        const easyWordList: GridWordInformation[] = await this.createWordListWithDefinitions(word, filter);
        easyWordList.forEach((element: GridWordInformation) => {
            element.definitions.splice(0);
        });

        return easyWordList;
    }

    public async getMediumWordList(word: string): Promise<GridWordInformation[]> {
        const filter: (wordInfo: GridWordInformation) => boolean = (wordInfo: GridWordInformation) => wordInfo.isCommon;

        const easyWordList: GridWordInformation[] = await this.createWordListWithDefinitions(word, filter);
        easyWordList.forEach((element: GridWordInformation) => {
            element.definitions.splice(0);
        });

        return easyWordList;
    }

    private async createWordListWithDefinitions(word: string,
        filter: (word: GridWordInformation) => boolean): Promise<GridWordInformation[]> {
        let wordswithDefinitions: GridWordInformation[] = [];
        const apiService: ExternalApiService = ExternalApiService.instance;
        const words: JSON = await apiService.requestWordInfo(word);
        for (const index in words) {
            if (words[index].hasOwnProperty("defs")) {
                const nonNumericalTag: number = 2; // Tag format : f:xxxx
                const tempFrequency: number = parseFloat(words[index].tags[0].substring(nonNumericalTag));
                const tempWord: GridWordInformation = new GridWordInformation(
                    words[index].word, words[index].defs, tempFrequency);
                    wordswithDefinitions.push(tempWord);
            }
        }
        this.removeDefinitions(wordswithDefinitions);
        wordswithDefinitions = wordswithDefinitions.filter(filter);

        return wordswithDefinitions;
    }



    private removeDefinitions(wordswithDefinitions: GridWordInformation[]): void {
        for (let indexWord: number = 0; indexWord < wordswithDefinitions.length; indexWord++) {
            for (let indexDefs: number = 0; indexDefs < wordswithDefinitions[indexWord].definitions.length; indexDefs++) {
                const isNoun: boolean = wordswithDefinitions[indexWord].definitions[0].charAt(0) === "n";
                const isVerb: boolean = wordswithDefinitions[indexWord].definitions[0].charAt(0) === "v";
                const hasWordInDefinition: boolean =
                wordswithDefinitions[indexWord].definitions[indexDefs].indexOf(wordswithDefinitions[indexWord].word) >= 0;
                if ((!(isNoun) && !(isVerb)) || (hasWordInDefinition)) {
                    wordswithDefinitions[indexWord].definitions.splice(indexDefs, 1);
                    indexDefs--; // next object is at same index as the one removed
                }
            }
            if (wordswithDefinitions[indexWord].definitions === undefined
                || wordswithDefinitions[indexWord].definitions.length === 0) {
                    wordswithDefinitions.splice(indexWord, 1);
                indexWord--; // next object is at same index as the one removed
            }
        }
    }

}
