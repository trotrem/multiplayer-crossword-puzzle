import { IPoint } from "../../../../../common/communication/types-crossword";
import { WordDictionaryData, IWordContainer, IGrid, ICell } from "../../dataStructures";

const UNDEFINED_LETTER: string = "?";

export class GridUtils {
    public static getText(gridSquares: IPoint[], cells: ICell[][]): string {
        return gridSquares.map((pos: IPoint) => cells[pos.x][pos.y].letter).join("");
    }

    public static setData(data: WordDictionaryData, word: IWordContainer, cells: ICell[][]): void {
        word.data = data;
        this.setText(data.word, word.gridSquares, cells);
    }

    public static wordFitsInGrid(newWord: string, gridSquares: IPoint[], cells: ICell[][]): boolean {
        for (let i: number = 0; i < gridSquares.length; i++) {
            if (
                cells[gridSquares[i].x][gridSquares[i].y].letter !==
                UNDEFINED_LETTER &&
                cells[gridSquares[i].x][gridSquares[i].y].letter !==
                newWord[i]
            ) {
                return false;
            }
        }

        return true;
    }

    private static setText(text: string, gridSquares: IPoint[], cells: ICell[][]): void {
        for (let i: number = 0; i < gridSquares.length; i++) {
            cells[gridSquares[i].x][gridSquares[i].y].letter = text[i];
        }
    }
}
