import { GridWordInformation } from "./gridWordInformation";
import { WordRetriever } from "./wordRetriever";
import { expect } from "chai";

const wordRetriever: WordRetriever = WordRetriever.instance;
let words: GridWordInformation[];

describe("Querry of the word 'hall'.", () => {

    it("The word should be : 'hall'. ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("hall");
        const word: string = words[0].word;
        const expectedWord: string = "HALL";
        expect(word).to.be.equal(expectedWord);
    });

    it("The second definition should be : 'n\ta large room for gatherings or entertainment'. ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("hall");
        const secondDefinition: string = words[0].definitions[1];
        const expectedSecondDefinition: string = "n\ta large room for gatherings or entertainment";
        expect(secondDefinition).to.be.equal(expectedSecondDefinition);
    });

    it("The word 'hall' should possess 13 valid definitions.", async () => {
        words = await wordRetriever.getWordsWithDefinitions("hall");
        const numberOfDefs: number = words[0].definitions.length;
        const expectedLength: number = 13;
        expect(numberOfDefs).to.be.equal(expectedLength);
    });

    it("The frequency of 'hall' should be : '107.184799'. ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("hall");
        const frequency: number = words[0].frequency;
        const expectedFrequency: number = 107.184799;
        expect(frequency).to.be.equal(expectedFrequency);
    });

    it("The word 'hall' should be common. ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("hall");
        const isCommon: boolean = words[0].isCommon;
        expect(isCommon).to.be.true;
    });

});

describe("Querry of the words 't?e' (3 letters starting with 't' amd finishing with 'e').", () => {

    it("the first valid word should be 'tie'.  ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("t?e");
        const word: string = words[0].word;
        const expectedWord: string = "TIE";
        expect(word).to.be.equal(expectedWord);
    });

    it("Should have conserved only 5 words.", async () => {
        words = await wordRetriever.getWordsWithDefinitions("t?e");
        const expectedNumberOfWord: number = 5;
        expect(words).to.be.length(expectedNumberOfWord);
    });

    it("The word 'tee' should be uncommon.", async () => {
        words = await wordRetriever.getWordsWithDefinitions("t?e");
        const teeIndex: number = 2;
        expect(words[teeIndex].isCommon).to.be.false;
    });
});

describe("Querry of the word '3d'.", () => {

    it("There should be no object created, (empty array) ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("3d");
        expect(words).to.be.empty;
    });
});
