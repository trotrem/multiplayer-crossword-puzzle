import { Direction, IPoint } from "../../../../common/communication/types";
import { IGrid, IWordContainer, ICell } from "./dataStructures";
import { WordDictionaryData } from "../lexiconAPI/gridWordInformation";

export class WordsInventory {

    private currentCells: ICell[] = [];
    private wordCounter: number = 0;

    public createListOfWord(grid: IGrid): void {
        grid.words = new Array<IWordContainer>();

        this.createWordContainers(Direction.Horizontal, grid);
        this.createWordContainers(Direction.Vertical, grid);

        this.fillUnusedCells(grid);

        this.sortWordsByLength(grid);
    }

    private createWordContainers(direction: Direction, grid: IGrid): void {
        for (let i: number = 0; i < grid.cells.length; i++) {
            for (let j: number = 0; j < grid.cells[0].length; j++) {
                this.pushLetter(direction === Direction.Horizontal? {x: j, y: i}: {x: i, y: j}, direction, grid);
            }
            this.pushWord(direction, grid);
            this.currentCells = [];
        }
    }

    private pushLetter(position: IPoint, direction: Direction, grid: IGrid): void {
        const cell = grid.cells[position.x][position.y];
        if (!cell.isBlack) {
            cell.x = position.x;
            cell.y = position.y;
            this.currentCells.push(cell);
        } else {
            this.pushWord(direction, grid);
        }
    }

    private pushWord(direction: Direction, grid: IGrid): void {
        if (this.currentCells.length > 2) {
            this.wordCounter ++;
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

    private sortWordsByLength(grid: IGrid) {
        grid.words = grid.words.sort((word1: IWordContainer, word2: IWordContainer) => {
            const length1 = word1.gridSquares.length;
            const length2 = word2.gridSquares.length;
            if (length1 > length2) { return -1; } else return 1;
        });
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
