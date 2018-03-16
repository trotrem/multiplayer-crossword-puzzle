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
  private communicationService: CommunicationService;
  private id: number;
  public cells: Cell[][];
  private _difficulty: Difficulty = "easy";
  private words: WordDescription[];

  public constructor(communicationService: CommunicationService, cells: Cell[][], words: WordDescription[]) {
    this.communicationService = communicationService;
    this.cells = cells;
    for (let i: number = 0; i < GRID_HEIGHT; i++) {
      this.cells[i] = new Array<Cell>();
      for (let j: number = 0; j < GRID_WIDTH; j++) {
        this.cells[i].push({ content: "", selected: false, isBlack: false });
      }
    }
    this.words = words;
  }

  private setDifficulty(): Difficulty {
    return this._difficulty = location.pathname === "/crossword/easy" ? "easy" :
      location.pathname === "/crossword/medium" ? "medium" :
        "hard";
  }

  public fetchGrid(): void {
    this.communicationService.fetchGrid(this._difficulty)
      .subscribe((data) => {
        const gridData: IGridData = data as IGridData;
        this.id = gridData.id;
        gridData.blackCells.forEach((cell) => {
          this.cells[cell.y][cell.x].isBlack = true;
        });
        gridData.wordInfos.forEach((word, index) => {
          const cells: Cell[] = new Array<Cell>();
          for (let i: number = 0; i < word.length; i++) {
            if (word.direction === Direction.Horizontal) {
              cells.push(this.cells[word.y][word.x + i]);
            } else if (word.direction === Direction.Vertical) {
              cells.push(this.cells[word.y + i][word.x]);
            }
          }
          this.words.push({ id: index, direction: word.direction, cells: cells, definition: word.definition });
        });
      });
  }

  public get Cells(): Cell[][] {
    return this.cells;
  }

  public get Words(): WordDescription[] {
    return this.words;
  }

}
