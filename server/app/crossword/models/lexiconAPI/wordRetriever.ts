import { WordDictionaryData } from "../../dataStructures";
import { ExternalApiService } from "./externalApi.service";
import { Difficulty } from "../../../../../common/communication/types-crossword";
import { DatamuseObject } from "./datamuse-object";

const OFFSET_FREQUENCY: number = 2;		// Tag format : f:xxxx
const NOUN: string = "n";
const VERB: string = "v";
const NUMERICAL_VALUES: RegExp = /d/;

export class WordRetriever {
    private static _instance: WordRetriever;

    public static get instance(): WordRetriever {
        return this._instance || (this._instance = new this());
    }

    public async getWordsWithDefinitions(word: string, difficulty: Difficulty): Promise<WordDictionaryData[]> {
        if (difficulty === Difficulty.Easy) {
            return this.getEasyWordList(word);
        } else if (difficulty === Difficulty.Medium) {
            return this.getMediumWordList(word);
        } else {
            return this.getHardWordList(word);
        }
    }

    public async getEasyWordList(word: string): Promise<WordDictionaryData[]> {
        const filter: (wordInfo: WordDictionaryData) => boolean = (
            wordInfo: WordDictionaryData
        ) => wordInfo.isCommon && wordInfo.definitions.length > 0;
        const easyWordList: WordDictionaryData[] = await this.createWordListWithDefinitions(
            word,
            filter
        );
        easyWordList.forEach((wordInfo: WordDictionaryData) => {
            wordInfo.definitions = wordInfo.definitions.splice(0, 1);
        });

        return easyWordList;
    }

    public async getMediumWordList(word: string): Promise<WordDictionaryData[]> {
        const filter: (wordInfo: WordDictionaryData) => boolean = (
            wordInfo: WordDictionaryData
        ) => wordInfo.isCommon && wordInfo.definitions.length > 0;

        const mediumWordList: WordDictionaryData[] = await this.createWordListWithDefinitions(
            word,
            filter
        );
        mediumWordList.forEach((wordInfo: WordDictionaryData) => {
            wordInfo.definitions =
                wordInfo.definitions.length > 1
                    ? wordInfo.definitions.splice(1, 1)
                    : wordInfo.definitions.splice(0, 1);
        });

        return mediumWordList;
    }

    public async getHardWordList(word: string): Promise<WordDictionaryData[]> {
        const filter: (wordInfo: WordDictionaryData) => boolean = (
            wordInfo: WordDictionaryData
        ) => !wordInfo.isCommon && wordInfo.definitions.length > 0;

        const hardWordList: WordDictionaryData[] = await this.createWordListWithDefinitions(
            word,
            filter
        );
        hardWordList.forEach((wordInfo: WordDictionaryData) => {
            wordInfo.definitions =
                wordInfo.definitions.length > 1
                    ? wordInfo.definitions.splice(1, 1)
                    : wordInfo.definitions.splice(0, 1);
        });

        return hardWordList;
    }

    private async createWordListWithDefinitions(
        word: string,
        filter: (wordInfo: WordDictionaryData) => boolean
    ): Promise<WordDictionaryData[]> {
        let wordsWithDefinitions: WordDictionaryData[] = [];
        const apiService: ExternalApiService = new ExternalApiService();
        const words: DatamuseObject[] = await apiService.requestWordInfo(word);
        wordsWithDefinitions = this.filterWords(wordsWithDefinitions, words, word);
        wordsWithDefinitions = this.removeDefinitions(wordsWithDefinitions);
        wordsWithDefinitions = this.removesWords(wordsWithDefinitions);

        return wordsWithDefinitions.filter(filter);
    }

    private filterWords(
        wordsWithDefinitions: WordDictionaryData[],
        words: DatamuseObject[],
        word: string
    ): WordDictionaryData[] {
        for (const wordData of words) {
            if (
                wordData.defs !== undefined &&
                wordData.word.search(NUMERICAL_VALUES) === -1 &&
                wordData.word.length === word.length
            ) {
                this.addWord(wordsWithDefinitions, wordData);
            }
        }

        return wordsWithDefinitions;
    }

    private addWord(wordsWithDefinitions: WordDictionaryData[], wordData: DatamuseObject): void {
        const tempFrequency: number = parseFloat(wordData.tags[0].substring(OFFSET_FREQUENCY));
        const tempWord: WordDictionaryData = new WordDictionaryData(
            wordData.word,
            wordData.defs,
            tempFrequency
        );
        wordsWithDefinitions.push(tempWord);
    }

    private removeDefinitions(wordsWithDefinitions: WordDictionaryData[]): WordDictionaryData[] {
        wordsWithDefinitions.forEach(
            (wordInfo: WordDictionaryData, index: number) => {
                wordInfo.definitions = wordInfo.definitions.filter(
                    (def: string) => def.charAt(0) === NOUN || def.charAt(0) === VERB
                );
                wordInfo.definitions = wordInfo.definitions.filter(
                    (def: string) => !(def.indexOf(wordInfo.word) >= 0)
                );
            }
        );

        return wordsWithDefinitions;
    }

    private removesWords(wordsWithDefinitions: WordDictionaryData[]): WordDictionaryData[] {
        wordsWithDefinitions.forEach(
            (wordInfo: WordDictionaryData, index: number) => {
                if (wordInfo.definitions === undefined ||wordInfo.definitions.length === 0) {
                    wordsWithDefinitions.splice(index, 1);
                }
            }
        );

        return wordsWithDefinitions;
    }
}
