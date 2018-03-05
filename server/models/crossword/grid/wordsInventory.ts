import { Word } from "./word";
import { Direction } from "../../../../common/communication/types";
import { Square } from "./square";

export class WordsInventory {
    private _listOfWord: Word[];
    constructor(private _grid: Square[][]) {
        this._listOfWord = new Array<Word>();
        this.createListOfWord();
    }
    public get Words(): Word[] {
        return this._listOfWord;
    }
    private currentCells: Square[] = [];
    private wordCounter: number = 0;

    private createListOfWord(): void {
        // mot verticale
        for (let indexJ: number = 0; indexJ < this._grid.length; indexJ++) {
            for (let indexI: number = 0; indexI < this._grid[0].length; indexI++) {
                this.pushLetter(indexI, indexJ, Direction.Horizontal);
            }
            this.wordCounter++;
            this.pushWord(Direction.Horizontal);
            this.currentCells = [];
        }
        this.wordCounter = 0;
        this.currentCells = [];
        // mot horizontale
        for (let indexI: number = 0; indexI < this._grid.length; indexI++) {
            for (let indexJ: number = 0; indexJ < this._grid[0].length; indexJ++) {
                this.pushLetter(indexI, indexJ, Direction.Vertical);
            }
            this.wordCounter++;
            this.pushWord(Direction.Vertical);
            this.currentCells = [];
        }
        this.fillUnusedCells();
        this._listOfWord = this.Words.sort((word1, word2) => {
            const length1 = word1.Length;
            const length2 = word2.Length;
            if (length1 > length2) { return -1; }
            if (length1 < length2) { return 1; }
            return 0;
        });
    }

    private pushLetter(indexI: number, indexJ: number, direction: Direction): void {
        const cell = this._grid[indexI][indexJ];
        if (!cell.isBlack) {
            cell.x = indexI;
            cell.y = indexJ;
            this.currentCells.push(cell);
        } else {
            this.wordCounter++;
            this.pushWord(direction);
        }
    }

    private pushWord(direction: Direction): void {
        if (this.currentCells.length > 2) {
            // console.log("new word " + indexI + ", " + indexJ + " Lentgh : " + this.lengthCounter);
            this._listOfWord.push(new Word(this.wordCounter, direction, this.currentCells));
            for (const cell of this.currentCells) {
                cell.letter = "?";
            }
        }
        this.currentCells = [];
    }

    private fillUnusedCells(): void {
        for (const row of this._grid) {
            for (const cell of row) {
                if (cell.letter !== "?") {
                    cell.isBlack = true;
                }
            }
        } 
    }
}
