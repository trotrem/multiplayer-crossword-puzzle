import { GridLayoutHandler } from "./gridLayoutHandler";
import { WordsPositionsHelper } from "./wordsPositionsHelper";
import { GridUtils } from "./gridUtils";
import { WordRetriever } from "../lexiconAPI/wordRetriever";
import { WordDictionaryData } from "../lexiconAPI/gridWordInformation";
import { IGrid, IWordContainer } from "./dataStructures";
import { Utils } from "../../..//utils";
import { Difficulty } from "../../../../../common/communication/types";

export module GenerateWords {

  // exported for testing purposes only, should be called through generateGrid
  export const filterRepeatedWords: (words: WordDictionaryData[], grid: IGrid) => WordDictionaryData[] =
  (words: WordDictionaryData[], grid: IGrid) => {
    if (words.length > 0) {
      words = words.filter((wordInfo: WordDictionaryData) => {
        return grid.words.map((w: IWordContainer) => GridUtils.getText(w, grid)).indexOf(wordInfo.word) === -1;
      });
    }

    return words;
  };

  // exported for testing purposes only, should be called through generateGrid
  export const addWord: (index: number, grid: IGrid, difficulty: Difficulty) =>
  Promise<IGrid> = async (index: number, grid: IGrid, difficulty: Difficulty) => {
    if (index === grid.words.length) {
      return grid;
    }
    console.log(grid.words.length - index);
    let words: WordDictionaryData[] = await WordRetriever.instance.getWordsWithDefinitions(
      GridUtils.getText(grid.words[index], grid), difficulty);
    words = filterRepeatedWords(words, grid);
    for ({} of words) {
      if (GridUtils.trySetData(words[Utils.randomIntFromInterval(0, words.length - 1)], grid.words[index], grid)) {
        const nextStep: IGrid = await addWord(index + 1, grid, difficulty);
        if (nextStep !== null) {
          return nextStep;
        }
        break;
      }
    }

    return null;
  };

  export const generateGrid: (difficulty: Difficulty) =>
  Promise<IGrid> = async (difficulty: Difficulty) => {
    const go: boolean = true;
    while (go) {
      const grid: IGrid = { cells: [], words: [], blackCells: [] };
      GridLayoutHandler.makeGrid(grid);
      WordsPositionsHelper.createListOfWord(grid);
      const result: IGrid = await addWord(0, grid, difficulty);
      if (result !== null) {
        return result;
      }
    }

    return null;
  };
}
