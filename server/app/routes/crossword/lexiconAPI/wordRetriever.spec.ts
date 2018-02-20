import { GridWordInformation } from "./gridWordInformation";
import { WordRetriever } from "./wordRetriever";
import * as assert from "assert";
import { expect } from "chai";


const wordRetriever: WordRetriever = WordRetriever.instance;
//let result: string;
let words: GridWordInformation[];
describe("Test the getEasyWordList to see if it returns only common words with 1 definition.", () => {

    it("The words should be : 'hall', 'hill' and 'hell'. ", async () => {
        words = await wordRetriever.getEasyWordList("H?ll");
        words.forEach(wordInfo => {
            const word: string = wordInfo.word;
            const expectedWord: string = "hall";
            assert.equal(word, expectedWord);
        });

    });
});