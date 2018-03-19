// TODO: fix
// tslint:disable
import { expect } from "chai";
import { GridLayoutHandler, MINBLACK, MAXBLACK } from "./gridLayoutHandler";
import { IGrid } from "./dataStructures";

describe("makeGrid", () => {
    let grid: IGrid = { cells: [], words: [], blackCells: [] };
    beforeEach(() => {
        grid = { cells: [], words: [], blackCells: [] };
        GridLayoutHandler.makeGrid(grid);
      });

    it("Should be 10 witdh and 10 height", () => {
        expect(grid.cells.length).equals(10);
        expect(grid.cells[0].length).equals(10);
    });
    
    it("Number of black squares should be within the MinMax interval", () => {
        expect(grid.blackCells.length).gte(MINBLACK);
        expect(grid.blackCells.length).lte(MAXBLACK);
    });

});
