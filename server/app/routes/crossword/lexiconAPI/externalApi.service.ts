import * as requestOption from "request-promise-native";
import { UriOptions } from "request";
import { RequestPromiseOptions } from "request-promise";

export class ExternalApiService {
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

    public async requestWordInfo(word: string): Promise<JSON> {
        this.options.qs.sp = word;

        return await requestOption(this.options)
            .catch((err) => {
                console.error(err);
                //do something
            });
    }

    /*public async requestWordInfo(word: string): Promise<void> {
        this.options.qs.sp = word;

        return requestOption(this.options)
            .then((result: JSON) => {
                this._requestResult = result;

            })
            .catch((err: object) => {
                console.error(err);
                // Do something
                /* Erreur  });
    }*/

    /*public get requestResult(): JSON {
        return this._requestResult;
    }*/

}

/*  public async requestWordInfo(word: string): Promise<JSON> {
        this.options.qs.sp = word;

        return await requestOption(this.options).catch((err) => {
            console.error(err);
            //do something
            /* Erreur });;
        }

        public get requestResult(): JSON {
            return this._requestResult;
        }*/
