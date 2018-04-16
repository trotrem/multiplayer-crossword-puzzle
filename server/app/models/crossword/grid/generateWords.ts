import { GridLayoutHandler } from "./gridLayoutHandler";
import { WordsPositionsHelper } from "./wordsPositionsHelper";
import { GridUtils } from "./gridUtils";
import { WordRetriever } from "../lexiconAPI/wordRetriever";
import { WordDictionaryData } from "../lexiconAPI/word-dictionnary-data";
import { IGrid, IWordContainer } from "./dataStructures";
import { Utils } from "../../..//utils";
import { Difficulty } from "../../../../../common/communication/types";

export module GenerateWords {

    export const filterRepeatedWords: ({ }: WordDictionaryData[], { }: IGrid) => WordDictionaryData[] =
        (words: WordDictionaryData[], grid: IGrid) => {
            if (words.length > 0) {
                words = words.filter((wordInfo: WordDictionaryData) => {
                    return grid.words.map((w: IWordContainer) => GridUtils.getText(w.gridSquares, grid)).indexOf(wordInfo.word) === -1;
                });
            }

            return words;
        };

    export const addWord: ({ }: number, { }: IGrid, { }: Difficulty) =>
        Promise<IGrid> = async (index: number, grid: IGrid, difficulty: Difficulty) => {
            if (index === grid.words.length) {
                return grid;
            }
            let words: WordDictionaryData[] = await WordRetriever.instance.getWordsWithDefinitions(
                GridUtils.getText(grid.words[index].gridSquares, grid), difficulty);
            words = filterRepeatedWords(words, grid);
            for ({} of words) {

                const newWordData: WordDictionaryData = words[Utils.randomIntFromInterval(0, words.length - 1)];
                if (GridUtils.wordFitsInGrid(newWordData.word, grid.words[index].gridSquares, grid)) {
                    GridUtils.setData(newWordData, grid.words[index], grid);

                    const nextStep: IGrid = await addWord(index + 1, grid, difficulty);
                    if (nextStep !== null) {
                        return nextStep;
                    }
                    break;
                }
            }

            return null;
        };

    export const generateGrid: ({ }: Difficulty) =>
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
