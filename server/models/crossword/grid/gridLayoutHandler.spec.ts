// TODO: fix
// tslint:disable
declare var require: any
import { expect } from "chai";
import { GridLayoutHandler } from "./gridLayoutHandler";
import { IGrid } from "./dataStructures";

var rewire = require('rewire');

const gridLayoutHandler: any = rewire("./gridLayoutHandler");

describe("makeGrid", () => {
    let grid: IGrid = { cells: [], words: [], blackCells: [] };
    beforeEach(() => {
        const layoutHandler: GridLayoutHandler = new GridLayoutHandler();
        grid = { cells: [], words: [], blackCells: [] };
        layoutHandler.makeGrid(grid);
      });

    it("Should be 10 witdh and 10 height", () => {
        expect(grid.cells.length).equals(10);
        expect(grid.cells[0].length).equals(10);
    });
    it("Should contains at least the minimum of black squares", () => {
        const MINBLACK: number = gridLayoutHandler.__get__("MINBLACK");
        expect(grid.blackCells.length).gte(MINBLACK);
    });

});
