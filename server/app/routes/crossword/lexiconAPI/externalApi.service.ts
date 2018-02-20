import * as requestOption from "request-promise-native";
import { UriOptions } from "request";
import { RequestPromiseOptions } from "request-promise";

export class ExternalApiService {

    private static _instance: ExternalApiService;

    private constructor() { }

    public static get instance(): ExternalApiService {
        return ((this._instance) || (this._instance = new this()));
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
            .catch((err: Error) => {
                console.error(err);
                // do something
            });
    }
}
