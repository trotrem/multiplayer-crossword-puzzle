import { Word } from "./word";
import { Grid } from "./grid";

export class Words {
    private _grid: Grid;
    private _listOfWordV: Word[];
    private listOfWordH: Word[];
    private _lengthOfV: number;
    private _lengthOfH: number;
    constructor(grid: Grid) {
        this._grid = grid;
    }
    public get ListOfWordV(): Word[] {
        return this._listOfWordV;
    }
    public get ListOfWordH(): Word[] {
        return this.listOfWordH;
    }
    public get LengthOfV(): number {
        return this._lengthOfV;
    }
    public get LengthOfH(): number {
        return this._lengthOfH;
    }
    public createListOfWord(): void {
        let lengthCounter: number = 0;
        let wordCounter: number = 0;
        // compteur mot verticale
        for (let indexJ: number = 0; indexJ < this._grid.Height; indexJ++) {
            for (let indexI: number = 0; indexI < this._grid.Width; indexI++) {
                if (!(this._grid[indexI][indexJ].getIsBlack)) {
                    lengthCounter++;
                } else {
                    wordCounter++;
                    this._listOfWordV.push(new Word(lengthCounter, wordCounter, null));
                    lengthCounter = 0;
                }
            }
            wordCounter++;
            this._listOfWordV.push(new Word(lengthCounter, wordCounter, null));
            lengthCounter = 0;
        }
        this._lengthOfV = wordCounter;
        wordCounter = 0;
        lengthCounter = 0;
        // compteur mot horizontale
        for (let indexI: number = 0; indexI < this._grid.Width; indexI++) {
            for (let indexJ: number = 0; indexJ < this._grid.Height; indexJ++) {
                if (!(this._grid[indexI][indexJ].getIsBlack)) {
                    lengthCounter++;
                } else {
                    wordCounter++;
                    this.listOfWordH.push(new Word(lengthCounter, wordCounter, null));
                    lengthCounter = 0;
                }
            }
            wordCounter++;
            this._listOfWordV.push(new Word(lengthCounter, wordCounter, null));
            lengthCounter = 0;
        }
        this._lengthOfH = wordCounter;

    }
}
