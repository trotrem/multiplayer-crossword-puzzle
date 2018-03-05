import { Word } from "./word";
import { Grid } from "./grid";
import { GridWordInformation } from "../lexiconAPI/gridWordInformation";
import { Direction } from "../../../../common/communication/types";

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
                this.addWords(indexI, indexJ, Direction.Horizontal, indexI - this.lengthCounter);
            }
            this.wordCounter++;
            this.pushWord(this._grid.Height - this.lengthCounter, indexJ, Direction.Horizontal);
            this.lengthCounter = 0;
        }
        this.wordCounter = 0;
        this.lengthCounter = 0;
        // mot horizontale
        for (let indexI: number = 0; indexI < this._grid.Height; indexI++) {
            for (let indexJ: number = 0; indexJ < this._grid.Width; indexJ++) {
                this.addWords(indexI, indexJ, Direction.Vertical, indexJ - this.lengthCounter);
            }
            this.wordCounter++;
            this.pushWord(indexI, this._grid.Width - this.lengthCounter, Direction.Vertical);
            this.lengthCounter = 0;
        }
        this.fillWord();
        this.fillUnusedCells();
    }

    private addWords(indexI: number, indexJ: number, direction: Direction, startingPos: number): void {
        if (!(this._grid.Grid[indexI][indexJ].isBlack)) {
            this.lengthCounter++;
        } else {
            this.wordCounter++;
            if (direction === Direction.Horizontal) {
                this.pushWord(startingPos, indexJ, direction);
            } else if (direction === Direction.Vertical) {
                this.pushWord(indexI, startingPos, direction);
            }
            this.lengthCounter = 0;
        }
    }

    private pushWord(indexI: number, indexJ: number, direction: Direction): void {
        if (this.lengthCounter > 2) {
            // console.log("new word " + indexI + ", " + indexJ + " Lentgh : " + this.lengthCounter);
            this._listOfWord.push(new Word(
                this.lengthCounter, this.wordCounter,
                new GridWordInformation(null, null, 0),
                indexI, indexJ, direction));
        }
    }

    private fillWord(): void {
        for (const word of this._listOfWord) {
            let wordFilled: string = "";
            for (let letter: number = 0; letter < word.Length; letter++) {
                wordFilled += "?";
            }
            word.GridWord.setWord(wordFilled);
        }
    }

    private fillUnusedCells(): void {
        for (const word of this._listOfWord) {
            for (let i = 0; i < word.Length; i++) {
                const cell = word.getCellFromDistance(i);
                this._grid.Grid[cell.x][cell.y].isUsed = true;
            }
        }
        for (const row of this._grid.Grid) {
            for (const cell of row) {
                if (!cell.isUsed) {
                    cell.isBlack = true;
                }
            }
        } 
    }
}
