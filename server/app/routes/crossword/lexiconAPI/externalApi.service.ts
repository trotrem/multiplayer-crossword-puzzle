import * as http from 'http'
import { METHODS } from 'http';

export class ExternalApiService {

    // https://nodejs.org/api/http.html#http_http_request_options_callback
    private static readonly API: http.RequestOptions = {
        protocol: 'http',
        // host : default
        hostname: 'http://api.datamuse.com',
        // family default IP v4 et v6
        // port : 80 (default)
        // localAdress ?
        // socketPath : ...
        method: 'GET',
        // path : non utile
        // headers : ?
        // auth : pas besoin
        agent: false // crée un nouveau par défaut
        // createConnection : ...
        // timeout : ...
    };

    // https://basarat.gitbooks.io/typescript/docs/promise.html 
    requestInfo(requestOptionsPath: http.RequestOptions): Promise<any> {
        return new Promise((resolve, reject) => {
            // Request avec le path
            const PATH_API: http.RequestOptions = {
                ...ExternalApiService.API,
                ...requestOptionsPath
            };
            // https://nodejs.org/api/http.html#http_class_http_incomingmessage
            const request = http.request(PATH_API);
            request.on('response', (result: http.IncomingMessage) => {
                let resp = '';
                result.on('data', (chunk: string) => resp += chunk);
                result.on('end', () => resolve(resp));
                result.on('error', reject);
            }).on('error', reject);
            request.end();

        });
    }




    public getDefinitions(word: string): Promise<string[]> {
        return this.requestInfo({
            path: `/words?sp=${word}&md=d&max=1`
        }).then(resp) => {
            const DEFINITION = JSON.parse(resp);
        }
    }

}