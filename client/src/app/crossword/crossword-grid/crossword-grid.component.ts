import { Component, OnInit, Input, HostListener } from "@angular/core";
import { Direction, Difficulty, NbPlayers, IPoint, IWordInfo } from "../../../../../common/communication/types";
import { CommunicationService } from "../communication.service";
import { GridEventService } from "../grid-event.service/grid-event.service";
import { SocketsService } from "../sockets.service";
import { CrosswordEvents, IGridData } from "../../../../../common/communication/events";
import { GameConfigurationService } from "../game-configuration.service";
import { WordDescription, AssociatedPlayers, Cell } from "../dataStructures";
import { PlayManagerService } from "../play-manager.service/play-manager.service";
import { WordStatusManagerService } from "../word-status-manager.service/word-status-manager.service";

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
    providers: [GridEventService, PlayManagerService, WordStatusManagerService]
})

// TODO: initialiser attributs dans le constructeur (et checker à d'autres places)
export class CrosswordGridComponent implements OnInit {
    public cells: Cell[][];
    // needed so the html recognizes the enum
    public NbPlayers: typeof NbPlayers = NbPlayers;
    public nbPlayers: number;
    private words: WordDescription[];
    private _difficulty: Difficulty = Difficulty.Easy;
    private _playerName: string;
    public selectedWord: WordDescription = null;
    public opponentSelectedWord: WordDescription = null;
    // needed so the html recognizes the enum
    public TipMode: typeof TipMode = TipMode;
    public tipMode: TipMode = TipMode.Definitions;
    private isStated: boolean;

    @HostListener("document:click")
    // (listens to document event so it's not called in the code)
    private onBackgroundClick(): void {  // tslint:disable-line
        if (this.isStated) {
            this.selectedWord = this.gridEventService.setPlayerSelectedWord(null, false);
        }
    }

    public get horizontalWords(): WordDescription[] {
        return this.words.filter((word) => word.direction === Direction.Horizontal);
    }

    public get verticalWords(): WordDescription[] {
        return this.words.filter((word) => word.direction === Direction.Vertical);
    }

    public get nbPlayerFoundWords(): number {
        return this.words.filter((word) => word.found === AssociatedPlayers.PLAYER).length;
    }

    public get nbOpponentFoundWords(): number {
        return this.words.filter((word) => word.found === AssociatedPlayers.OPPONENT).length;
    }

    public constructor(
        private communicationService: CommunicationService,
        private gridEventService: GridEventService,
        private gameConfiguration: GameConfigurationService,
        private socketsService: SocketsService) {
        this.cells = new Array<Array<Cell>>();
        this.words = new Array<WordDescription>();
        for (let i: number = 0; i < GRID_HEIGHT; i++) {
            this.isStated = false;
            this.cells[i] = new Array<Cell>();
            for (let j: number = 0; j < GRID_WIDTH; j++) {
                this.cells[i].push({
                    content: "",
                    selectedBy: AssociatedPlayers.NONE,
                    isBlack: false,
                    letterFound: AssociatedPlayers.NONE
                });
            }
        }

        this.socketsService.onEvent(CrosswordEvents.Connected)
            .subscribe(() => {
                console.warn("connected");
            });

        this.socketsService.onEvent(CrosswordEvents.Disconnected)
            .subscribe(() => {
                console.warn("disconnected");
            });
    }

    public ngOnInit(): void {
        this.nbPlayers = this.gameConfiguration.nbPlayers;
        this._difficulty = this.gameConfiguration.difficulty;
        this._playerName = this.gameConfiguration.playerName;
        // TODO sketch
        this.subscribeToGridFetched();
        this.subscribeToValidation();
    }

    private createGrid(gridData: IGridData): void {
        console.log(gridData.gameId);
        this.gridEventService.initialize(this.words, gridData.gameId);
        gridData.blackCells.forEach((cell: IPoint) => {
            this.cells[cell.y][cell.x].isBlack = true;
            this.isStated = true;
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
            this.words.push({
                id: index,
                direction: word.direction,
                cells: cells,
                definition: word.definition,
                found: AssociatedPlayers.NONE
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
