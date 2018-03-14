import * as requestOption from "request-promise-native";
import { UriOptions } from "request";
import { RequestPromiseOptions } from "request-promise";

export class ExternalApiService {

    private options: (UriOptions & RequestPromiseOptions) = {
        method: "GET",
        uri: "http://api.datamuse.com/words",
        json: true,
        qs: {
            sp: "",
            md: "df",
            max: 1000,
        },
        simple: true,
    };

    public async requestWordInfo(word: string): Promise<JSON> {
        this.options.qs.sp = word;

        return requestOption(this.options)
            .catch((err: Error) => {
                console.error(err);
                // do something
            });
    }
}
