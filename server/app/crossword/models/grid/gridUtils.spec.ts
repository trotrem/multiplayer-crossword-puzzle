/* tslint:disable:no-magic-numbers*/
import { expect } from "chai";
import { GridUtils } from "./gridUtils";
import { Direction } from "../../../../../common/communication/types-crossword";
import { IGrid, WordDictionaryData } from "../../dataStructures";

describe("getText", () => {
    it("Should return the text from the grid", async () => {
        const grid: IGrid = { cells: [[{isBlack: false, letter: "y", x: 0, y: 1},
                                       {isBlack: false, letter: "e", x: 0, y: 1},
                                       {isBlack: false, letter: "s", x: 0, y: 2}]],
                              words: [{ id: 0, direction: Direction.Vertical,
                                        gridSquares: [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}] }],
                              blackCells: [] };
        expect(GridUtils.getText(grid.words[0].gridSquares, grid.cells)).equals("yes");
    });
});

describe("setData", () => {
    it("Should set the text in the grid", async () => {
        const grid: IGrid = { cells: [[{isBlack: false, letter: "y", x: 0, y: 0}],
                                      [{isBlack: false, letter: "e", x: 1, y: 0}],
                                      [{isBlack: false, letter: "s", x: 2, y: 0}]],
                              words: [{ id: 0, direction: Direction.Horizontal,
                                        gridSquares: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}] }],
                              blackCells: [] };
        GridUtils.setData(new WordDictionaryData("bah", [], 0), grid.words[0], grid.cells);
        expect(GridUtils.getText(grid.words[0].gridSquares, grid.cells)).equals("bah");
    });
});
