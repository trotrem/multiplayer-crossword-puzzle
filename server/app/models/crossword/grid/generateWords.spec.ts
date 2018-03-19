// TODO: fix
// tslint:disable
import { expect } from "chai";
import { GenerateWords } from "./generateWords";
import { WordsPositionsHelper } from "./wordsPositionsHelper";
import { IGrid } from "./dataStructures";
import { GridUtils } from "./gridUtils";

describe("createListOfWord", () => {
    let grid: IGrid = { cells: [], words: [], blackCells: [] };

    it("Should add words", async () => {
        grid = { cells: [[{isBlack: false, letter: "", x: 0, y: 0}, {isBlack: false, letter: "", x: 1, y: 0}, {isBlack: false, letter: "", x: 2, y: 0}, {isBlack:  true, letter: "", x: 3, y: 0}],
        [{isBlack: false, letter: "", x: 0, y: 1}, {isBlack:  true, letter: "", x: 1, y: 1}, {isBlack: false, letter: "", x: 2, y: 1}, {isBlack: false, letter: "", x: 3, y: 1}],
        [{isBlack: false, letter: "", x: 0, y: 2}, {isBlack: false, letter: "", x: 1, y: 2}, {isBlack:  true, letter: "", x: 2, y: 2}, {isBlack: false, letter: "", x: 3, y: 2}],
        [{isBlack: false, letter: "", x: 0, y: 3}, {isBlack: false, letter: "", x: 1, y: 3}, {isBlack:  true, letter: "", x: 2, y: 3}, {isBlack: false, letter: "", x: 3, y: 3}]], words: [], blackCells: [] };

        WordsPositionsHelper.createListOfWord(grid);
        grid = await GenerateWords.addWord(0, grid);
        expect(GridUtils.getText(grid.words[0], grid).indexOf("?")).equals(-1);
        expect(GridUtils.getText(grid.words[1], grid).indexOf("?")).equals(-1);
        expect(GridUtils.getText(grid.words[2], grid).indexOf("?")).equals(-1);
        expect(GridUtils.getText(grid.words[0], grid).length).equals(4);
        expect(GridUtils.getText(grid.words[1], grid).length).equals(3);
        expect(GridUtils.getText(grid.words[2], grid).length).equals(3);
    });
});
