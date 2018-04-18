import { IPoint } from "../../../../../common/communication/types-crossword";
import { WordDictionaryData, IWordContainer, IGrid } from "../../dataStructures";

const UNDEFINED_LETTER: string = "?";

export class GridUtils {
    public static getText(gridSquares: IPoint[], grid: IGrid): string {
        return gridSquares.map((pos: IPoint) => grid.cells[pos.x][pos.y].letter).join("");
    }

    public static setData(data: WordDictionaryData, word: IWordContainer, grid: IGrid): void {
        word.data = data;
        this.setText(data.word, word.gridSquares, grid);
    }

    public static wordFitsInGrid(newWord: string, gridSquares: IPoint[], grid: IGrid): boolean {
        for (let i: number = 0; i < gridSquares.length; i++) {
            if (
                grid.cells[gridSquares[i].x][gridSquares[i].y].letter !==
                UNDEFINED_LETTER &&
                grid.cells[gridSquares[i].x][gridSquares[i].y].letter !==
                newWord[i]
            ) {
                return false;
            }
        }

        return true;
    }

    private static setText(text: string, gridSquares: IPoint[], grid: IGrid): void {
        for (let i: number = 0; i < gridSquares.length; i++) {
            grid.cells[gridSquares[i].x][gridSquares[i].y].letter = text[i];
        }
    }
}
