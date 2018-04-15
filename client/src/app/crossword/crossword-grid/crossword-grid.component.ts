import { Component, OnInit, Input, HostListener } from "@angular/core";
import { Direction, Difficulty, NbPlayers, IPoint, IWordInfo } from "../../../../../common/communication/types";
import { WordDescription } from "../wordDescription";
import { Cell, FoundStatus } from "../cell";
import { CommunicationService } from "../communication.service";
import { GridEventService } from "../grid-event.service";
import { SocketsService } from "../sockets.service";
import { CrosswordEvents, IGridData } from "../../../../../common/communication/events";
import { GameConfigurationService } from "../game-configuration.service";

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
    providers: [GridEventService]
})
export class CrosswordGridComponent implements OnInit {
    public cells: Cell[][];
    // needed so the html recognizes the enum
    public NbPlayers: typeof NbPlayers = NbPlayers;
    public nbPlayers: number;
    private words: WordDescription[];
    private _difficulty: Difficulty = Difficulty.Easy;
    private _playerName: string;
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

    public get nbPlayerFoundWords(): number {
        return this.words.filter((word) => word.found === FoundStatus.PLAYER).length;
    }

    public get nbOpponentFoundWords(): number {
        return this.words.filter((word) => word.found === FoundStatus.OPPONENT).length;
    }

    public constructor(
        private communicationService: CommunicationService,
        private gridEventService: GridEventService,
        private gameConfiguration: GameConfigurationService,
        private socketsService: SocketsService) {
        this.cells = new Array<Array<Cell>>();
        this.words = new Array<WordDescription>();
        for (let i: number = 0; i < GRID_HEIGHT; i++) {
            this.cells[i] = new Array<Cell>();
            for (let j: number = 0; j < GRID_WIDTH; j++) {
                this.cells[i].push({ content: "", selected: false, isBlack: false, letterFound: FoundStatus.NOT });
            }
        }

        this.gridEventService.initialize(this.words, this.nbPlayers);

        this.socketsService.onEvent(CrosswordEvents.Connected)
            .subscribe(() => {
                console.warn('connected');
            });

        this.socketsService.onEvent(CrosswordEvents.Disconnected)
            .subscribe(() => {
                console.warn('disconnected');
            });
    }

    public ngOnInit(): void {
        this.gridEventService.setDifficulty(this.gameConfiguration.difficulty);
        this._difficulty = this.gameConfiguration.difficulty;
        this._playerName = this.gameConfiguration.playerName;
        this.nbPlayers = this.gameConfiguration.nbPlayers;
        // TODO sketch
        this.gridEventService.setNbPlayers(this.nbPlayers);
        this.subscribeToGridFetched();
        this.subscribeToValidation();
    }

    private createGrid(gridData: IGridData): void {
        this.gridEventService.setId(gridData.id);
        gridData.blackCells.forEach((cell: IPoint) => {
            this.cells[cell.y][cell.x].isBlack = true;
        });
        this.fillWords(gridData);
    }

    private subscribeToGridFetched(): void {
        this.communicationService.gridPromise
            .then((data) => {
                this.createGrid(data);
            });
    }

    private subscribeToValidation(): void {
        this.communicationService.onValidation().subscribe((data) => {
            this.gridEventService.onWordValidated(data);
        });
    }

    private fillWords(gridData: IGridData): void {
        gridData.wordInfos.forEach((word: IWordInfo, index: number) => {
            const cells: Cell[] = new Array<Cell>();
            for (let i: number = 0; i < word.length; i++) {
                if (word.direction === Direction.Horizontal) {
                    cells.push(this.cells[word.y][word.x + i]);
                } else if (word.direction === Direction.Vertical) {
                    cells.push(this.cells[word.y + i][word.x]);
                }
            }
            this.words.push({ id: index, direction: word.direction, cells: cells, definition: word.definition, found: FoundStatus.NOT });
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
