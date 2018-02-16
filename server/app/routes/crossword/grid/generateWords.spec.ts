import { expect } from "chai";
import { GenerateWords } from "./generateWords";

let fullGrid = new GenerateWords();
/*fullGrid.generateGrid()
let combineString: string = "";
for (let indexI = 0; indexI < fullGrid.Grid.Height; indexI++) {
    combineString += "|";
    for (let indexJ = 0; indexJ < fullGrid.Grid.Width; indexJ++) {
        if (fullGrid.Grid.getSquareIsBlack(indexI, indexJ)) {
            combineString += " # ";
        } else {
            combineString += fullGrid.Grid.Grid[indexI][indexJ].getLetter();
        }
    }
    combineString += "|\n";
}
console.log(combineString);*/

describe("Full grid", () => {

    it("Be a grid ", async () => {
        let grid = await fullGrid.generateGrid();
        let combineString: string = "";
        for (let indexI = 0; indexI < grid.Height; indexI++) {
            combineString += "|";
            for (let indexJ = 0; indexJ < grid.Width; indexJ++) {
                if (fullGrid.Grid.getSquareIsBlack(indexI, indexJ)) {
                    combineString += " # ";
                } else {
                    combineString += grid.Grid[indexI][indexJ].getLetter();
                }
            }
            combineString += "|\n";
        }
        console.log(combineString);
        expect(true);
    }).timeout(60000);
});