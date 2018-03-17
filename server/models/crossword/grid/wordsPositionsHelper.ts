import { Direction, IPoint } from "../../../../common/communication/types";
import { IGrid, IWordContainer, ICell } from "./dataStructures";

export class WordsPositionsHelper {
    public static createListOfWord(grid: IGrid): void {
        grid.words = new Array<IWordContainer>();

        this.createWordContainers(Direction.Horizontal, grid);
        this.createWordContainers(Direction.Vertical, grid);

        this.fillUnusedCells(grid);

        this.sortWordsByLength(grid);
    }

    private static createWordContainers(direction: Direction, grid: IGrid): void {
        let travelledCells: ICell[] = [];
        for (let i: number = 0; i < grid.cells.length; i++) {
            for (let j: number = 0; j < grid.cells[0].length; j++) {
                let newCell: ICell = this.visitPosition(direction === Direction.Horizontal? {x: j, y: i}: {x: i, y: j}, direction, grid);
                if(newCell !== null) {
                    travelledCells.push(newCell);
                } else {
                    this.pushWord(direction, grid, travelledCells);
                    travelledCells = [];
                }
            }
            this.pushWord(direction, grid, travelledCells);
            travelledCells = [];
        }
    }

    private static visitPosition(position: IPoint, direction: Direction, grid: IGrid): ICell {
        const cell = grid.cells[position.x][position.y];
        if (!cell.isBlack) {
            cell.x = position.x;
            cell.y = position.y;
            return cell;
        } 
        
        return null;
    }

    private static pushWord(direction: Direction, grid: IGrid, cells: ICell[]): void {
        if (cells.length > 2) {
            grid.words.push({id: grid.words.length, direction, gridSquares: cells});
            for (const cell of cells) {
                cell.letter = "?";
            }
        }
    }

    private static fillUnusedCells(grid: IGrid): void {
        for (const row of grid.cells) {
            for (const cell of row) {
                if (cell.letter !== "?") {
                    grid.blackCells.push({x: cell.x, y: cell.y});
                }
            }
        } 
    }

    private static sortWordsByLength(grid: IGrid) {
        grid.words = grid.words.sort((word1: IWordContainer, word2: IWordContainer) => {
            const length1 = word1.gridSquares.length;
            const length2 = word2.gridSquares.length;
            if (length1 > length2) { return -1; } else return 1;
        });
    }
}
