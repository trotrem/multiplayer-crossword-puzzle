import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-crossword-grid',
  templateUrl: './crossword-grid.component.html',
  styleUrls: ['./crossword-grid.component.css']
})
export class CrosswordGridComponent implements OnInit {

  public cells: string[];

  constructor() { 
    this.cells = new Array<string>();
    for(let i = 0;i<100;i++){
      this.cells.push(i.toString());
    }
  }

  ngOnInit() {
  }

}
