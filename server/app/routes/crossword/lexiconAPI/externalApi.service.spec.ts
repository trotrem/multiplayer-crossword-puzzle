import { ExternalApiService } from "./externalApi.service";
import { GridWordInformation } from "./gridWordInformation";
import { WordRetriever } from "./wordRetriever";
import * as assert from "assert";

describe("Querry of the word 'hall'.", () => {
    const apiService: ExternalApiService = new ExternalApiService;
    const wordRetriever: WordRetriever = new WordRetriever;
    let result: JSON;
    let words: GridWordInformation[];

    it("The word should be : 'hall'. ", (done: MochaDone) => {
        apiService.requestWordInfo("hall")
            .then(() => {
                result = apiService.requestResult;
                words = wordRetriever.getWordsWithDefinitions(result);
                const word: string = words[0].word;
                const expectedWord: string = "hall";
                assert.equal(word, expectedWord);
                done();
            })
            .catch((err: object) => { /* ERROR... */ });
    });

    it("The second definition should be : 'n\ta large room for gatherings or entertainment'. ", (done: MochaDone) => {
        apiService.requestWordInfo("hall")
            .then(() => {
                result = apiService.requestResult;
                words = wordRetriever.getWordsWithDefinitions(result);
                const secondDefinition: string = words[0].definitions[1];
                const expectedSecondDefintion: string = "n\ta large room for gatherings or entertainment";
                assert.equal(secondDefinition, expectedSecondDefintion);
                done();
            })
            .catch((err: object) => { /* ERROR... */ });
    });

    it("The word 'hall' should possess 13 valid definitions.", (done: MochaDone) => {
        apiService.requestWordInfo("hall")
            .then(() => {
                result = apiService.requestResult;
                words = wordRetriever.getWordsWithDefinitions(result);
                const numberOfDefs: number = words[0].definitions.length;
                const expectedLength: number = 13;
                assert.equal(numberOfDefs, expectedLength);
                done();
            })
            .catch((err: object) => { /* ERROR... */ });
    });

    it("The frequency of 'hall' should be : '107.184799'. ", (done: MochaDone) => {
        apiService.requestWordInfo("hall")
            .then(() => {
                result = apiService.requestResult;
                words = wordRetriever.getWordsWithDefinitions(result);
                const frequency: number = words[0].frequency;
                const expectedFrequency: number = 107.184799;
                assert.equal(frequency, expectedFrequency);
                done();
            })
            .catch((err: object) => { /* ERROR... */ });
    });

    it("The word 'hall' should be common. ", (done: MochaDone) => {
        apiService.requestWordInfo("hall")
            .then(() => {
                result = apiService.requestResult;
                words = wordRetriever.getWordsWithDefinitions(result);
                const isCommon: boolean = words[0].isCommon;
                const expectedValue: boolean = true;
                assert.equal(isCommon, expectedValue);
                done();
            })
            .catch((err: object) => { /* ERROR... */ });
    });

});

describe("Querry of the words 't?e' (3 letters starting with 't' amd finishing with 'e').", () => {
    const apiService: ExternalApiService = new ExternalApiService;
    const wordRetriever: WordRetriever = new WordRetriever;
    let result: JSON;
    let words: GridWordInformation[];

    it("The first word Request should be 'the'. ", (done: MochaDone) => {
        apiService.requestWordInfo("t?e")
            .then(() => {
                result = apiService.requestResult;
                const word: string = result[0].word;
                const expectedRequestedWord: string = "the";
                assert.equal(word, expectedRequestedWord);
                done();
            })
            .catch((err: object) => { /* ERROR... */ });
    });

    it("the first valid word should be 'tie'.  ", (done: mochaDone) => {
        apiService.requestWordInfo("t?e")
            .then(() => {
                result = apiService.requestResult;
                words = wordRetriever.getWordsWithDefinitions(result);
                const word: string = words[0].word;
                const expectedWord: string = "tie";
                assert.equal(word, expectedWord);
                done();
            })
            .catch((err: object) => { /* ERROR... */ });
    });

    it("Should have conserved only 5 words.", (done: mochaDone) => {
        apiService.requestWordInfo("t?e")
            .then(() => {
                result = apiService.requestResult;
                words = wordRetriever.getWordsWithDefinitions(result);
                const numberOfWords: number = words.length;
                const expectedLength: number = 5;
                assert.equal(numberOfWords, expectedLength);
                done();
            })
            .catch((err: object) => { /* ERROR... */ });
    });

    it("The word 'tee' should be uncommon.", (done: MochaDone) => {
        apiService.requestWordInfo("t?e")
            .then(() => {
                result = apiService.requestResult;
                words = wordRetriever.getWordsWithDefinitions(result);
                const teeIndex: number = 2;
                const isCommon: boolean = words[teeIndex].isCommon;
                const expectedValue: boolean = false;
                assert.equal(isCommon, expectedValue);
                done();
            })
            .catch((err: object) => { /* ERROR */ });
    });

});
