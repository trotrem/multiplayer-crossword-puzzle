import { Injectable, HostListener } from "@angular/core";
import { WordDescription } from "./wordDescription";
import { IWordValidationParameters } from "../../../../common/communication/types";
import { Cell } from "./cell";

const BACKSPACE: number = 8;
const DELETE: number = 46;
const UPPER_A: number = 65;
const UPPER_Z: number = 90;
const LOWER_A: number = 97;
const LOWER_Z: number = 122;

@Injectable()
export class GridEventService {
  public selectedWord: WordDescription = null;
  private words: WordDescription[];
  private id: number;

  public constructor(words: WordDescription[], id: number) {
    this.words = words;
    this.id = id;
  }

  @HostListener("document:click")
  // (listens to document event so it's not called in the code)
  private onBackgroundClick(): void {  // tslint:disable-line
    this.setSelectedWord(null, false);
  }
  private setSelectedWord(word: WordDescription, selected: boolean): void {
    if (this.selectedWord === word) {
      return;
    }
    if (this.selectedWord !== null) {
      this.setWordSelectedState(this.selectedWord, false);
      this.selectedWord = null;
    }
    if (word !== null && selected) {
      this.setWordSelectedState(word, true);
      this.selectedWord = word;
    }
  }

  private setWordSelectedState(word: WordDescription, selected: boolean): void {
    for (const cell of word.cells) {
      cell.selected = selected;
    }
  }

  public onCellClicked(event: MouseEvent, cell: Cell): void {
    event.stopPropagation();
    for (const word of this.words) {
      if (word.cells[0] === cell && word !== this.selectedWord) {
        this.setSelectedWord(word, true);

        return;
      }
    }
    for (const word of this.words) {
      if (word.cells.indexOf(cell) !== -1 && word !== this.selectedWord) {
        this.setSelectedWord(word, true);

        return;
      }
    }
  }

  public onIndexClicked(event: MouseEvent, word: WordDescription): void {
    event.stopPropagation();
    this.setSelectedWord(word, true);
  }

  @HostListener("document:keydown", ["$event"])
  public onKeyPress(event: KeyboardEvent): void {
    if (this.selectedWord !== null) {
      if (event.keyCode >= UPPER_A &&
        event.keyCode <= UPPER_Z ||
        event.keyCode >= LOWER_A &&
        event.keyCode <= LOWER_Z) {
        this.write(String.fromCharCode(event.keyCode).toUpperCase(), this.selectedWord);
      }
      if (event.keyCode === BACKSPACE || event.keyCode === DELETE) {
        this.erase(this.selectedWord);
      }
    }
  }

  private write(char: string, word: WordDescription): void {
    for (let i: number = 0; i < word.cells.length; i++) {
      if (word.cells[i].content === "") {
        word.cells[i].content = char;
        if (i === word.cells.length - 1) {
          this.validate(word);
        }

        return;
      }
    }
  }

  private erase(word: WordDescription): void {
    let i: number;
    for (i = word.cells.length - 1; i >= 0; i--) {
      if (word.cells[i].content !== "") {
        word.cells[i].content = "";

        return;
      }
    }
  }

  private validate(word: WordDescription): void {

    const parameters: IWordValidationParameters = {
      gridId: this.id,
      wordIndex: word.id,
      word: word.cells.map((elem) => elem.content).join("")
    };

    this.communicationService.validate(parameters);
  }

}
