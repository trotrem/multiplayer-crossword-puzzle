// tslint:disable:no-magic-numbers
import { expect } from "chai";
import { GenerateWords } from "./generateWords";
import { WordsPositionsHelper } from "./wordsPositionsHelper";
import { IGrid } from "./dataStructures";
import { GridUtils } from "./gridUtils";
import { Direction, Difficulty } from "../../../../../common/communication/types";
import { WordDictionaryData } from "../lexiconAPI/word-dictionnary-data";

describe("addWord", () => {

    it("Should add words", async () => {
        let grid: IGrid = { cells: [[{isBlack: false, letter: "", x: 0, y: 0}, {isBlack: false, letter: "", x: 0, y: 1},
                                     {isBlack: false, letter: "", x: 0, y: 2}, {isBlack:  true, letter: "", x: 0, y: 3}],
                                    [{isBlack: false, letter: "", x: 1, y: 0}, {isBlack:  true, letter: "", x: 1, y: 1},
                                     {isBlack: false, letter: "", x: 1, y: 2}, {isBlack: false, letter: "", x: 1, y: 3}],
                                    [{isBlack: false, letter: "", x: 2, y: 0}, {isBlack: false, letter: "", x: 2, y: 1},
                                     {isBlack:  true, letter: "", x: 2, y: 2}, {isBlack: false, letter: "", x: 2, y: 3}],
                                    [{isBlack: false, letter: "", x: 3, y: 0}, {isBlack: false, letter: "", x: 3, y: 1},
                                     {isBlack:  true, letter: "", x: 3, y: 2}, {isBlack: false, letter: "", x: 3, y: 3}]],
                            words: [], blackCells: [] };

        WordsPositionsHelper.createListOfWord(grid);
        grid = await GenerateWords.addWord(0, grid, Difficulty.Hard);
        expect(GridUtils.getText(grid.words[0], grid).indexOf("?")).equals(-1);
        expect(GridUtils.getText(grid.words[1], grid).indexOf("?")).equals(-1);
        expect(GridUtils.getText(grid.words[2], grid).indexOf("?")).equals(-1);
        expect(GridUtils.getText(grid.words[0], grid).length).equals(4);
        expect(GridUtils.getText(grid.words[1], grid).length).equals(3);
        expect(GridUtils.getText(grid.words[2], grid).length).equals(3);
    });

    it("Should return null if unable to fill grid", async () => {
        const grid: IGrid = { cells: [[{isBlack: false, letter: "j", x: 0, y: 0}],
                                      [{isBlack: false, letter: "g", x: 1, y: 0}],
                                      [{isBlack: false, letter: "z", x: 2, y: 0}]],
                              words: [{ id: 0, direction: Direction.Horizontal,
                                        gridSquares: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}] }],
                              blackCells: [] };

        const result: IGrid = await GenerateWords.addWord(0, grid, Difficulty.Hard);
        expect(result).equals(null);
    });
});

describe("wordRetrieve", () => {
    it("Should remove duplicate words", async () => {
        const grid: IGrid = { cells: [[{isBlack: false, letter: "c", x: 0, y: 0}, {isBlack: false, letter: "a", x: 0, y: 1},
                                       {isBlack: false, letter: "t", x: 0, y: 2}, {isBlack:  true, letter: "", x: 0, y: 3}],
                                      [{isBlack: false, letter: "a", x: 1, y: 0}, {isBlack:  true, letter: "", x: 1, y: 1},
                                       {isBlack: false, letter: "", x: 1, y: 2}, {isBlack: false, letter: "t", x: 1, y: 3}],
                                      [{isBlack: false, letter: "k", x: 2, y: 0}, {isBlack: false, letter: "", x: 2, y: 1},
                                       {isBlack:  true, letter: "", x: 2, y: 2}, {isBlack: false, letter: "i", x: 2, y: 3}],
                                      [{isBlack: false, letter: "e", x: 3, y: 0}, {isBlack: false, letter: "", x: 3, y: 1},
                                       {isBlack:  true, letter: "", x: 3, y: 2}, {isBlack: false, letter: "p", x: 3, y: 3}]],
                              words: [{ id: 0, direction: Direction.Horizontal,
                                        gridSquares: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}] },
                                      { id: 1, direction: Direction.Vertical,
                                        gridSquares: [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}] },
                                      { id: 2, direction: Direction.Horizontal,
                                        gridSquares: [{x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}] }],
                              blackCells: [] };

        const words: WordDictionaryData[] = [new WordDictionaryData("tip", [], 0),
                                             new WordDictionaryData("pit", [], 0),
                                             new WordDictionaryData("cake", [], 0)];
        const result: WordDictionaryData[] = GenerateWords.filterRepeatedWords(words, grid);
        expect(result.length).equals(1);
    });
});
