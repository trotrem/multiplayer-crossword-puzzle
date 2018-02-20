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
    for (let i: number = 0; i < GRID_WIDTH; i++) {
      this.cells[i] = new Array<Cell>();
      for (let j: number = 0; j < GRID_HEIGHT; j++) {
        this.cells[i].push({content: "", selected: false});
      }
    }
    this.words = new Array<WordDescription>();

    this.bullshitSetup();

    this.fetchGrid();
  }

  public ngOnInit(): void {
  }

  // TODO: REMOVE FUNCTION (FAKE WORDS)
  private bullshitSetup(): void {
    this.words.push({direction: "h", cells: this.cells[1].slice(0, 6), definition: "word1"});
    this.words.push({direction: "v", cells: this.cells[2].slice(5, 9), definition: "word2"});
    this.words.push({direction: "v", cells: this.cells[3].slice(3, 7), definition: "word3"});
  }

  public fetchGrid(): void {
    this.http.get("http://localhost:3000/crossword-grid")
    .subscribe((data) => {
      (data as GridData).blackCells.forEach((cell) => {
          this.cells[cell.x][cell.y].content = "-";
        });
    });
  }

  public onCellClicked(event: MouseEvent, cell: Cell): void {
    event.stopPropagation();
    for (const word of this.words) {
      if (word.cells.indexOf(cell) !== -1) {
        this.setSelectedWord(word, true);
        break;
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
