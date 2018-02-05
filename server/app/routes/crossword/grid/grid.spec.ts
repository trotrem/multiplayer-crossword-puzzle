import { expect } from "chai";
import { Grid } from "./grid";


describe("Grid", () => {
    let grid: Grid;
    it("should be instantiable using default constructor", () => {
        grid = new Grid();
        expect(grid).exist;
    });
    it("Should be 10 witdh and 10 height", () => {
        grid = new Grid();
        expect(grid.getHeight()).equals(10);
    });
    it("Should contains black square", () => {
        grid = new Grid();
        let compteurBlack: number;
        const nbrBlack = grid.getNbrBlack();
        for (let indexI = 0; indexI < grid.getHeight(); indexI++) {
            for (let indexJ = 0; indexJ < grid.getHeight(); indexJ++) {
                if (grid.getSquareIsBlack(indexI, indexJ)) {
                    compteurBlack++;
                }
            }
        }
        expect(compteurBlack).equals(nbrBlack);
    });

});
