import { Word, Direction } from "./word";
import { Grid } from "./grid";
import { GridWordInformation } from "../lexiconAPI/gridWordInformation";

export class WordsInventory {
    private _grid: Grid;
    private _listOfWord: Word[];
    constructor(grid: Grid) {
        this._grid = grid;
        this._listOfWord = new Array<Word>();
    }
    public get ListOfWord(): Word[] {
        return this._listOfWord;
    }
    private lengthCounter: number = 0;
    private wordCounter: number = 0;

    public createListOfWord(): void {
        // mot verticale
        for (let indexJ: number = 0; indexJ < this._grid.Width; indexJ++) {
            for (let indexI: number = 0; indexI < this._grid.Height; indexI++) {
                this.addWords(indexI, indexJ, Direction.X, indexI - this.lengthCounter);
            }
            this.wordCounter++;
            this.pushWord(this._grid.Height - this.lengthCounter, indexJ, Direction.X);
            this.lengthCounter = 0;
        }
        this.wordCounter = 0;
        this.lengthCounter = 0;
        // mot horizontale
        for (let indexI: number = 0; indexI < this._grid.Height; indexI++) {
            for (let indexJ: number = 0; indexJ < this._grid.Width; indexJ++) {
                this.addWords(indexI, indexJ, Direction.Y, indexJ - this.lengthCounter);
            }
            this.wordCounter++;
            this.pushWord(indexI, this._grid.Width - this.lengthCounter, Direction.Y);
            this.lengthCounter = 0;
        }
        this.fillWord();
        this.fillGrid();
    }

    private addWords(indexI: number, indexJ: number, direction: Direction, startingPos: number): void {
        if (!(this._grid.Grid[indexI][indexJ].getIsBlack())) {
            this.lengthCounter++;
        } else {
            this.wordCounter++;
            if (direction === Direction.X) {
                this.pushWord(startingPos, indexJ, direction);
            } else if (direction === Direction.Y) {
                this.pushWord(indexI, startingPos, direction);
            }
            this.lengthCounter = 0;
        }
    }

    private pushWord(indexI: number, indexJ: number, direction: Direction): void {
        if (this.lengthCounter > 1) {
            // console.log("new word " + indexI + ", " + indexJ + " Lentgh : " + this.lengthCounter);
            this._listOfWord.push(new Word(
                this.lengthCounter, this.wordCounter,
                new GridWordInformation(null, null, 0),
                indexI, indexJ, direction));
        }
    }

    private fillWord(): void {
        let word: Word;
        for (let i = 0; i < this._listOfWord.length; i++) {
            word = this._listOfWord[i];
            let wordFilled: string = "";
            for (let letter: number = 0; letter < word.Length; letter++) {
                wordFilled += "?";
            }
            word.GridWord.setWord(wordFilled);
        }
    }

    private fillGrid(): void {
        for (let squareI: number = 0; squareI < this._grid.Height; squareI++) {
            for (let squareJ: number = 0; squareJ < this._grid.Height; squareJ++) {
                if (!(this._grid.Grid[squareI][squareJ]._isBlack)) {
                    this._grid.Grid[squareI][squareJ].setLetter("?");
                }
            }
        }
    }
}
