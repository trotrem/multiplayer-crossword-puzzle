/* tslint:disable:no-magic-numbers*/
import { expect } from "chai";
import { WordsPositionsHelper } from "./wordsPositionsHelper";
import { IGrid } from "../../dataStructures";

describe("createListOfWord", () => {
    let grid: IGrid = { cells: [], words: [], blackCells: [] };

    it("Should add words", () => {
        grid = { cells: [[{isBlack: false, letter: "", x: 0, y: 0}, {isBlack: false, letter: "", x: 1, y: 0},
                          {isBlack: false, letter: "", x: 2, y: 0}, {isBlack: false, letter: "", x: 3, y: 0}],
                         [{isBlack: false, letter: "", x: 0, y: 1}, {isBlack: false, letter: "", x: 1, y: 1},
                          {isBlack: false, letter: "", x: 2, y: 1}, {isBlack: false, letter: "", x: 3, y: 1}],
                         [{isBlack: false, letter: "", x: 0, y: 2}, {isBlack: false, letter: "", x: 1, y: 2},
                          {isBlack: false, letter: "", x: 2, y: 2}, {isBlack: false, letter: "", x: 3, y: 2}],
                         [{isBlack: false, letter: "", x: 0, y: 3}, {isBlack: false, letter: "", x: 1, y: 3},
                          {isBlack: false, letter: "", x: 2, y: 3}, {isBlack: false, letter: "", x: 3, y: 3}]],
                 words: [], blackCells: [] };
        WordsPositionsHelper.createListOfWord(grid);
        expect(grid.words.length).equals(8);
    });

    it("Should ignore words shorter than 2", () => {
        grid = { cells: [[{isBlack: false, letter: "", x: 0, y: 0}, {isBlack: false, letter: "", x: 1, y: 0}],
                         [{isBlack: false, letter: "", x: 0, y: 1}, {isBlack: false, letter: "", x: 1, y: 1}]],
                 words: [], blackCells: [] };
        WordsPositionsHelper.createListOfWord(grid);
        expect(grid.words.length).equals(0);
    });

    it("Should only add words longer than 2", () => {
        grid = { cells: [[{isBlack: false, letter: "", x: 0, y: 0},
                          {isBlack: false, letter: "", x: 1, y: 0},
                          {isBlack: false, letter: "", x: 2, y: 0}],
                         [{isBlack: false, letter: "", x: 0, y: 1},
                          {isBlack: true, letter: "", x: 1, y: 1},
                          {isBlack: false, letter: "", x: 2, y: 1}],
                         [{isBlack: false, letter: "", x: 0, y: 2},
                          {isBlack: false, letter: "", x: 1, y: 2},
                          {isBlack: true, letter: "", x: 2, y: 2}]],
                 words: [], blackCells: [] };
        WordsPositionsHelper.createListOfWord(grid);
        expect(grid.words.length).equals(2);
    });

    it("Should fill unused cells with black", () => {
        grid = { cells: [[{isBlack: false, letter: "", x: 0, y: 0}, {isBlack: false, letter: "", x: 1, y: 0}],
                         [{isBlack: false, letter: "", x: 0, y: 1}, {isBlack: false, letter: "", x: 1, y: 1}]],
                 words: [], blackCells: [] };
        WordsPositionsHelper.createListOfWord(grid);
        expect(grid.blackCells.length).equals(4);
    });

    it("Should sort words by length", () => {
        grid = { cells: [[{isBlack: false, letter: "", x: 0, y: 0}, {isBlack: false, letter: "", x: 1, y: 0},
                          {isBlack: false, letter: "", x: 2, y: 0}, {isBlack:  true, letter: "", x: 3, y: 0}],
                         [{isBlack: false, letter: "", x: 0, y: 1}, {isBlack:  true, letter: "", x: 1, y: 1},
                          {isBlack: false, letter: "", x: 2, y: 1}, {isBlack: false, letter: "", x: 3, y: 1}],
                         [{isBlack: false, letter: "", x: 0, y: 2}, {isBlack: false, letter: "", x: 1, y: 2},
                          {isBlack:  true, letter: "", x: 2, y: 2}, {isBlack: false, letter: "", x: 3, y: 2}],
                         [{isBlack: false, letter: "", x: 0, y: 3}, {isBlack: false, letter: "", x: 1, y: 3},
                          {isBlack:  true, letter: "", x: 2, y: 3}, {isBlack: false, letter: "", x: 3, y: 3}]],
                 words: [], blackCells: [] };
        WordsPositionsHelper.createListOfWord(grid);
        expect(grid.words[0].gridSquares.length).equals(4);
        expect(grid.words[1].gridSquares.length).equals(3);
        expect(grid.words[2].gridSquares.length).equals(3);
    });
});
