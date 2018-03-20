import { WordDictionaryData } from "./gridWordInformation";
import { ExternalApiService } from "./externalApi.service";
import { Difficulty } from "../../../../../common/communication/types";

const OFFSET_FREQUENCY: number = 2; // Tag format : f:xxxx
const NUMERICAL_VALUES: RegExp = /d/;

export class WordRetriever {
  private static _instance: WordRetriever;

  private constructor() {}

  public static get instance(): WordRetriever {
    return this._instance || (this._instance = new this());
  }

  public async getWordsWithDefinitions(word: string, difficulty: Difficulty): Promise<WordDictionaryData[]> {
    if (difficulty === "easy") {
      return this.getEasyWordList(word);
    } else if (difficulty === "medium") {
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
    filter: (word: WordDictionaryData) => boolean
  ): Promise<WordDictionaryData[]> {
    let wordsWithDefinitions: WordDictionaryData[] = [];
    const apiService: ExternalApiService = new ExternalApiService();
    const words: JSON = await apiService.requestWordInfo(word);
    wordsWithDefinitions = this.filterWords(wordsWithDefinitions, words, word);
    wordsWithDefinitions = this.removeDefinitions(wordsWithDefinitions);
    wordsWithDefinitions = this.removesWords(wordsWithDefinitions);

    return wordsWithDefinitions.filter(filter);
  }

  private filterWords(
    wordsWithDefinitions: WordDictionaryData[],
    words: JSON,
    word: string
  ): WordDictionaryData[] {
    for (const index in words) {
      if (
        words[index].hasOwnProperty("defs") &&
        words[index].word.search(NUMERICAL_VALUES) === -1 &&
        words[index].word.length === word.length
      ) {
        this.addWord(wordsWithDefinitions, words, index);
      }
    }

    return wordsWithDefinitions;
  }

  private addWord(
    wordsWithDefinitions: WordDictionaryData[],
    words: JSON,
    index: string
  ): void {
    const tempFrequency: number = parseFloat(
      words[index].tags[0].substring(OFFSET_FREQUENCY)
    );
    const tempWord: WordDictionaryData = new WordDictionaryData(
      words[index].word,
      words[index].defs,
      tempFrequency
    );
    wordsWithDefinitions.push(tempWord);
  }

  private removeDefinitions(
    wordsWithDefinitions: WordDictionaryData[]
  ): WordDictionaryData[] {
    wordsWithDefinitions.forEach(
      (wordInfo: WordDictionaryData, index: number) => {
        wordInfo.definitions = wordInfo.definitions.filter(
          (def: string) => def.charAt(0) === "n" || def.charAt(0) === "v"
        );
        wordInfo.definitions = wordInfo.definitions.filter(
          (def: string) => !(def.indexOf(wordInfo.word) >= 0)
        );
      }
    );

    return wordsWithDefinitions;
  }

  private removesWords(
    wordsWithDefinitions: WordDictionaryData[]
  ): WordDictionaryData[] {
    wordsWithDefinitions.forEach(
      (wordInfo: WordDictionaryData, index: number) => {
        if (
          wordInfo.definitions === undefined ||
          wordInfo.definitions.length === 0
        ) {
          wordsWithDefinitions.splice(index, 1);
        }
      }
    );

    return wordsWithDefinitions;
  }
}
