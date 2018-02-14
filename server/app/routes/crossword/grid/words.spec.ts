import { expect } from "chai";
import { Words } from "./words";
import { Grid } from "./grid";
import { Word } from "./word";

const TAILLEMIN: number = 2;

describe("ListOfWords", () => {
    let list: Words;
    const grid: Grid = new Grid();

    it("Should have words with a minimum of two letters", () => {
        list = new Words(grid);
        let isMinimum: boolean = true;
        const listH: Word[] = list.ListOfWord;
        for (let word: number = 0; word < list.ListOfWord.length; word++) {
            if (listH[word].Length < TAILLEMIN) {
                isMinimum = false;
            }
        }
        expect(isMinimum);
    });
});
