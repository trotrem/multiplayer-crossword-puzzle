/*
import { expect } from "chai";
import { Grid } from "./grid";

const grid: Grid = new Grid();
grid.makeGrid();
let combineString: string = "";
for (let indexI = 0; indexI < grid.Height; indexI++) {
    combineString += "|";
    for (let indexJ = 0; indexJ < grid.Width; indexJ++) {
        if (grid.getSquareIsBlack(indexI, indexJ)) {
            combineString += " # ";
        } else {
            combineString += " ? ";
        }
    }
    combineString += "|\n";
}
console.log(combineString);

describe("Grid", () => {
    it("Should be 10 witdh and 10 height", () => {
        expect(grid.Height).equals(10);
    });
    it("Should contains black square", () => {
        let compteurBlack: number = 0;
        const nbrBlack: number = grid.NbrBlack;
        for (let indexI: number = 0; indexI < grid.Height; indexI++) {
            for (let indexJ: number = 0; indexJ < grid.Width; indexJ++) {
                if (grid.getSquareIsBlack(indexI, indexJ)) {
                    compteurBlack++;
                }
            }
        }
        expect(compteurBlack).equals(nbrBlack);
    });

});
*/