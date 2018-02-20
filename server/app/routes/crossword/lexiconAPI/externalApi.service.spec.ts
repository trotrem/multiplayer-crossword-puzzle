//import { ExternalApiService } from "./externalApi.service";
/*import { GridWordInformation } from "./gridWordInformation";
import { WordRetriever } from "./wordRetriever";
import * as assert from "assert";
import {expect} from "chai";*/

/*const wordRetriever: WordRetriever = WordRetriever.instance;
//let result: string;
let words: GridWordInformation[];
describe("Querry of the word 'hall'.", () => {

    it("The word should be : 'hall'. ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("hall")
        const word: string = words[0].word;
        const expectedWord: string = "hall";
        assert.equal(word, expectedWord);
    });

    it("The second definition should be : 'n\ta large room for gatherings or entertainment'. ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("hall");
        const secondDefinition: string = words[0].definitions[1];
        const expectedSecondDefintion: string = "n\ta large room for gatherings or entertainment";
        assert.equal(secondDefinition, expectedSecondDefintion);
    });

    it("The word 'hall' should possess 13 valid definitions.", async () => {
        words = await wordRetriever.getWordsWithDefinitions("hall");
        const numberOfDefs: number = words[0].definitions.length;
        const expectedLength: number = 13;
        assert.equal(numberOfDefs, expectedLength);
    });

    it("The frequency of 'hall' should be : '107.184799'. ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("hall");
        const frequency: number = words[0].frequency;
        const expectedFrequency: number = 107.184799;
        assert.equal(frequency, expectedFrequency);
    });

    it("The word 'hall' should be common. ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("hall");
        const isCommon: boolean = words[0].isCommon;
        const expectedValue: boolean = true;
        assert.equal(isCommon, expectedValue);
    });

});

describe("Querry of the words 't?e' (3 letters starting with 't' amd finishing with 'e').", () => {

    it("the first valid word should be 'tie'.  ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("t?e");
        const word: string = words[0].word;
        const expectedWord: string = "tie";
        assert.equal(word, expectedWord);
    });

    it("Should have conserved only 5 words.", async () => {
        words = await wordRetriever.getWordsWithDefinitions("t?e");
        const numberOfWords: number = words.length;
        const expectedLength: number = 5;
        assert.equal(numberOfWords, expectedLength);
    });

    it("The word 'tee' should be uncommon.", async () => {
        words = await wordRetriever.getWordsWithDefinitions("t?e");
        const teeIndex: number = 2;
        const isCommon: boolean = words[teeIndex].isCommon;
        const expectedValue: boolean = false;
        assert.equal(isCommon, expectedValue);
    });
});

describe("Querry of the word 'fall'.", () => {

    it("No definition should have 'fall' in it (there are defs with it in the api). ", async () => {
        words = await wordRetriever.getWordsWithDefinitions("fall")
        for (let i = 0; i < words[0].definitions.length; i++){
            words[0].definitions[i]
            console.log(words[0].definitions[i])
            expect(words[0].definitions[i]).to.not.contain(words[0]);
        }
       // const expectedWord: string = "hall";
       // assert.equal(word, expectedWord);
    });
});*/
