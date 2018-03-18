import { GridLayoutHandler } from "./gridLayoutHandler";
import { WordsPositionsHelper } from "./wordsPositionsHelper";
import { GridUtils } from "./wordsUtils";
import { WordRetriever } from "../lexiconAPI/wordRetriever";
import { WordDictionaryData } from "../lexiconAPI/gridWordInformation";
import { IGrid, IWordContainer } from "./dataStructures";
import { Utils } from "../../../utils";

const wordRetriever: WordRetriever = WordRetriever.instance;
const MAX_ATTEMPTS: number = 100;

export class GenerateWords {
  private _layoutHandler: GridLayoutHandler;

  public async generateGrid(): Promise<IGrid> {
    this._layoutHandler = new GridLayoutHandler();
    for (let i: number = 0; i < MAX_ATTEMPTS; i++) {
      const grid: IGrid = { cells: [], words: [], blackCells: [] };
      this._layoutHandler.makeGrid(grid);
      WordsPositionsHelper.createListOfWord(grid);
      const result: IGrid = await this.addWord(0, grid);
      if (result !== null) {
        return result;
      }
    }

    return null;
  }

  private async addWord(index: number, grid: IGrid): Promise<IGrid> {
    if (index === grid.words.length) {
      return grid;
    }
    let words: WordDictionaryData[] = await this.wordRetrieve(GridUtils.getText(grid.words[index], grid));
    words = this.filterRepeatedWords(words, grid);
    for ({} of words) {
      if (
        GridUtils.trySetData(
          words[Utils.randomIntFromInterval(0, words.length - 1)],
          grid.words[index],
          grid
        )
      ) {
        const nextStep: IGrid = await this.addWord(index + 1, grid);
        if (nextStep !== null) {
          return nextStep;
        }
        break;
      }
    }

    return null;
  }

  private filterRepeatedWords(
    words: WordDictionaryData[],
    grid: IGrid
  ): WordDictionaryData[] {
    if (words.length > 0) {
      words = words.filter((wordInfo: WordDictionaryData) => {
        return (
          grid.words
            .map((w: IWordContainer) => GridUtils.getText(w, grid))
            .indexOf(wordInfo.word) === -1
        );
      });
    }

    return words;
  }

  private async wordRetrieve(word: string): Promise<WordDictionaryData[]> {
    let words: WordDictionaryData[];
    words = await wordRetriever.getWordsWithDefinitions(word);

    return words;
  }
}
