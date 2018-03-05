/* import { expect } from "chai";
import { WordsInventory } from "./wordsInventory";
import { Grid } from "./grid";
import { Word } from "./word";

const TAILLEMIN: number = 2;

describe("ListOfWords", () => {
    let list: WordsInventory;
    const grid: Grid = new Grid();
    grid.makeGrid();
    list = new WordsInventory(grid);
    list.createListOfWord();
    /*let combineString: string = "";
    for (let indexI = 0; indexI < grid.Height; indexI++) {
        combineString += "|";
        for (let indexJ = 0; indexJ < grid.Width; indexJ++) {
            if (grid.getSquareIsBlack(indexI, indexJ)) {
                combineString += " # ";
            } else {
                combineString += " ? ";
            }
        }
        combineString += "|\n";
    }
    console.log(combineString);
    console.log("Liste :");
    for(let i = 0; i< list.ListOfWord.length; i++){
        console.log(list.ListOfWord[i].Length);
        console.log(list.ListOfWord[i].GridWord.word);
    }
    it("Should have words with a minimum of two letters", () => {
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
 */