import { Square } from "./square";

const WIDTH = 10;
const HEIGHT = 10;

function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
export class Grid {

    private grid: Square[][];

    constructor() {

    }

    private generateBlackSquare(): void {
        let nbrBlack = randomIntFromInterval(11, 15);
        let blackSquare: number[];
        for (let index = 0; index < nbrBlack; index++) {
            let temp = randomIntFromInterval(0, 99);
            for (let verification = 0; verification < blackSquare.length; verification++) {
                if (temp = blackSquare[verification]) {
                    temp = randomIntFromInterval(0, 99);
                    verification = 0;
                }
            }
            blackSquare[index] = temp;
        }

    }


    private makeGrid(): void {
        for (let indexI = 0; indexI < WIDTH; indexI++) {
            for (let indexJ = 0; indexJ < HEIGHT; indexJ++) {
                this.grid[indexI][indexJ] = new Square(indexI * 10 + indexJ, false, null, true);
            }
        }
    }
    private putWords(): void {


    }

}
