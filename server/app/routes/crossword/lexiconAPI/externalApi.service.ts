import * as requestOption from 'request-promise-native';
//import { GridWordInformation } from './gridWordInformation';

export class ExternalApiService {

    public requestResult: JSON;

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

                for (let index in this.requestResult) {
                    if (!this.requestResult[index].hasOwnProperty('defs')) {
                        delete this.requestResult[index];
                    }
                }

            }, reject => {
                console.log('Rejected, Error...');
            })
            .catch((err: any) => { console.log('Erreur...') });
    }
}

let bleh = new ExternalApiService;
bleh.requestWordInfo('t?e')
    .then(() => {
        console.log(bleh.requestResult[0]);
    })


