import { GridWordInformation } from "./gridWordInformation";
import { WordRetriever } from "./wordRetriever";
import * as assert from "assert";
// import { expect } from "chai";

const wordRetriever: WordRetriever = WordRetriever.instance;
let words: GridWordInformation[] = [];

describe("Test the getEasyWordList to see if it returns only common words with 1 definition.", () => {

    it("The words should be : 'hall', 'hill' and 'hell'. ", async () => {
        words = await wordRetriever.getEasyWordList("H?ll");
        words.forEach((wordInfo: GridWordInformation, index: number) => {
            const word: string = wordInfo.word;
            const expectedWord: string[] = ["hall", "hill", "hell"];
            assert.equal(word, expectedWord[index]);
        });
    });

    it("The words should all have 1 definition ", async () => {
        words = await wordRetriever.getEasyWordList("H?ll");
        words.forEach((wordInfo: GridWordInformation) => {
            const length: number = wordInfo.definitions.length;
            assert.equal(length, 1);
        });
    });
});

describe("Test the getHardWordList to see if it returns only uncommon words with 1 definition.", () => {

    it("The only word should be : 'hull'.", async () => {
        words = await wordRetriever.getHardWordList("H?ll");
        words.forEach((wordInfo: GridWordInformation, index: number) => {
            const word: string = wordInfo.word;
            const expectedWord: string[] = ["hull"];
            assert.equal(word, expectedWord[index]);
        });
    });

    it("The words should all have 1 definition ", async () => {
        words = await wordRetriever.getHardWordList("H?ll");
        words.forEach((wordInfo: GridWordInformation) => {
            const length: number = wordInfo.definitions.length;
            assert.equal(length, 1);
        });
    });
});
