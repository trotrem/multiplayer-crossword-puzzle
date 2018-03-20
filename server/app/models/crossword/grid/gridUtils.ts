import { IPoint } from "../../../../../common/communication/types";
import { IGrid, IWordContainer } from "./dataStructures";
import { WordDictionaryData } from "../lexiconAPI/gridWordInformation";

export class GridUtils {
  public static getText(word: IWordContainer, grid: IGrid): string {
    return word.gridSquares
      .map((pos: IPoint) => grid.cells[pos.x][pos.y].letter)
      .join("");
  }
// TODO: fonction un peu superflu : tu peut mettre word.data = data dans settext()
  public static trySetData(data: WordDictionaryData, word: IWordContainer, grid: IGrid): boolean {
    if (this.trySetText(data.word, word, grid)) {
      word.data = data;

      return true;
    }

    return false;
  }
  // TODO : est ce que tu l'appele quelque part ?
  public static setData(data: WordDictionaryData, word: IWordContainer, grid: IGrid): void {
    word.data = data;
    this.setText(data.word, word, grid);
  }

  private static trySetText(text: string, word: IWordContainer, grid: IGrid): boolean {
    for (let i: number = 0; i < word.gridSquares.length; i++) {
      if (
        grid.cells[word.gridSquares[i].x][word.gridSquares[i].y].letter !==
        "?" &&
        grid.cells[word.gridSquares[i].x][word.gridSquares[i].y].letter !==
        text[i]
      ) {
        return false;
      }
    }
    this.setText(text, word, grid);

    return true;
  }

  private static setText(text: string, word: IWordContainer, grid: IGrid): void {
    for (let i: number = 0; i < word.gridSquares.length; i++) {
      grid.cells[word.gridSquares[i].x][word.gridSquares[i].y].letter = text[i];
    }
  }
}
