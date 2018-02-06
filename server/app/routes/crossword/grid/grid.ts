// import * as requestOption from "request-promise-native";
// import { ExternalApiService } from "../lexiconAPI/externalApi.service";
// import { GridWordInformation } from "../lexiconAPI/gridWordInformation";
import { Square } from "./square";

const WIDTH: number = 10;
const HEIGHT: number = 10;
const MINBLACK: number = 11;
const MAXBLACK: number = 15;
const MINCASES: number = 0;
const MAXCASES: number = 99;
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
    public getSquareIsBlack(i: number, j: number): boolean {
        const isBlack: boolean = this._grid[i][j].getIsBlack();

        return isBlack;
    }
    public get NbrBlack(): number {
        return this._nbrBlack;
    }
    private randomIntFromInterval(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    private generateBlackSquare(): void {
        this._blackSquares = new Array<number>();
        this._nbrBlack = this.randomIntFromInterval(MINBLACK, MAXBLACK);
        for (let indexBlack: number = 0; indexBlack < this._nbrBlack; indexBlack++) {
            let temp: number = this.randomIntFromInterval(MINCASES, MAXCASES);
            for (let verif2: number = 0; verif2 < this._notBlackSquares.length; verif2++) {
                if (temp === this._notBlackSquares[verif2]) {
                    temp = this.randomIntFromInterval(MINCASES, MAXCASES);
                    verif2 = 0;
                } else {
                    for (let verif1: number = 0; verif1 < this._blackSquares.length; verif1++) {
                        if (temp === this._blackSquares[verif1]) {
                            temp = this.randomIntFromInterval(MINCASES, MAXCASES);
                            verif1 = 0;
                            verif2 = 0;
                        }
                    }
                }
            }

            if (temp % HEIGHT > 0) {
                this._notBlackSquares.push(temp - 1);
            }
            if (temp % HEIGHT < HEIGHT - 1) {
                this._notBlackSquares.push(temp + 1);
            }
            if (temp > HEIGHT - 1) {
                this._notBlackSquares.push(temp + 10);
            }
            if (temp < (HEIGHT-1)*HEIGHT) {
                this._notBlackSquares.push(temp - 10);
            }
            this._notBlackSquares.push(temp - 2);
            this._notBlackSquares.push(temp + 2);
            this._notBlackSquares.push(temp - 20);
            this._notBlackSquares.push(temp + 20);

            this._blackSquares[indexBlack] = temp;
        }
    }

    public makeGrid(): void {
        // making an empty grid
        for (let indexI: number = 0; indexI < WIDTH; indexI++) {
            const row: Square[] = new Array();
            for (let indexJ: number = 0; indexJ < HEIGHT; indexJ++) {
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
