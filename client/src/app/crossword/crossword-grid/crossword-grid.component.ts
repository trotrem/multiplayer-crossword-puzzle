import { Component, OnInit, Input, HostListener } from "@angular/core";
import { Direction, Difficulty, NbPlayers, IPoint, IWordInfo } from "../../../../../common/communication/types";
import { CommunicationService } from "../communication.service";
import { GridEventService } from "../grid-event.service/grid-event.service";
import { SocketsService } from "../sockets.service";
import { CrosswordEvents, IGridData } from "../../../../../common/communication/events";
import { GameConfigurationService } from "../game-configuration.service";
import { WordDescription, AssociatedPlayers, Cell } from "../dataStructures";
import { GridManager } from "../grid-manager.service";
import { GridCreator } from "../grid-creator";
import { PlayManagerService } from "../play-manager.service/play-manager.service";
import { WordStatusManagerService } from "../word-status-manager.service/word-status-manager.service";

const CONNECTED: string = "connected";
const DISCONNECTED: string = "disconnected";

enum TipMode {
    Definitions,
    Cheat
}

@Component({
    selector: "app-crossword-grid",
    templateUrl: "./crossword-grid.component.html",
    styleUrls: ["./crossword-grid.component.css"],
    providers: [GridEventService, GridManager, PlayManagerService, WordStatusManagerService]
})

export class CrosswordGridComponent implements OnInit {
    public cells: Cell[][];
    // needed so the html recognizes the enum
    public NbPlayers: typeof NbPlayers = NbPlayers;
    public nbPlayers: number;
    private words: WordDescription[];
    private _difficulty: Difficulty;
    private _playerName: string;
    public selectedWord: WordDescription;
    public opponentSelectedWord: WordDescription;
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
        return this.gridManager.getHorizontalWords();
    }

    public get verticalWords(): WordDescription[] {
        return this.gridManager.getVerticalWords();
    }

    public get nbPlayerFoundWords(): number {
        return this.gridManager.getNbPlayerFoundWords();
    }

    public get nbOpponentFoundWords(): number {
        return this.gridManager.getNbOpponentFoundWords();
    }

    public constructor(
        private communicationService: CommunicationService,
        private gridEventService: GridEventService,
        private gameConfiguration: GameConfigurationService,
        private gridManager: GridManager,
        private socketsService: SocketsService) {

        this.socketsService.onEvent(CrosswordEvents.Connected)
            .subscribe(() => {
                console.warn(CONNECTED);
            });

        this.socketsService.onEvent(CrosswordEvents.Disconnected)
            .subscribe(() => {
                console.warn(DISCONNECTED);
            });
    }

    public ngOnInit(): void {
        this.gridManager = new GridManager(this.gameConfiguration, this.communicationService, this.gridEventService);
        this.nbPlayers = this.gridManager.nbPlayers;
        this._difficulty = this.gridManager.difficulty;
        this._playerName = this.gridManager.playerName;
        this.cells = this.gridManager.cells;
        this.words = this.gridManager.words;
        this.selectedWord = this.gridManager.selectedWord;
        this.opponentSelectedWord = this.gridManager.opponentSelectedWord;

    }
    public toggleTipMode(): void {
        if (this.horizontalWords[0].word === undefined) {
            this.gridManager.fetchCheatModeWords(this.horizontalWords, this.verticalWords);
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
}
