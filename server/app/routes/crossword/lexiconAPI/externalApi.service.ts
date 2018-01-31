import * as requestOption from 'request-promise-native'


export class ExternalApiService {

    public options = {
        method : 'GET',
        uri : 'http://api.datamuse.com/words',
        json : true,
        qs : {
            sp : 'h?ll',
            md :'df', 
        },
        simple : true
    };


public request() {
    requestOption(this.options)
        .then(function (res:any) {
            console.log(res[2].word);
        })
        .catch(function (err:any) {
            // API call failed...
        });
}

}


let bleh = new ExternalApiService;
bleh.request();
//searchDefs()
