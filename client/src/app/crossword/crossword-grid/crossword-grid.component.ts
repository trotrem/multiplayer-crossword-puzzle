import { Component, OnInit, Input, HostListener } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { GridData } from "../../../../../common/communication/message";

const GRID_WIDTH: number = 10;
const GRID_HEIGHT: number = 10;

interface WordDescription {
  direction: string;
  cells: Cell[];
  definition: string;
}

interface Cell {
  isBlack: boolean;
  content: string;
  selected: boolean;
}

@Component({
  selector: "app-crossword-grid",
  templateUrl: "./crossword-grid.component.html",
  styleUrls: ["./crossword-grid.component.css"],
})
export class CrosswordGridComponent implements OnInit {
  public cells: Cell[][];
  @Input() public nbPlayers: number;
  private words: WordDescription[];
  public selectedWord: WordDescription = null;

  @HostListener("document:click")
  // (listens to document event so it's not called in the code)
  private onBackgroundClick(): void {  // tslint:disable-line
    this.setSelectedWord(null, false);
  }

  public get horizontalWords(): WordDescription[] {
    return this.words.filter((word) => word.direction === "h");
  }

  public get verticalWords(): WordDescription[] {
    return this.words.filter((word) => word.direction === "v");
  }

  public constructor(private http: HttpClient) {
    this.cells = new Array<Array<Cell>>();
    for (let i: number = 0; i < GRID_HEIGHT; i++) {
      this.cells[i] = new Array<Cell>();
      for (let j: number = 0; j < GRID_WIDTH; j++) {
        this.cells[i].push({content: "", selected: false, isBlack: false});
      }
    }
    this.words = new Array<WordDescription>();

    this.fetchGrid();
  }

  public ngOnInit(): void {
  }

  public fetchGrid(): void {
    this.http.get("http://localhost:3000/crossword-grid")
    .subscribe((data) => {
      const gridData: GridData = data as GridData;
      gridData.blackCells.forEach((cell) => {
          this.cells[cell.y][cell.x].isBlack = true;
        });
      gridData.wordInfos.forEach((word) => {
        const cells: Cell[] = new Array<Cell>();
        for (let i = 0; i < word.length; i++) {
          if (word.direction === "h") {
            cells.push(this.cells[word.y][word.x + i])
          }
          else if (word.direction === "v") {
            cells.push(this.cells[word.y + i][word.x])
          }
        }
        this.words.push({direction: word.direction, cells: cells, definition: word.definition});
      })
    });
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
      if (event.keyCode >= 65 && event.keyCode <= 90 || event.keyCode >= 97 && event.keyCode <= 122) {
        this.write(String.fromCharCode(event.keyCode).toUpperCase(), this.selectedWord);
      }
      if (event.keyCode === 8  || event.keyCode === 46) {
        this.erase(this.selectedWord);
      }
    }
  }

  private write(char: string, word: WordDescription): void {
    for (const pos of word.cells) {
      if (pos.content === "") {
        pos.content = char;

        return;
      }
    }
  }

  private erase(word: WordDescription): void {
    const i: number = word.cells.findIndex((cell) => cell.content === "");
    if (i > 0) {
      word.cells[i - 1].content = "";

      return;
    }
    word.cells[word.cells.length - 1].content = "";
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
}
