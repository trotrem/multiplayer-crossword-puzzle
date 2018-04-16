import { IGrid, ICell } from "./dataStructures";
import { Utils } from "../../../utils";
import { IPoint } from "../../../../../common/communication/types";

const WIDTH: number = 10;
const HEIGHT: number = 10;
export const MINBLACK: number = 30;
export const MAXBLACK: number = 32;
const SPACEBTWCELLS: number = 2;

export class GridLayoutHandler {

    private static findAcceptableBlackSquare(blackSquares: IPoint[]): IPoint {
        const x: number = Utils.randomIntFromInterval(0, WIDTH - 1);
        const y: number = Utils.randomIntFromInterval(0, HEIGHT - 1);

        for (const black of blackSquares) {
            if (this.notBlackSquares(black).find((p: IPoint) => p.x === x && p.y === y) !== undefined || (black.x === x && black.y === y)) {
                return this.findAcceptableBlackSquare(blackSquares);
            }
        }

        return {x, y};
    }

    private static generateBlackSquares(grid: IGrid): void {
        const blackSquares: IPoint[] = new Array<IPoint>();

        const nbBlacks: number = Utils.randomIntFromInterval(MINBLACK, MAXBLACK);
        for (let i: number = 0; i < nbBlacks; i++) {
            const newBlackCell: IPoint = this.findAcceptableBlackSquare(blackSquares);
            blackSquares.push(newBlackCell);
            grid.cells[newBlackCell.x][newBlackCell.y].isBlack = true;
        }

        grid.blackCells = blackSquares;
    }

    private static notBlackSquares(currentBlack: IPoint): IPoint[] {
        return [{x: currentBlack.x - SPACEBTWCELLS, y: currentBlack.y},
                {x: currentBlack.x + SPACEBTWCELLS, y: currentBlack.y},
                {x: currentBlack.x, y: currentBlack.y - SPACEBTWCELLS},
                {x: currentBlack.x, y: currentBlack.y + SPACEBTWCELLS}];
    }

    private static makeEmptyGrid(grid: IGrid): void {
        grid.cells = new Array<Array<ICell>>();
        for (let indexI: number = 0; indexI < WIDTH; indexI++) {
            const row: ICell[] = new Array<ICell>();
            for (let indexJ: number = 0; indexJ < HEIGHT; indexJ++) {
                row.push({isBlack: false, letter: "", x: indexI, y: indexJ});
            }
            grid.cells.push(row);
        }
    }

    public static makeGrid(grid: IGrid): void {
        this.makeEmptyGrid(grid);
        this.generateBlackSquares(grid);
    }
}
