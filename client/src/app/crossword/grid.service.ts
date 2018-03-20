import { Component, OnInit, Input, HostListener, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IGridData, Direction, IWordValidationParameters, Difficulty } from "./../../../../common/communication/types";
import { WordDescription } from "./wordDescription";
import { Cell } from "./cell";
import { CommunicationService } from "./communication.service";

const GRID_WIDTH: number = 10;
const GRID_HEIGHT: number = 10;
const BACKSPACE: number = 8;
const DELETE: number = 46;
const UPPER_A: number = 65;
const UPPER_Z: number = 90;
const LOWER_A: number = 97;
const LOWER_Z: number = 122;

@Injectable()
export class GridService {
  private _difficulty: Difficulty = "easy";
  private words: WordDescription[];

  public constructor( words: WordDescription[]) {
    this.words = new Array<WordDescription>();

  }

  private setDifficulty(): Difficulty {
    return this._difficulty = location.pathname === "/crossword/easy" ? "easy" :
      location.pathname === "/crossword/medium" ? "medium" :
        "hard";
  }

  public fillWords(gridData: IGridData, cells: Cell[][]): WordDescription[] {
    gridData.wordInfos.forEach((word, index) => {
      const cellsWord: Cell[] = new Array<Cell>();
      for (let i: number = 0; i < word.length; i++) {
        if (word.direction === Direction.Horizontal) {
          cellsWord.push(cells[word.y][word.x + i]);
        } else if (word.direction === Direction.Vertical) {
          cellsWord.push(cells[word.y + i][word.x]);
        }
      }
      this.words.push({ id: index, direction: word.direction, cells: cellsWord, definition: word.definition, found: false });
    });

    return this.words;
  }

  public getWords(): WordDescription[] {
    return this.words;
  }

  public createEmptyGrid(): Cell[][] {
    const cells: Cell[][] = new Array<Array<Cell>>();
    for (let i: number = 0; i < GRID_HEIGHT; i++) {
      cells[i] = new Array<Cell>();
      for (let j: number = 0; j < GRID_WIDTH; j++) {
        cells[i].push({ content: "", selected: false, isBlack: false, letterFound: false });
      }
    }

    return cells;
  }

}
