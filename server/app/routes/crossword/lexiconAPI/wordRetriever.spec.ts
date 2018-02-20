import { GridWordInformation } from "./gridWordInformation";
import { WordRetriever } from "./wordRetriever";
import * as assert from "assert";
import {expect} from "chai";


const wordRetriever: WordRetriever = WordRetriever.instance;
//let result: string;
let words: GridWordInformation[];
describe("Test the getEasyWordList to see if it returns only common words with 1 definition.", () => {

    it("The word should be : 'hall'. ", async () => {
        words = await wordRetriever.getEasyWordList("H?ll");
        words.forEach(word => {
            console.log(word.word)
        });
        const word: string = words[0].word;
        const expectedWord: string = "hall";
        assert.equal(word, expectedWord);
    });
});