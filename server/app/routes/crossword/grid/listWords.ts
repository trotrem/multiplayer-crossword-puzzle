import { Word } from "./word";
import { Grid } from "./grid";

export class ListWord {
    private grid: Grid;
    private listOfWordV: Word[];
    private listOfWordH: Word[];
    private lengthOfV: number;
    private lengthOfH: number;
    constructor(grid: Grid) {
        this.grid = grid;
        this.createListOfWord();
    }
    public getListOfWordV(): Word[]{
        return this.listOfWordV;
    }
    public getListOfWordH(): Word[]{
        return this.listOfWordH;
    }
    public getLengthOfV(): number{
        return this.lengthOfV;
    }
    public getLengthOfH(): number{
        return this.lengthOfH;
    }
    private createListOfWord(): void {
        let compteurLength: number = 0;
        let compteurMot: number = 0;
        // compteur mot verticale
        for (let indexJ = 0; indexJ < this.grid.getHeight(); indexJ++) {
            for (let indexI = 0; indexI < this.grid.getWidth(); indexI++) {
                if (!(this.grid[indexI][indexJ].getIsBlack)) {
                    compteurLength++;
                } else {
                    compteurMot++;
                    this.listOfWordV.push(new Word(compteurLength, compteurMot, null));
                    compteurLength = 0;
                }
            }
            compteurMot++;
            this.listOfWordV.push(new Word(compteurLength, compteurMot, null));
            compteurLength = 0;
        }
        this.lengthOfV = compteurMot;
        compteurMot = 0;
        compteurLength = 0;
        //compteur mot horizontale
        for (let indexI = 0; indexI < this.grid.getWidth(); indexI++) {
            for (let indexJ = 0; indexJ < this.grid.getHeight(); indexJ++) {
                if (!(this.grid[indexI][indexJ].getIsBlack)) {
                    compteurLength++;
                } else {
                    compteurMot++;
                    this.listOfWordH.push(new Word(compteurLength, compteurMot, null));
                    compteurLength = 0;
                }
            }
            compteurMot++;
            this.listOfWordV.push(new Word(compteurLength, compteurMot, null));
            compteurLength = 0;
        }
        this.lengthOfH = compteurMot;

    }
}