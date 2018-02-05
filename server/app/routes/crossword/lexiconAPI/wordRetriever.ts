import { ExternalApiService } from "./externalApi.service";
import { GridWordInformation } from "./gridWordInformation";

export class WordRetriever {

    public wordsWithDefinitions: GridWordInformation[];

    constructor() {
        this.wordsWithDefinitions = [];
    }

    public getWordsWithDefinitions(words: JSON): GridWordInformation[] {
        this.createWordListWithDefinitions(words);
        return this.wordsWithDefinitions;
    }

    private createWordListWithDefinitions(words: JSON): void {
        for (const index in words) {
            if (words[index].hasOwnProperty("defs")) {
                const nonNumericalRemoval: number = 2; // Format d'un tag : f:xxxx
                const tempFrequency: string = words[index].tags[0].substring(nonNumericalRemoval);
                const tempWord: GridWordInformation = new GridWordInformation
                    (words[index].word, words[index].defs, parseFloat(tempFrequency));
                this.wordsWithDefinitions.push(tempWord);
            }
        }
        this.removeDefinitions();
    }

    private removeDefinitions(): void {
        for (let indexWord: number = 0; indexWord < this.wordsWithDefinitions.length; indexWord++) {
            for (let index: number = 0; index < this.wordsWithDefinitions[indexWord].getDefinitions().length; index++) {
                const isNoun: boolean = this.wordsWithDefinitions[indexWord].getDefinitions()[0].charAt(0) === "n";
                const isVerb: boolean = this.wordsWithDefinitions[indexWord].getDefinitions()[0].charAt(0) === "v";
                if (!(isNoun) && !(isVerb)) {
                    this.wordsWithDefinitions[indexWord].getDefinitions().splice(index, 1);
                    index--; // next object is at same index as the one removed
                }
            }
            if (this.wordsWithDefinitions[indexWord].getDefinitions() === undefined
                || this.wordsWithDefinitions[indexWord].getDefinitions().length === 0) {
                this.wordsWithDefinitions.splice(indexWord, 1);
                indexWord--; // next object is at same index as the one removed
            }
        }
    }

}

/*let bleh: ExternalApiService = new ExternalApiService;
let words: WordRetriever = new WordRetriever;
bleh.requestWordInfo("hall")
    .then(() => {
        let test = words.getWordsWithDefinitions(bleh.requestResult);
        console.log(test[0].getWord());

    })
    .catch((err: any) => { console.log("ERREUR..."); });*/