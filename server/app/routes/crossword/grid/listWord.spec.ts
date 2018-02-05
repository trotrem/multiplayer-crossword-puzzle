import { expect } from 'chai';
import { ListWord } from "./listWords";
import { Grid } from './grid';

const TAILLEMIN = 2;

describe("ListOfWord", () => {
    let list: ListWord;
    let grid = new Grid();

    it("should be instantiable using default constructor", () => {
        list = new ListWord(grid);
        expect(list).exist;
    });

    it("Should have words with a minimum of two letters", (letter) => {
        list = new ListWord(grid);
        let isMinimum: boolean = true;
        let listH = list.getListOfWordH();
        let listV = list.getListOfWordH();
        for (let word = 0; word < list.getLengthOfH(); word++) {
            if (listH[word].getLength() < TAILLEMIN) {
                isMinimum = false;
            }
        }
        for (let word = 0; word < list.getLengthOfV(); word++) {
            if (listV[word].getLength() < TAILLEMIN) {
                isMinimum = false;
            }
        }
        expect(isMinimum);
        letter();
    });
});
