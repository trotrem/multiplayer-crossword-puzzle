// import { expect } from 'chai';
import { ExternalApiService } from "./externalApi.service";
import { GridWordInformation } from "./gridWordInformation";
import { WordRetriever } from "./wordRetriever"


const assert = require("assert");

/*it("I should complete this test", (done) => {
    asserdt.ok(true);
    done();
});*/

describe("Querry du mot hall", () => {
    let apiService: ExternalApiService = new ExternalApiService;
    let wordRetriever: WordRetriever = new WordRetriever;
    let expectedWord: string = "hall"
    let expectedSecondDefintion = "n\ta large room for gatherings or entertainment"

    it("Le mot devrait être 'hall'. ", (wordIsValid: any) => {
        apiService.requestWordInfo("hall")
            .then(() => {
                let result: JSON = apiService.requestResult;
                let words: GridWordInformation[] = wordRetriever.getWordsWithDefinitions(result);
                let word: string = words[0].getWord();
                assert.equal(word, expectedWord);
                wordIsValid();
            })
            .catch((err: object) => { console.log("ERREUR...") });
    });

    it("Query le mot hall, devrait avoir le mot 'hall'. ", (wordIsValid: any) => {

        apiService.requestWordInfo("hall")
            .then(() => {
                let result: JSON = apiService.requestResult;
                let words: GridWordInformation[] = wordRetriever.getWordsWithDefinitions(result);
                let secondDefinition: string = words[0].getDefinitions()[1];
                assert.equal(secondDefinition, expectedSecondDefintion);
                wordIsValid();
            })
            .catch((err: object) => { console.log("ERREUR...") });
    });
})



/*let bleh: ExternalApiService = new ExternalApiService;
let words: WordRetriever = new WordRetriever;
bleh.requestWordInfo("hall")
    .then(() => {
        let test = words.getWordsWithDefinitions(bleh.getRequestResult());
        console.log(test[0].getWord());

    })
    .catch((err: any) => { console.log("ERREUR..."); });*/
