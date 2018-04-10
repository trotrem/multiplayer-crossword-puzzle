import { Component, OnInit, Input, HostListener } from "@angular/core";
import { IGridData, Direction, Difficulty, NbPlayers } from "../../../../../common/communication/types";
import { WordDescription } from "../wordDescription";
import { Cell } from "../cell";
import { CommunicationService } from "../communication.service";
import { ActivatedRoute } from "@angular/router";
import { GridEventService } from "../grid-event.service";
import { inject } from "inversify";
import { SocketsService } from "../sockets.service";
import { CrosswordEvents } from "../../../../../common/communication/events";

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
    providers: [CommunicationService, GridEventService]
})
export class CrosswordGridComponent implements OnInit {
    public cells: Cell[][];
    // needed so the html recognizes the enum
    public NbPlayers: typeof NbPlayers = NbPlayers;
    public nbPlayers: NbPlayers;
    private words: WordDescription[];
    private _difficulty: Difficulty = Difficulty.Easy;
    public selectedWord: WordDescription = null;
    // needed so the html recognizes the enum
    private TipMode: typeof TipMode = TipMode;// tslint:disable-line
    public tipMode: TipMode = TipMode.Definitions;

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

    public constructor(
        @inject(CommunicationService) private communicationService: CommunicationService,
        @inject(GridEventService) private gridEventService: GridEventService,
        private route: ActivatedRoute,
        private socketsService: SocketsService) {
        this.cells = new Array<Array<Cell>>();
        this.words = new Array<WordDescription>();
        for (let i: number = 0; i < GRID_HEIGHT; i++) {
            this.cells[i] = new Array<Cell>();
            for (let j: number = 0; j < GRID_WIDTH; j++) {
                this.cells[i].push({ content: "", selected: false, isBlack: false, letterFound: false });
            }
        }

        this.gridEventService.initialize(this.words, this.nbPlayers);

        this.socketsService.onEvent(CrosswordEvents.Connected)
            .subscribe(() => {
                console.log('connected');
            });

        this.socketsService.onEvent(CrosswordEvents.Disconnected)
            .subscribe(() => {
                console.log('disconnected');
            });


    }

    public ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.gridEventService.setDifficulty(params["Difficulty"]);
            this._difficulty = params["Difficulty"];
            this.nbPlayers = params["playerName"] === undefined  ? 1 : 2;
            this.gridEventService.setNbPlayers(this.nbPlayers);
            this.fetchGrid();
        });
    }

    private fetchGrid(): void {
        this.communicationService.createSinglePlayerGame(this._difficulty)
            .first().subscribe((data) => {
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
