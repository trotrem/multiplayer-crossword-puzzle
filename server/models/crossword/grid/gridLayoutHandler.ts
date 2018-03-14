import { IGrid, ICell } from "./dataStructures";

const WIDTH: number = 10;
const HEIGHT: number = 10;
const MINBLACK: number = 29;
const MAXBLACK: number = 29;
const MINCELLS: number = 0;
const MAXCELLS: number = 99;
const SPACEBTWCELLS: number = 2;
// Les cases qui ne peuvent pas etre noires forment un carré de 8x8, pour eviter d'avoir un mot d'une lettre
/*const NOTBLACKSQUARES: number[]; /*= [1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 10, 12, 13, 14, 15, 16, 17, 18,
    19, 8, 28, 38, 48, 58, 68, 78, 88, 98, 80, 82, 83, 84, 85, 86, 87, 89];*/

export class GridLayoutHandler {

    private _blackSquares: number[];
    private _notBlackSquares: number[];
    private _nbrBlack: number;

    private randomIntFromInterval(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    private findAcceptableBlackSquare(): number {
        const black: number = this.randomIntFromInterval(MINCELLS, MAXCELLS);

        if (this._notBlackSquares.indexOf(black) !== -1 || this._blackSquares.indexOf(black) !== -1) {
            return this.findAcceptableBlackSquare();
        }

        return black;
    }

    private generateBlackSquare(): void {
        this._blackSquares = new Array<number>();
        this._notBlackSquares = new Array<number>();
        this._nbrBlack = this.randomIntFromInterval(MINBLACK, MAXBLACK);

        for (let indexBlack: number = 0; indexBlack < this._nbrBlack; indexBlack++) {
            const currentBlack: number = this.findAcceptableBlackSquare();
            this.notBlackSquares(currentBlack);
            this._blackSquares[indexBlack] = currentBlack;
        }
    }
    private notBlackSquares(currentBlack: number): void {
        if ((currentBlack % WIDTH) > 1) {
            this._notBlackSquares.push(currentBlack - SPACEBTWCELLS);
        }
        if ((currentBlack % WIDTH) < WIDTH - SPACEBTWCELLS) {
            this._notBlackSquares.push(currentBlack + SPACEBTWCELLS);
        }
        if (currentBlack > HEIGHT * SPACEBTWCELLS) {
            this._notBlackSquares.push(currentBlack - (SPACEBTWCELLS * HEIGHT));
        }
        if ((currentBlack < (HEIGHT - SPACEBTWCELLS) * (SPACEBTWCELLS * HEIGHT))) {
            this._notBlackSquares.push(currentBlack + (SPACEBTWCELLS * HEIGHT));
        }
    }

    private makeEmptyGrid(grid: IGrid): void {
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

    public makeGrid(grid: IGrid): void {
        this.makeEmptyGrid(grid);
        // making an empty grid
        this.generateBlackSquare();
        // putting black square in the grid
        for (let index = 0; index < this._blackSquares.length; index++) {
            const indexTemp: number = this._blackSquares[index];
            const indexITemp: number = indexTemp % HEIGHT;
            const indexJTemp: number = Math.floor(indexTemp / HEIGHT);
            grid.cells[indexITemp][indexJTemp].isBlack = true;
            grid.blackCells.push({x: indexITemp, y: indexJTemp});
        }
    }
}
