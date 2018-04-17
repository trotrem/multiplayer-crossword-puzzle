import { Direction, IPoint } from "../../../../../common/communication/types";
import { IGrid, IWordContainer, ICell } from "../../dataStructures";

const MINIMUM_WORD_LENGTH: number = 2;
const UNDEFINED_LETTER: string = "?";

export class WordsPositionsHelper {
    public static createListOfWord(grid: IGrid): void {
        grid.words = new Array<IWordContainer>();

        this.createWordContainers(Direction.Horizontal, grid);
        this.createWordContainers(Direction.Vertical, grid);

        this.makeUnusedCellsBlack(grid);

        this.sortWordsByLength(grid.words);
    }

    private static createWordContainers(direction: Direction, grid: IGrid): void {
        let travelledCells: ICell[] = [];
        for (let i: number = 0; i < grid.cells.length; i++) {
            for (let j: number = 0; j < grid.cells[0].length; j++) {
                const newCell: ICell = this.visitPosition(
                    direction === Direction.Horizontal ? { x: j, y: i } : { x: i, y: j },
                    direction,
                    grid
                );
                if (newCell !== null) {
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
        const cell: ICell = grid.cells[position.x][position.y];
        if (!cell.isBlack) {
            cell.x = position.x;
            cell.y = position.y;

            return cell;
        }

        return null;
    }

    private static pushWord(direction: Direction, grid: IGrid, cells: ICell[]): void {
        if (cells.length > MINIMUM_WORD_LENGTH) {
            grid.words.push({ id: grid.words.length, direction, gridSquares: cells });
            for (const cell of cells) {
                cell.letter = UNDEFINED_LETTER;
            }
        }
    }

    private static makeUnusedCellsBlack(grid: IGrid): void {
        for (const row of grid.cells) {
            for (const cell of row) {
                if (cell.letter !== UNDEFINED_LETTER) {
                    grid.blackCells.push({ x: cell.x, y: cell.y });
                }
            }
        }
    }

    private static sortWordsByLength(words: IWordContainer[]): void {
        words = words.sort(
            (word1: IWordContainer, word2: IWordContainer) => {
                if (word1.gridSquares.length > word2.gridSquares.length) {
                    return -1;
                } else {
                    return 1;
                }
            }
        );
    }
}
