import * as requestOption from "request-promise-native";
import { UriOptions } from "request";
import { RequestPromiseOptions } from "request-promise";


export class ExternalApiService {

    public requestResult: JSON;

    constructor() {
    }

    private options: (UriOptions & RequestPromiseOptions) = {
        method: "GET",
        uri: "http://api.datamuse.com/words",
        json: true,
        qs: {
            sp: "",
            md: "df",
        },
        simple: true,
    };

    public async requestWordInfo(word: string): Promise<void> {
        this.options.qs.sp = word;

        return requestOption(this.options)
            .then((result: JSON) => {
                this.requestResult = result;

            })
            .catch((err: object) => { /* Erreur */ });
    }

    public getRequestResult(): JSON {
        return this.requestResult;
    }

}
