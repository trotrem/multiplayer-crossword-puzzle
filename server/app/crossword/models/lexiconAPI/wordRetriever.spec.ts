import { WordRetriever } from "./wordRetriever";
import * as assert from "assert";
import { expect } from "chai";
import { Difficulty } from "../../../../../common/communication/types-crossword";
import { WordDictionaryData } from "../../dataStructures";

const wordRetriever: WordRetriever = WordRetriever.instance;
let words: WordDictionaryData[] = [];

describe("Test to see if wordRetrieve correctly create object of the word 'hall'.", () => {

    it("The word should be : 'hall'. ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("hall", Difficulty.Easy);
        const word: string = words[0].word;
        const expectedWord: string = "hall";
        expect(word).to.equal(expectedWord);
    });

    it("The chosen definition should be : 'n\ta large building for meetings or entertainment'. ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("hall", Difficulty.Easy);
        const secondDefinition: string = words[0].definitions[0];
        const expectedSecondDefintion: string = "n\ta large building for meetings or entertainment";
        expect(secondDefinition).to.equal(expectedSecondDefintion);
    });

    it("The frequency of 'hall' should be : '107.184799'. ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("hall", Difficulty.Easy);
        const frequency: number = words[0].frequency;
        const expectedFrequency: number = 107.184799;
        expect(frequency).to.equal(expectedFrequency);
    });

    it("The word 'hall' should be common. ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("hall", Difficulty.Easy);
        const isCommon: boolean = words[0].isCommon;
        expect(isCommon).to.equal(true);
    });

});

describe("test on Querry of the words 't?e' to see if it handles certain exceptions correctly.", () => {

    it("the first valid word should be 'tie' (first JSON word was the, but has no def).", async () => {
        words = await wordRetriever.getWordsWithDefinitions("t?e", Difficulty.Easy);
        const word: string = words[0].word;
        const expectedWord: string = "tie";
        expect(word).to.be.equal(expectedWord);
    });
});

describe("Test the get Easy and Medium WordList  to see if it returns only common words with 1 definition.", () => {

    it("Easy: The words should be : 'hall', 'hill' and 'hell', 'hull'. ", async () => {
        words = await wordRetriever.getEasyWordList("H?ll");
        words.forEach((wordInfo: WordDictionaryData, index: number) => {
            const word: string = wordInfo.word;
            const expectedWord: string[] = ["hall", "hill", "hell", "hull"];
            assert.equal(word, expectedWord[index]);
        });
    });

    it("Medium: The words should be : 'hall', 'hill' and 'hell' and 'hull'. ", async () => {
        words = await wordRetriever.getMediumWordList("H?ll");
        words.forEach((wordInfo: WordDictionaryData, index: number) => {
            const word: string = wordInfo.word;
            const expectedWord: string[] = ["hall", "hill", "hell", "hull"];
            assert.equal(word, expectedWord[index]);
        });
    });

    it("The words should all have 1 definition ", async () => {
        words = await wordRetriever.getEasyWordList("H?ll");
        words.forEach((wordInfo: WordDictionaryData) => {
            const length: number = wordInfo.definitions.length;
            assert.equal(length, 1);
        });
    });
});

describe("Test the getHardWordList to see if it returns only uncommon words with 1 definition.", () => {

    it("The only word should be : 'hull'.", async () => {
        words = await wordRetriever.getHardWordList("H?ll");
        words.forEach((wordInfo: WordDictionaryData, index: number) => {
            const word: string = wordInfo.word;
            const expectedWord: string[] = ["hull"];
            assert.equal(word, expectedWord[index]);
        });
    });

    it("The words should all have 1 definition ", async () => {
        words = await wordRetriever.getHardWordList("H?ll");
        words.forEach((wordInfo: WordDictionaryData) => {
            const length: number = wordInfo.definitions.length;
            assert.equal(length, 1);
        });
    });
});

describe("Querry of 5 letter words to check specific constraint", () => {

    it("All words should be 5 letters long. ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("?????", Difficulty.Hard);
        words.forEach((wordInfo: WordDictionaryData) => {
            const expectedLength: number = 5;
            expect(wordInfo.word).to.have.length(expectedLength);
        });
    });

    it("If we querry without '?', the words should still have the correct length", async () => {
        words = await wordRetriever.getWordsWithDefinitions("arise", Difficulty.Hard);
        words.forEach((wordInfo: WordDictionaryData) => {
            const expectedLength: number = 5;
            expect(wordInfo.word).to.have.length(expectedLength);
        });
    });

    it("There should only be noun and verb, all words possess at least 1 definition ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("?????", Difficulty.Hard);
        words.forEach((wordInfo: WordDictionaryData) => {
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
        words = await wordRetriever.getWordsWithDefinitions("3d", Difficulty.Hard);
        expect(words.length).to.equal(0);

    });
});
