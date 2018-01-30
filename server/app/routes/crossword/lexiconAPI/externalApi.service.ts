import * as http from 'http'
import { METHODS } from 'http';

export class ExternalApiService {

    // https://nodejs.org/api/http.html#http_http_request_options_callback
    private static readonly API : http.RequestOptions = {
        protocol : 'http',
        // host : default
        hostname : 'http://api.datamuse.com',
        // family default IP v4 et v6
        // port : 80 (default)
        // localAdress ?
        // socketPath : ...
        method : 'GET',
        // path : non utile
        // headers : ?
        // auth : pas besoin
        agent : false // crée un nouveau par défaut
        // createConnection : ...
        // timeout : ...
    };

    // https://basarat.gitbooks.io/typescript/docs/promise.html 
    requestInfo(requestOptions : http.RequestOptions) : Promise<any> {
        return new Promise((resolve, reject) => {
            // ...
            
           resolve('')
            
           reject()


        });
    }


   /* public getDefinitions(word : string) : Promise<string[]> {
        return this
    }*/

}