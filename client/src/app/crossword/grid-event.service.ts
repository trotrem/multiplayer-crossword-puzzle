import { Injectable } from "@angular/core";
import { WordDescription } from "./wordDescription";
import { IWordValidationParameters, Difficulty } from "../../../../common/communication/types";
import { Cell } from "./cell";
import { CommunicationService } from "./communication.service";
import { Router } from "@angular/router";
import { inject } from "inversify";
import { HttpClient } from "@angular/common/http";

const BACKSPACE: number = 8;
const DELETE: number = 46;
const UPPER_A: number = 65;
const UPPER_Z: number = 90;
const LOWER_A: number = 97;
const LOWER_Z: number = 122;

@Injectable()
export class GridEventService {
  private selectedWord: WordDescription = null;
  private words: WordDescription[];
  private id: number;
  private nbPlayers: string;
  private _difficulty: Difficulty = "easy";

  public constructor(
    @inject(CommunicationService) private communicationService: CommunicationService,
    private router: Router) {
  }

  public initialize(words: WordDescription[]): void {
    this.words = words;
  }

  public setSelectedWord(word: WordDescription, selected: boolean): WordDescription {
    if (this.selectedWord === word) {
      return null;
    }
    if (this.selectedWord !== null) {
      this.setWordSelectedState(this.selectedWord, false);
      this.selectedWord = null;
    }
    if (word !== null && selected) {
      this.setWordSelectedState(word, true);
      this.selectedWord = word;
    }

    return this.selectedWord;
  }

  private setWordSelectedState(word: WordDescription, selected: boolean): void {
    for (const cell of word.cells) {
      cell.selected = selected;
    }
  }

  public onCellClicked(event: MouseEvent, cell: Cell): WordDescription {
    if (cell.letterFound) {
      return null;
    }
    event.stopPropagation();
    for (const word of this.words) {
      if (word.cells[0] === cell && word !== this.selectedWord) {

        return this.setSelectedWord(word, true);
      }
    }
    for (const word of this.words) {
      if (word.cells.indexOf(cell) !== -1 && word !== this.selectedWord) {

        return this.setSelectedWord(word, true);
      }
    }

    return this.selectedWord;
  }

  public onIndexClicked(event: MouseEvent, word: WordDescription): WordDescription {
    if (word.found) {
      return null;
    }
    event.stopPropagation();

    return this.setSelectedWord(word, true);
  }

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
    for (const cell of word.cells) {
      if (cell.content === "") {
        cell.content = char;
        this.validate(word);
        this.wordFoundByOtherWord();

        return;
      }
    }
  }

  private erase(word: WordDescription): void {
    let i: number;
    for (i = word.cells.length - 1; i >= 0; i--) {
      if (word.cells[i].content !== "" && !word.cells[i].letterFound) {
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
    this.communicationService.validate(parameters)
      .subscribe((data) => {
        if (data) {
          for (const cell of word.cells) {
            cell.letterFound = true;
          }
          word.found = true;
        }

        this.validateGrid();
      });
  }

  private wordFoundByOtherWord(): void {
    for (const word of this.words) {
      this.validate(word);
    }
  }

  private validateGrid(): void {
    for (const word of this.words) {
      if (!word.found) {
        return;
      }
    }
    this.openEndGame();
  }

  private openEndGame(): void {
    this.router.navigate(["/endGame/" + this.nbPlayers + "/", { Difficulty: this._difficulty }]);
  }

  public set NbPlayers(nbPlayers: string) {
    this.nbPlayers = nbPlayers;
  }

  public set difficulty(difficulty: Difficulty) {
    this._difficulty = difficulty;
  }

  // TODO : public ??
  public set Id(id: number) {
    this.id = id;
  }

  public get Id(): number {
    return this.id;
  }
}
