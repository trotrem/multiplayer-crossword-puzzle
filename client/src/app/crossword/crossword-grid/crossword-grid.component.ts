import { Component, OnInit, Input, HostListener } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IGridData, Direction, IWordValidationParameters, Difficulty } from "../../../../../common/communication/types";
import { WordDescription } from "../wordDescription";
import { Cell } from "../cell";
import { CommunicationService } from "../communication.service";
import { ActivatedRoute, Router } from "@angular/router";
import { GridEventService } from "../grid-event.service";

const GRID_WIDTH: number = 10;
const GRID_HEIGHT: number = 10;

enum TipMode {
  Definitions,
  Cheat
}

@Component({
  selector: "app-crossword-grid",
  templateUrl: "./crossword-grid.component.html",
  styleUrls: ["./crossword-grid.component.css"],
})
export class CrosswordGridComponent implements OnInit {
  private communicationService: CommunicationService;
  public cells: Cell[][];
  @Input() public nbPlayers: string;
  private words: WordDescription[];
  private _difficulty: Difficulty = "easy";
  public selectedWord: WordDescription = null;
  private TipMode: typeof TipMode = TipMode;
  public tipMode: TipMode = TipMode.Definitions;
  private gridEventService: GridEventService;

  // service grid-event
  @HostListener("document:click")
  // (listens to document event so it's not called in the code)
  private onBackgroundClick(): void {  // tslint:disable-line
    this.selectedWord = this.gridEventService.setSelectedWord(null, false);
  }

  public get horizontalWords(): WordDescription[] {
    return this.words.filter((word) => word.direction === Direction.Horizontal);
  }

  public get verticalWords(): WordDescription[] {
    return this.words.filter((word) => word.direction === Direction.Vertical);
  }

  public constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.communicationService = new CommunicationService(this.http);
    this.cells = new Array<Array<Cell>>();
    this.words = new Array<WordDescription>();
    //  this.setDifficulty();
    for (let i: number = 0; i < GRID_HEIGHT; i++) {
      this.cells[i] = new Array<Cell>();
      for (let j: number = 0; j < GRID_WIDTH; j++) {
        this.cells[i].push({ content: "", selected: false, isBlack: false, letterFound: false });
      }
    }
    this.gridEventService = new GridEventService(this.words, this.http, this.router);

  }
  /*// dans grid.service
  private setDifficulty(): void {
    this._difficulty = location.pathname === "/crossword/easy" ? "easy" :
      location.pathname === "/crossword/medium" ? "medium" :
        "hard";
  }
*/
  public ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.gridEventService.setDifficulty(params["Difficulty"]);
      this._difficulty = params["Difficulty"];
      this.gridEventService.setNbPlayers(params["nbPlayers"]);
      this.nbPlayers = params["nbPlayers"];
      this.fetchGrid();
    });
  }

  // dans grid.service
  private fetchGrid(): void {
    this.communicationService.fetchGrid(this._difficulty)
      .subscribe((data) => {
        const gridData: IGridData = data as IGridData;
        this.gridEventService.setId(gridData.id);
        gridData.blackCells.forEach((cell) => {
          this.cells[cell.y][cell.x].isBlack = true;
        });
        this.fillWords(gridData);
      });
  }

  private fillWords(gridData: IGridData): void {
    gridData.wordInfos.forEach((word, index) => {
      const cells: Cell[] = new Array<Cell>();
      for (let i: number = 0; i < word.length; i++) {
        if (word.direction === Direction.Horizontal) {
          cells.push(this.cells[word.y][word.x + i]);
        } else if (word.direction === Direction.Vertical) {
          cells.push(this.cells[word.y + i][word.x]);
        }
      }
      this.words.push({ id: index, direction: word.direction, cells: cells, definition: word.definition, found: false });
    });
  }
  // grid-mode.service
  public toggleTipMode(): void {
    if (this.horizontalWords[0].word === undefined) {
      this.fetchCheatModeWords();
    }
    this.tipMode === TipMode.Definitions ? this.tipMode = TipMode.Cheat : this.tipMode = TipMode.Definitions;
  }

  public onCellClicked(event: MouseEvent, cell: Cell): void {
    this.selectedWord = this.gridEventService.onCellClicked(event, cell);
  }

  public onIndexClicked(event: MouseEvent, word: WordDescription): void {
    this.selectedWord = this.gridEventService.onIndexClicked(event, word);
  }

  @HostListener("document:keydown", ["$event"])
  public onKeyPress(event: KeyboardEvent): void {
    this.gridEventService.onKeyPress(event);
  }

  // service grid-mode
  private fetchCheatModeWords(): void {
    this.communicationService.fetchCheatModeWords(this.gridEventService.getId())
      .subscribe((data: string[]) => {
        const words: string[] = data as string[];
        let i: number = 0;
        for (const word of this.horizontalWords.concat(this.verticalWords)) {
          word.word = words[i];
          i++;
        }
      });
  }

}
