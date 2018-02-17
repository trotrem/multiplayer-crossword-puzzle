import { Word } from "./word";
import { Grid } from "./grid";
import { Direction } from "./word"
import { GridWordInformation } from "../lexiconAPI/gridWordInformation";

export class Words {
    private _grid: Grid;
    private _listOfWord: Word[];
    //private listOfWordH: Word[];
    //private _lengthOfV: number;
    //private _lengthOfH: number;
    constructor(grid: Grid) {
        this._grid = grid;
    }
    public get ListOfWord(): Word[] {
        return this._listOfWord;
    }
    /*public get ListOfWordH(): Word[] {
        return this.listOfWordH;
    }*/
    /*public get LengthOfV(): number {
        return this._lengthOfV;
    }
    public get LengthOfH(): number {
        return this._lengthOfH;
    }*/
    public createListOfWord(): void {
        let lengthCounter: number = 0;
        let wordCounter: number = 0;
        //test
        let wordSetter: string = null;
        let gridWordSetter: GridWordInformation;
        // compteur mot verticale
        for (let indexJ: number = 0; indexJ < this._grid.Height; indexJ++) {
            for (let indexI: number = 0; indexI < this._grid.Width; indexI++) {
                if (!(this._grid[indexI][indexJ].getIsBlack)) {
                    lengthCounter++;
                } else {
                    wordCounter++;
                    //test
                    gridWordSetter = new GridWordInformation(wordSetter,null,0);
                    this._listOfWord.push(new Word(lengthCounter, wordCounter, gridWordSetter, indexI - lengthCounter, indexJ, Direction.Y));
                    lengthCounter = 0;
                    wordSetter = null;
                }
            }
            wordCounter++;
            this._listOfWord.push(new Word(lengthCounter, wordCounter, null, this._grid.Height - lengthCounter, indexJ, Direction.Y));
            lengthCounter = 0;
        }
        wordCounter = 0;
        lengthCounter = 0;
        // compteur mot horizontale
        for (let indexI: number = 0; indexI < this._grid.Width; indexI++) {
            for (let indexJ: number = 0; indexJ < this._grid.Height; indexJ++) {
                if (!(this._grid[indexI][indexJ].getIsBlack)) {
                    lengthCounter++;
                    wordSetter += this._grid.Grid[indexI][indexJ].getLetter();
                } else {
                    wordCounter++;
                    this._listOfWord.push(new Word(lengthCounter, wordCounter, null, indexI, indexJ - lengthCounter, Direction.X));
                    lengthCounter = 0;
                }
            }
            wordCounter++;
            this._listOfWord.push(new Word(lengthCounter, wordCounter, null, indexI, this._grid.Width - lengthCounter, Direction.X));
            lengthCounter = 0;
        }
        this.fillWord();
    }
    private fillWord(): void {
        for (let word of this._listOfWord) {
            let wordFilled: string;
            for (let letter = 0; letter < word.Length; letter++) {
                wordFilled += "?";
            }
            word.Word.setWord(wordFilled);
        }
    }

    //idée ** 
    /* private fillGrid(): void {
        for (let squareI = 0; squareI < this._grid.Height; squareI++) {
            for (let squareJ = 0; squareJ < this._grid.Height; squareJ++) {
                if (!(this._grid.Grid[squareI][squareJ]._isBlack)) {
                    this._grid.Grid[squareI][squareJ].setLetter("?");
                }
            }
        }
    } */
}
