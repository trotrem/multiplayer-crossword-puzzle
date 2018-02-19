import { Component, OnInit, Input } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { GridData } from "../../../../../common/communication/message"

const GRID_WIDTH: number = 10;
const GRID_HEIGHT: number = 10;

interface WordDescription {
  direction: string;
  x: number;
  y: number;
  length: number;
  definition: string;
}

interface Cell {
  content: string;
  selected: boolean;
}

@Component({
  selector: "app-crossword-grid",
  templateUrl: "./crossword-grid.component.html",
  styleUrls: ["./crossword-grid.component.css"]
})
export class CrosswordGridComponent implements OnInit {
  public cells: Cell[][];
  @Input() public nbPlayers: number;
  private words: WordDescription[];

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
        this.cells[i].push({content:"(" + i + ", " + j + ")", selected:false});
      }
    }
    this.cells[3][4].content = "-";
    this.words = new Array<WordDescription>();
    this.words.push({direction: "h", x: 2, y: 0, length: 4, definition: "word1"});
    this.words.push({direction: "v", x: 4, y: 2, length: 6, definition: "word2"});
    this.words.push({direction: "v", x: 2, y: 0, length: 4, definition: "word3"});
    this.fetchGrid();
  }

  public ngOnInit(): void {
  }

  public fetchGrid() {
    this.http.get("http://localhost:3000/crossword-grid")
    .subscribe((data) => {
      console.log(data);
        (data as GridData).blackCells.forEach((cell) => {
          this.cells[cell.x][cell.y].content = "-";
        });
    });
  }
}
