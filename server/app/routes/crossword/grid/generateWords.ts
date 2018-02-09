import { Words } from "./words";
import { Grid } from "./grid";
import { Word } from "./word";

export class GenerateWords {

    private _grid = new Grid();
    private _wordsList = new Words(this._grid);
    private _wordsListSorted = this._wordsList.ListOfWord.sort((word1, word2) => {
        const length1 = word1.Length;
        const length2 = word2.Length;
        if (length1 > length2) { return 1; }
        if (length1 < length2) { return -1; }
        return 0;
    });
    constructor() {

    }
    sortList(): void {

    }


}
