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
        easyWordList.forEach((wordInfo: GridWordInformation) => {
            wordInfo.definitions = wordInfo.definitions.splice(0, 1);
        });

        return easyWordList;
    }

    public async getMediumWordList(word: string): Promise<GridWordInformation[]> {
        const filter: (wordInfo: GridWordInformation) => boolean = (wordInfo: GridWordInformation) => wordInfo.isCommon;

        const mediumWordList: GridWordInformation[] = await this.createWordListWithDefinitions(word, filter);
        mediumWordList.forEach((wordInfo: GridWordInformation) => {

            wordInfo.definitions =
                (wordInfo.definitions.length > 1) ? (wordInfo.definitions.splice(1, 1)) : wordInfo.definitions.splice(0, 1);

        });

        return mediumWordList;
    }

    public async getHardWordList(word: string): Promise<GridWordInformation[]> {
        const filter: (wordInfo: GridWordInformation) => boolean = (wordInfo: GridWordInformation) => (!(wordInfo.isCommon));

        const hardWordList: GridWordInformation[] = await this.createWordListWithDefinitions(word, filter);
        hardWordList.forEach((wordInfo: GridWordInformation) => {
            wordInfo.definitions = wordInfo.definitions.splice(0, 1);
        });

        return hardWordList;
    }

    private async createWordListWithDefinitions(word: string, filter: (word: GridWordInformation) => boolean):
        Promise<GridWordInformation[]> {

        let wordsWithDefinitions: GridWordInformation[] = [];
        const apiService: ExternalApiService = new ExternalApiService;
        const words: JSON = await apiService.requestWordInfo(word);
        for (const index in words) {
            if (words[index].hasOwnProperty("defs") && (words[index].word.search(/d/) === -1)) {
                let test: string = words[index].tags[0];
                const nonNumericalTag: number = 2 ; // Tag format : f:xxxx
                const tempFrequency: number = parseFloat(words[index].tags[0].substring(nonNumericalTag));
                const tempWord: GridWordInformation = new GridWordInformation(
                    words[index].word, words[index].defs, tempFrequency);
                wordsWithDefinitions.push(tempWord);
            }
        }
        wordsWithDefinitions = this.removeDefinitions(wordsWithDefinitions);

        return wordsWithDefinitions.filter(filter);
    }

    private removeDefinitions(wordsWithDefinitions: GridWordInformation[]): GridWordInformation[] {
        wordsWithDefinitions.forEach((wordInfo: GridWordInformation, index: number) => {
            wordInfo.definitions = wordInfo.definitions
                .filter((def: string) => ((def.charAt(0) === "n") || (def.charAt(0) === "v")));
            wordInfo.definitions = wordInfo.definitions
                .filter((def: string) => !(def.indexOf(wordInfo.word) >= 0));

            if (wordInfo.definitions === undefined
                || wordInfo.definitions.length === 0) {
                wordsWithDefinitions.splice(index, 1);
            }
        });

        return wordsWithDefinitions;
    }

}
