import {Grid} from "../grid/grid"; 


export class GridSaver{
    private gridArray : Grid[] ; 

    constructor(){

    }
    public addGrid (grid : Grid){
        this.gridArray.push(grid);
    }
}