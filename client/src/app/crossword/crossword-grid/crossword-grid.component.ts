import { Component, OnInit, Input, HostListener } from "@angular/core";
import { Direction, Difficulty, NbPlayers, IPoint, IWordInfo } from "../../../../../common/communication/types";
import { CommunicationService } from "../communication.service";
import { GridEventService } from "../grid-event.service/grid-event.service";
import { SocketsService } from "../sockets.service";
import { CrosswordEvents, IGridData } from "../../../../../common/communication/events";
import { GameConfigurationService } from "../game-configuration.service";
import { WordDescription, AssociatedPlayers, Cell } from "../dataStructures";
import { GridService } from "../grid-service";
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
    providers: [GridEventService, GridService, PlayManagerService, WordStatusManagerService]
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
        return this.gridService.getHorizontalWords();
    }

    public get verticalWords(): WordDescription[] {
        return this.gridService.getVerticalWords();
    }

    public get nbPlayerFoundWords(): number {
        return this.gridService.getNbPlayerFoundWords();
    }

    public get nbOpponentFoundWords(): number {
        return this.gridService.getNbOpponentFoundWords();
    }

    public constructor(
        private communicationService: CommunicationService,
        private gridEventService: GridEventService,
        private gameConfiguration: GameConfigurationService,
        private gridService: GridService,
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
        this.gridService = new GridService(this.gameConfiguration, this.communicationService, this.gridEventService);
        this.nbPlayers = this.gridService.nbPlayers;
        this._difficulty = this.gridService.difficulty;
        this._playerName = this.gridService.playerName;
        this.cells = this.gridService.cells;
        this.words = this.gridService.words;
        this.selectedWord = this.gridService.selectedWord;
        this.opponentSelectedWord = this.gridService.opponentSelectedWord;

    }
    public toggleTipMode(): void {
        if (this.horizontalWords[0].word === undefined) {
            this.gridService.fetchCheatModeWords(this.horizontalWords, this.verticalWords);
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
