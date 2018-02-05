// import { expect } from 'chai';
import { ExternalApiService } from "./externalApi.service";
import { GridWordInformation } from "./gridWordInformation";
import { WordRetriever } from "./wordRetriever"


const assert = require("assert");

/*it("I should complete this test", (done) => {
    asserdt.ok(true);
    done();
});*/


it("Query le mot hall, devrait avoir le mot, les definitions, la frequence et s'il est commun ou non", (done: any) => {
    let apiService: ExternalApiService = new ExternalApiService;
    let wordRetriever: WordRetriever = new WordRetriever;
    let expectedWord: string = "hall"
    
    apiService.requestWordInfo("hall")
        .then(() => {
            let result: JSON = apiService.getRequestResult();
            let words: GridWordInformation[] = wordRetriever.getWordsWithDefinitions(result);
            let word: string = words[0].getWord();
            assert.equal(word, expectedWord);
            done();
        })
        .catch((err: object) => { console.log("ERREUR...") });
});


/*let bleh: ExternalApiService = new ExternalApiService;
let words: WordRetriever = new WordRetriever;
bleh.requestWordInfo("hall")
    .then(() => {
        let test = words.getWordsWithDefinitions(bleh.getRequestResult());
        console.log(test[0].getWord());

    })
    .catch((err: any) => { console.log("ERREUR..."); });*/
