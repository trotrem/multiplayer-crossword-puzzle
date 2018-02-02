import * as requestOption from 'request-promise-native'


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

    public requestWordInfo(word: string) {
        this.options.qs.sp = word;
        return requestOption(this.options)
            .then((res: JSON) => {
                this.requestResult = res;
                console.log(res[0]);
            }/*, reject => {
                console.log('Reject');
            }*/)
            .catch((err: any) => { console.log('Erreur...') });
    }

    
    public async getWordsList(word: string) {
        await this.requestWordInfo(word);
        for (let i =0; i < /*nb element JSON*/; i++)
    }

    public async getWordDefinitions(word: string) {
        await this.requestWordInfo(word);
        if (/*trouver la fonction qui regarde si jai un tag defs...*/) {
            console.log('Aucune définition');
        }
        else
            console.log(this.requestResult[0].defs);

    }

    public async getWordFrequency(word: string) {
        await this.requestWordInfo(word);
        console.log(this.requestResult[0].frequency)
    }
}

//let bleh = new ExternalApiService;
//bleh.requestWordInfo("hall");

let bleh = new ExternalApiService;
//bleh.getWordDefinitions("hall");

bleh.requestWordInfo("the")
    .then((response) => {
        console.log(bleh.requestResult[0].defs[0]);
    });

//searchDefs()
