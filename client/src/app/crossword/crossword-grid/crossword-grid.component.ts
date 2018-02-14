import { Component, OnInit } from "@angular/core";

const GRID_WIDTH: number = 10;
const GRID_HEIGHT: number = 10;

@Component({
  selector: "app-crossword-grid",
  templateUrl: "./crossword-grid.component.html",
  styleUrls: ["./crossword-grid.component.css"]
})
export class CrosswordGridComponent implements OnInit {
  public cells: string[][];

  public constructor() {
    this.cells = new Array<Array<string>>();
    for (let i: number = 0; i < GRID_WIDTH; i++) {
      this.cells[i] = new Array<string>();
      for (let j: number = 0; j < GRID_HEIGHT; j++) {
        this.cells[i].push("(" + i + ", " + j + ")");
      }
    }
    this.cells[3][4] = "-";
  }

  public ngOnInit(): void {
  }
}
