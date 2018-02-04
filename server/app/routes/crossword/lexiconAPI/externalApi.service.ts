import * as requestOption from "request-promise-native";
import { GridWordInformation } from "./gridWordInformation";
// import { Options } from "request";

export class ExternalApiService {

    private requestResult: JSON;
    private wordsWithDefinitions: GridWordInformation[];

    constructor() {
        this.wordsWithDefinitions = new Array<GridWordInformation>();
    }

    public options: any = {
        method: "GET",
        uri: "http://api.datamuse.com/words",
        json: true,
        qs: {
            sp: "",
            md: "df",
        },
        simple: true,
    };

    public async requestWordInfo(word: string): Promise<any> {
        this.options.qs.sp = word;

        return requestOption(this.options)
            .then((result: JSON) => {
                this.requestResult = result;
                this.removeWordsWithoutDefinitions();
            },(reject: any) => {
                // console.log("Rejected, Error...");
            })
            .catch((err: any) => { console.log("Erreur...") });
    }

    public getWordsWithDefinitions(): GridWordInformation[] {

        return this.wordsWithDefinitions;
    }

    private removeWordsWithoutDefinitions(): void {
        for (let index in this.requestResult) {
            let wordHasDefinitions: boolean = this.requestResult[index].hasOwnProperty("defs")
            if (wordHasDefinitions) {
                let tempFrequency: string = this.requestResult[index].tags[0].substring(2);
                let tempWord: GridWordInformation = new GridWordInformation
                    (this.requestResult[index].word, this.requestResult[index].defs, parseFloat(tempFrequency));
                this.wordsWithDefinitions.push(tempWord);
            }
        }
    }
}
