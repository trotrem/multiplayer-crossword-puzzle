import * as requestOption from "request-promise-native";
import { GridWordInformation } from "./gridWordInformation";
import { UriOptions } from "request";
import { RequestPromiseOptions } from "request-promise";
// import { Options } from "request";

export class ExternalApiService {

    private requestResult: JSON;
    private wordsWithDefinitions: GridWordInformation[];

    constructor() {
        this.wordsWithDefinitions = new Array<GridWordInformation>();
    }

    public readonly options: (UriOptions & RequestPromiseOptions) = {
        method: "GET",
        uri: "http://api.datamuse.com/words",
        json: true,
        qs: {
            sp: "",
            md: "df",
        },
        simple: true,
    };

    public async requestWordInfo(word: string): Promise<void> { // Any == ?
        this.options.qs.sp = word;

        await requestOption(this.options)
            .then((result: JSON) => {
                this.requestResult = result;
                this.createWordListWithDefinitions();
                this.removeDefinitions();
            })
            .catch((err: object) => { /* Erreur */ }); // ANy
    }

    public getWordsWithDefinitions(): GridWordInformation[] {

        return this.wordsWithDefinitions;
    }

    private createWordListWithDefinitions(): void {

        for (const index in this.requestResult) {
            if (this.requestResult[index].hasOwnProperty("defs")) {
                const nonNumericalRemoval: number = 2;
                const tempFrequency: string = this.requestResult[index].tags[0].substring(nonNumericalRemoval);
                const tempWord: GridWordInformation = new GridWordInformation
                    (this.requestResult[index].word, this.requestResult[index].defs, parseFloat(tempFrequency));
                this.wordsWithDefinitions.push(tempWord);
            }
        }
    }

    private removeDefinitions(): void {

        for (let indexWord: number = 0; indexWord < this.wordsWithDefinitions.length; indexWord++) {
            for (let index: number = 0; index < this.wordsWithDefinitions[indexWord].getDefinitions().length; index++) {
                if (!(this.wordsWithDefinitions[indexWord].getDefinitions()[0].charAt(0) === "n")
                    && !(this.wordsWithDefinitions[indexWord].getDefinitions()[0].charAt(0) === "v")) {
                    this.wordsWithDefinitions[indexWord].getDefinitions().splice(index, 1);
                    index--; // next object is at same index as the one removed
                }
            }
            if (this.wordsWithDefinitions[indexWord].getDefinitions().length === 0) {
                this.wordsWithDefinitions.splice(indexWord, 1);
                indexWord--; // next object is at same index as the one removed
            }
        }
    }

}

/*let bleh: ExternalApiService = new ExternalApiService;
bleh.requestWordInfo("t?e")
    .then(() => {
        console.log(bleh.getWordsWithDefinitions()[0].getWord());
        console.log(bleh.getWordsWithDefinitions()[0].getDefinitions()[0]);
    })
    .catch((err: any) => { });*/
