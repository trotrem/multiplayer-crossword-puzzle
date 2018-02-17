// import * as requestOption from "request-promise-native";
// import { ExternalApiService } from "../lexiconAPI/externalApi.service";
// import { GridWordInformation } from "../lexiconAPI/gridWordInformation";
import { Square } from "./square";

const WIDTH = 10;
const HEIGHT = 10;
const MINBLACK = 11;
const MAXBLACK = 15;
const MINCASES = 0;
const MAXCASES = 99;
// Les cases qui ne peuvent pas etre noires forment un carré de 8x8, pour eviter d'avoir un mot d'une lettre
const NOTBLACKSQUARES: number[] = [1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 10, 12, 13, 14, 15, 16, 17, 18,
                                   19, 8, 28, 38, 48, 58, 68, 78, 88, 98, 80, 82, 83, 84, 85, 86, 87, 89];

export class Grid {

    private _grid: Square[][];
    private _blackSquares: number[];
    private _notBlackSquares: number[] = NOTBLACKSQUARES;
    private _nbrBlack: number;

    constructor() {
        this._grid = new Array<Array<Square>>();
    }

    public get Height(): number {
        return HEIGHT;
    }
    public get Width(): number {
        return WIDTH;
    }
    public get Grid(): Square[][] {
        return this._grid;
    }
    public get BlackSquares() {
        const blacks: any[] = [];
        this._grid.forEach((row, x) => {
            row.forEach((cell, y) => {
                if (cell.getIsBlack()) {
                    blacks.push({x, y});
                }
            });
        });

        return blacks;
    }
    public getSquareIsBlack(i: number, j: number): boolean {
        return this._grid[i][j].getIsBlack();
    }
    public get NbrBlack(): number {
        return this._nbrBlack;
    }
    private randomIntFromInterval(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    private findAcceptableBlackSquare(): number {
        const black: number = this.randomIntFromInterval(MINCASES, MAXCASES);

        if (this._notBlackSquares.indexOf(black) !== -1 || this._blackSquares.indexOf(black) !== -1) {
            return this.findAcceptableBlackSquare();
        }
        return black;
    }

    private generateBlackSquare(): void {
        this._blackSquares = new Array<number>();
        this._nbrBlack = this.randomIntFromInterval(MINBLACK, MAXBLACK);
        for (let indexBlack = 0; indexBlack < this._nbrBlack; indexBlack++) {
            const currentBlack = this.findAcceptableBlackSquare();

            if (currentBlack % WIDTH > 0) {
                this._notBlackSquares.push(currentBlack - 1);
            }
            if (currentBlack % WIDTH < WIDTH - 1) {
                this._notBlackSquares.push(currentBlack + 1);
            }
            if (currentBlack > HEIGHT - 1) {
                this._notBlackSquares.push(currentBlack + 10);
            }
            if (currentBlack < (HEIGHT - 1) * HEIGHT) {
                this._notBlackSquares.push(currentBlack - 10);
            }
            this._notBlackSquares.push(currentBlack - 2);
            this._notBlackSquares.push(currentBlack + 2);
            this._notBlackSquares.push(currentBlack - 20);
            this._notBlackSquares.push(currentBlack + 20);

            this._blackSquares[indexBlack] = currentBlack;
        }
    }

    public makeGrid(): void {
        // making an empty grid
        for (let indexI = 0; indexI < WIDTH; indexI++) {
            const row: Square[] = new Array();
            for (let indexJ = 0; indexJ < HEIGHT; indexJ++) {
                row.push(new Square(indexI * HEIGHT + indexJ, false, null));
            }
            this._grid.push(row);
        }
        this.generateBlackSquare();
        // putting black square in the grid
        for (let index = 0; index < this._blackSquares.length; index++) {
            const indexTemp: number = this._blackSquares[index];
            const indexITemp: number = indexTemp % HEIGHT;
            const indexJTemp: number = Math.floor(indexTemp / HEIGHT);
            this._grid[indexITemp][indexJTemp].setIsBlack(true);

        }
    }
}
