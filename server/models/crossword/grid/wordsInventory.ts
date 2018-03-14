import { Direction, IPoint } from "../../../../common/communication/types";
import { IGrid, IWordContainer, ICell } from "./dataStructures";
import { WordDictionaryData } from "../lexiconAPI/gridWordInformation";

export class WordsInventory {

    private currentCells: ICell[] = [];
    private wordCounter: number = 0;

    public createListOfWord(grid: IGrid): void {
        grid.words = new Array<IWordContainer>();
        // mot verticale
        for (let indexJ: number = 0; indexJ < grid.cells.length; indexJ++) {
            for (let indexI: number = 0; indexI < grid.cells[0].length; indexI++) {
                this.pushLetter({x: indexI, y: indexJ}, Direction.Horizontal, grid);
            }
            this.wordCounter++;
            this.pushWord(Direction.Horizontal, grid);
            this.currentCells = [];
        }
        this.wordCounter = 0;
        this.currentCells = [];
        // mot horizontale
        for (let indexI: number = 0; indexI < grid.cells.length; indexI++) {
            for (let indexJ: number = 0; indexJ < grid.cells[0].length; indexJ++) {
                this.pushLetter({x: indexI, y: indexJ}, Direction.Vertical, grid);
            }
            this.wordCounter++;
            this.pushWord(Direction.Vertical, grid);
            this.currentCells = [];
        }
        this.fillUnusedCells(grid);
        grid.words = grid.words.sort((word1: IWordContainer, word2: IWordContainer) => {
            const length1 = word1.gridSquares.length;
            const length2 = word2.gridSquares.length;
            if (length1 > length2) { return -1; } else return 1;
        });
    }

    private pushLetter(position: IPoint, direction: Direction, grid: IGrid): void {
        const cell = grid.cells[position.x][position.y];
        if (!cell.isBlack) {
            cell.x = position.x;
            cell.y = position.y;
            this.currentCells.push(cell);
        } else {
            this.wordCounter++;
            this.pushWord(direction, grid);
        }
    }

    private pushWord(direction: Direction, grid: IGrid): void {
        if (this.currentCells.length > 2) {
            grid.words.push({id: this.wordCounter, direction, gridSquares: this.currentCells});
            for (const cell of this.currentCells) {
                cell.letter = "?";
            }
        }
        this.currentCells = [];
    }

    private fillUnusedCells(grid: IGrid): void {
        for (const row of grid.cells) {
            for (const cell of row) {
                if (cell.letter !== "?") {
                    grid.blackCells.push({x: cell.x, y: cell.y});
                }
            }
        } 
    }

    public Text(word: IWordContainer, grid: IGrid): string {
        return word.gridSquares.map((pos: IPoint) => grid.cells[pos.x][pos.y].letter).join("");
    }
    public trySetData(data: WordDictionaryData, word: IWordContainer, grid: IGrid): boolean {
        if (this.trySetText(data.word, word, grid)) {
            word.data = data;
            return true;
        }

        return false;
    }
    private trySetText(text: string, word: IWordContainer, grid: IGrid): boolean {
        for (let i = 0; i < word.gridSquares.length; i++) {
            if (grid.cells[word.gridSquares[i].x][word.gridSquares[i].y].letter !== "?" && grid.cells[word.gridSquares[i].x][word.gridSquares[i].y].letter !== text[i]) {
                return false;
            }
        }
        this.setText(text, word, grid);

        return true;
    }
    public setData(data: WordDictionaryData, word: IWordContainer, grid: IGrid): void {
        word.data = data;
        this.setText(data.word, word, grid);
    }
    private setText(text: string, word: IWordContainer, grid: IGrid): void {
        for (let i = 0; i < word.gridSquares.length; i++) {
            grid.cells[word.gridSquares[i].x][word.gridSquares[i].y].letter = text[i];
        }
    }
}
