import { IGrid, ICell } from "./dataStructures";
import { Utils } from "../../../utils";
import { IPoint } from "../../../../common/communication/types";

const WIDTH: number = 10;
const HEIGHT: number = 10;
const MINBLACK: number = 34;
const MAXBLACK: number = 34;
const SPACEBTWCELLS: number = 2;

export class GridLayoutHandler {

    private static findAcceptableBlackSquare(blackSquares: IPoint[]): IPoint {
        const x: number = Utils.randomIntFromInterval(0, WIDTH - 1);
        const y: number = Utils.randomIntFromInterval(0, HEIGHT - 1);

        for (const black of blackSquares) {
            if (this.notBlackSquares(black).indexOf({x, y}) !== -1 || black === {x, y}) {
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
        const notBlackSquares: IPoint[] = [];
        notBlackSquares.push({x: currentBlack.x - SPACEBTWCELLS, y: currentBlack.y});
        notBlackSquares.push({x: currentBlack.x + SPACEBTWCELLS, y: currentBlack.y});
        notBlackSquares.push({x: currentBlack.x, y: currentBlack.y - SPACEBTWCELLS});
        notBlackSquares.push({x: currentBlack.x, y: currentBlack.y + SPACEBTWCELLS});

        return notBlackSquares;
    }

    private static makeEmptyGrid(grid: IGrid): void {
        grid.cells = new Array<Array<ICell>>();
        grid.blackCells = new Array<ICell>();
        for (let indexI: number = 0; indexI < WIDTH; indexI++) {
            const row: ICell[] = new Array<ICell>();
            for (let indexJ: number = 0; indexJ < HEIGHT; indexJ++) {
                row.push({id: indexI * HEIGHT + indexJ, isBlack: false, letter: "", x: indexI, y: indexJ});
            }
            grid.cells.push(row);
        }
    }

    public static makeGrid(grid: IGrid): void {
        // making an empty grid
        this.makeEmptyGrid(grid);
        // putting black square in the grid
        this.generateBlackSquares(grid);
    }
}
