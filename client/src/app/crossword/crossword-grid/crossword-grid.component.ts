import { Component, OnInit, Input, HostListener } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GridData, Direction, WordValidationParameters, Difficulty } from "../../../../../common/communication/types";
import { WordDescription } from "../wordDescription";
import { Cell } from "../cell";
import { CommunicationService } from "../communication.service";

const GRID_WIDTH: number = 10;
const GRID_HEIGHT: number = 10;
const BACKSPACE: number = 8;
const DELETE: number = 46;
const UPPER_A: number = 65;
const UPPER_Z: number = 90;
const LOWER_A: number = 97;
const LOWER_Z: number = 122;

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
  @Input() public nbPlayers: number;
  private words: WordDescription[];
  private id: number;
  private _difficulty: Difficulty = "easy";
  public selectedWord: WordDescription = null;
  private TipMode: typeof TipMode = TipMode;
  public tipMode: TipMode = TipMode.Definitions;

  @HostListener("document:click")
  // (listens to document event so it's not called in the code)
  private onBackgroundClick(): void {  // tslint:disable-line
    this.setSelectedWord(null, false);
  }

  public get horizontalWords(): WordDescription[] {
    return this.words.filter((word) => word.direction === Direction.Horizontal);
  }

  public get verticalWords(): WordDescription[] {
    return this.words.filter((word) => word.direction === Direction.Vertical);
  }

  public constructor(private http: HttpClient) {
    this.communicationService = new CommunicationService(this.http);
    this.cells = new Array<Array<Cell>>();
    for (let i: number = 0; i < GRID_HEIGHT; i++) {
      this.cells[i] = new Array<Cell>();
      for (let j: number = 0; j < GRID_WIDTH; j++) {
        this.cells[i].push({ content: "", selected: false, isBlack: false });
      }
    }
    this.words = new Array<WordDescription>();
    this.setDifficulty();
    this.fetchGrid();
  }

  private setDifficulty(): void {
    this._difficulty = location.pathname === "/crossword/easy" ? "easy" :
      location.pathname === "/crossword/medium" ? "medium" :
        "hard";
  }

  public ngOnInit(): void {
  }

  public fetchGrid(): void {
    this.communicationService.fetchGrid(this._difficulty)
      .subscribe((data) => {
        const gridData: GridData = data as GridData;
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

  public toggleTipMode(): void {
    if (this.horizontalWords[0].word === undefined) {
      this.fetchCheatModeWords();
    }
    this.tipMode === TipMode.Definitions ? this.tipMode = TipMode.Cheat : this.tipMode = TipMode.Definitions;
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
    for (let i: number = 0; i < word.cells.length; i++) {
      if (word.cells[i].content === "") {
        word.cells[i].content = char;
        if (i === word.cells.length - 1) {
          this.validate(word);
        }

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

  private validate(word: WordDescription): void {

    const parameters: WordValidationParameters = {
      gridId: this.id,
      wordIndex: word.id,
      word: word.cells.map((elem) => elem.content).join("")
    };

    this.communicationService.validate(parameters);
  }

  private fetchCheatModeWords(): void {
    this.communicationService.fetchCheatModeWords(this.id)
      .subscribe((data: string[]) => {
        const words: string[] = data as string[];
        let i: number = 0;
        for (const word of this.horizontalWords.concat(this.verticalWords)) {
          word.word = words[i];
          i++;
        }
      });
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
