import * as requestOption from 'request-promise-native';
import { GridWordInformation } from './gridWordInformation';

export class ExternalApiService {

    public requestResult: JSON;
    public wordsWithDefinitions: GridWordInformation[];
    public test: any;

    constructor() { 
        this.wordsWithDefinitions = new Array<GridWordInformation>();
    }

    public options = {
        method: 'GET',
        uri: 'http://api.datamuse.com/words',
        json: true,
        qs: {
            sp: "",
            md: 'df',
        },
        simple: true,
    };

    public requestWordInfo(word: string): Promise<any> {
        this.options.qs.sp = word;
        return requestOption(this.options)
            .then((result: JSON) => {
                this.requestResult = result;
                this.removeWordWithoutDefinitions();
            }, reject => {
                console.log('Rejected, Error...');
            })
            .catch((err: any) => { console.log('Erreur...') });
    }

    public getWordsWithDefinitions(): GridWordInformation[] {

        return this.wordsWithDefinitions;
    }

    private removeWordWithoutDefinitions(): void {
        for (let index in this.requestResult) {
            if (this.requestResult[index].hasOwnProperty('defs')) {
                let tempFrequency : string = this.requestResult[index].tags[0].substring(2);
                let tempWord = new GridWordInformation(this.requestResult[index].word, this.requestResult[index].defs, parseFloat(tempFrequency))
                //console.log(tempWord.getDefinitions()[0]);
                //this.test = tempWord;
                this.wordsWithDefinitions.push(tempWord);
                //console.log('test...');
            }
        }

    }
}

let bleh = new ExternalApiService;
bleh.requestWordInfo('t?e')
    .then(() => {
        //console.log(bleh.requestResult[0].tags[0])
        console.log(bleh.wordsWithDefinitions[0].getFrequency());
    })
    .catch((err: any) => { console.log('allo') });


