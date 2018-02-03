import * as requestOption from 'request-promise-native';
import { GridWordInformation } from './gridWordInformation';

export class ExternalApiService {

    public requestResult: JSON;
    public wordsWithDefinitions: GridWordInformation[];
    public test: any;

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
                this.wordHasDefinition();
            }, reject => {
                console.log('Rejected, Error...');
            })
            .catch((err: any) => { console.log('Erreur...') });
    }

    public getWordWithDefinition(): GridWordInformation[] {

        return this.wordsWithDefinitions;
    }

    private wordHasDefinition(): void {
        for (let index in this.requestResult) {
            let indexDef: number = 0;
            if (this.requestResult[index].hasOwnProperty('defs')) {
               // let tempWord = new GridWordInformation(this.requestResult[index].word, this.requestResult[index].defs, 55)
                //this.test = tempWord;
                //this.wordsWithDefinitions[indexDef] = tempWord;
                console.log('test...');
                indexDef++;
            }
        }

    }
}

let bleh = new ExternalApiService;
bleh.requestWordInfo('t?e')
    .then(() => {
        console.log(bleh.requestResult[0].frequency)
        // console.log(bleh.wordsWithDefinitions[0].getWord());
    })
    .catch((err: any) => { console.log('allo') });


