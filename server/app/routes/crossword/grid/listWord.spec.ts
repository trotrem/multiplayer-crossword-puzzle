import { expect } from "chai";
import { ListWord } from "./listWords";
import { Grid } from "./grid";
import { Word } from "./word";

const TAILLEMIN: number = 2;

describe("ListOfWord", () => {
    let list: ListWord;
    const grid: Grid = new Grid();

    it("Should have words with a minimum of two letters", () => {
        list = new ListWord(grid);
        let isMinimum: boolean = true;
        const listH: Word[] = list.ListOfWordH;
        const listV: Word[] = list.ListOfWordH;
        for (let word: number = 0; word < list.LengthOfH; word++) {
            if (listH[word].Length < TAILLEMIN) {
                isMinimum = false;
            }
        }
        for (let word: number = 0; word < list.LengthOfV; word++) {
            if (listV[word].Length < TAILLEMIN) {
                isMinimum = false;
            }
        }
        expect(isMinimum);
    });
});
