import { IPoint } from "../../../../../common/communication/types";
import { IGrid, IWordContainer } from "./dataStructures";
import { WordDictionaryData } from "../lexiconAPI/gridWordInformation";

export class GridUtils {
  public static getText(word: IWordContainer, grid: IGrid): string {
    return word.gridSquares
      .map((pos: IPoint) => grid.cells[pos.x][pos.y].letter)
      .join("");
  }

  public static setData(data: WordDictionaryData, word: IWordContainer, grid: IGrid): void {
    word.data = data;
    this.setText(data.word, word, grid);
  }

  public static wordFitsInGrid(newWord: string, container: IWordContainer, grid: IGrid): boolean {
    for (let i: number = 0; i < container.gridSquares.length; i++) {
      if (
        grid.cells[container.gridSquares[i].x][container.gridSquares[i].y].letter !==
        "?" &&
        grid.cells[container.gridSquares[i].x][container.gridSquares[i].y].letter !==
        newWord[i]
      ) {
        return false;
      }
    }

    return true;
  }

  private static setText(text: string, word: IWordContainer, grid: IGrid): void {
    for (let i: number = 0; i < word.gridSquares.length; i++) {
      grid.cells[word.gridSquares[i].x][word.gridSquares[i].y].letter = text[i];
    }
  }
}
