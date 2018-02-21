import { GridWordInformation } from "./gridWordInformation";
import { WordRetriever } from "./wordRetriever";
import * as assert from "assert";
import { expect } from "chai";

const wordRetriever: WordRetriever = WordRetriever.instance;
let words: GridWordInformation[] = [];

describe("Test to see if wordRetrieve correctly create object of the word 'hall'.", () => {

    it("The word should be : 'hall'. ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("hall");
        const word: string = words[0].word;
        const expectedWord: string = "hall";
        expect(word).to.equal(expectedWord);
    });

    it("The second definition should be : 'n\ta large room for gatherings or entertainment'. ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("hall");
        const secondDefinition: string = words[0].definitions[1];
        const expectedSecondDefintion: string = "n\ta large room for gatherings or entertainment";
        expect(secondDefinition).to.equal(expectedSecondDefintion);
    });

    it("The word 'hall' should possess 13 valid definitions.", async () => {
        words = await wordRetriever.getWordsWithDefinitions("hall");
        const expectedLength: number = 13;
        expect(words[0].definitions).to.have.length(expectedLength);
    });

    it("The frequency of 'hall' should be : '107.184799'. ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("hall");
        const frequency: number = words[0].frequency;
        const expectedFrequency: number = 107.184799;
        expect(frequency).to.equal(expectedFrequency);
    });

    it("The word 'hall' should be common. ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("hall");
        const isCommon: boolean = words[0].isCommon;
        expect(isCommon).to.be.true;
    });

});

describe("test on Querry of the words 't?e' to see if it handles certain exceptions correctly.", () => {

    it("the first valid word should be 'tie' (first JSON word was the, but has no def).", async () => {
        words = await wordRetriever.getWordsWithDefinitions("t?e");
        const word: string = words[0].word;
        const expectedWord: string = "tie";
        expect(word).to.be.equal(expectedWord);
    });

    it("Should have conserved only 5 words.", async () => {
        words = await wordRetriever.getWordsWithDefinitions("t?e");
        const expectedLength: number = 5;
        expect(words).to.have.length(expectedLength);
    });

    it("The word 'tee' should be uncommon.", async () => {
        words = await wordRetriever.getWordsWithDefinitions("t?e");
        const teeIndex: number = 2;
        const isCommon: boolean = words[teeIndex].isCommon;
        expect(isCommon).to.be.false;
    });
});

describe("Querry of the word 'fall' to check specific constraints.", () => {

    it("No definition should have 'fall' in it (there are defs with it in the api). ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("fall");
        words[0].definitions.forEach((defs: string, index: number) => {
            expect(defs).to.not.contain(words[0]);
        });
    });
});

describe("Test the get Easy and Medium WordList  to see if it returns only common words with 1 definition.", () => {

    it("Easy: The words should be : 'hall', 'hill' and 'hell'. ", async () => {
        words = await wordRetriever.getEasyWordList("H?ll");
        words.forEach((wordInfo: GridWordInformation, index: number) => {
            const word: string = wordInfo.word;
            const expectedWord: string[] = ["hall", "hill", "hell"];
            assert.equal(word, expectedWord[index]);
        });
    });

    it("Medium: The words should be : 'hall', 'hill' and 'hell'. ", async () => {
        words = await wordRetriever.getMediumWordList("H?ll");
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

describe("Querry of 5 letter words to check specific constraint", () => {

    it("All words should be 5 letters long. ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("?????");
        words.forEach((wordInfo: GridWordInformation) => {
            const expectedLength: number = 5;
            expect(wordInfo.word).to.have.length(expectedLength);
        });
    });

    it("If we querry without '?', the words should still have the correct length", async () => {
        words = await wordRetriever.getWordsWithDefinitions("arise");
        words.forEach((wordInfo: GridWordInformation) => {
            const expectedLength: number = 5;
            expect(wordInfo.word).to.have.length(expectedLength);
        });
    });

    it("There should only be noun and verb, all words possess at least 1 definition ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("?????");
        words.forEach((wordInfo: GridWordInformation) => {
            wordInfo.definitions.forEach((def: string) => {
                if (def.charAt(0) !== "v") {
                    expect(def).to.include("n\t");
                } else if (def.charAt(0) !== "n") {
                    expect(def).to.include("v\t");
                }
            });
        });
    });
});

describe("Test on words with non alpha character", () => {
    it("When we query the word 3d, the array should be empty ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("3d");
        expect(words).to.be.empty;

    });
});
