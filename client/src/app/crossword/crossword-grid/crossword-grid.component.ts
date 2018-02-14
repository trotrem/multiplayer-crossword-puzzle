import { Component, OnInit } from "@angular/core";

const GRID_LENGTH: number = 100;

@Component({
  selector: "app-crossword-grid",
  templateUrl: "./crossword-grid.component.html",
  styleUrls: ["./crossword-grid.component.css"]
})
export class CrosswordGridComponent implements OnInit {
  public cells: string[];

  public constructor() {
    this.cells = new Array<string>();
    for (let i: number = 0; i < GRID_LENGTH; i++) {
      this.cells.push(i.toString());
    }
  }

  public ngOnInit(): void {
  }
}
