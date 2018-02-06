import { Grid } from "../grid/grid";

export class GridSaver {
    private _gridArray: Grid[];

    constructor() {
        this._gridArray = new Array();
    }
    public addGrid(grid: Grid): void {
        this._gridArray.push(grid);
    }
}
