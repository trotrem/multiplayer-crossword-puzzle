import { Component, OnInit, HostListener } from "@angular/core";
import { Difficulty, NbPlayers, } from "../../../../../../common/communication/types-crossword";
import { CommunicationService } from "../../communication.service";
import { GridEventService } from "../../grid-event.service/grid-event.service";
import { SocketsService } from "../../sockets.service";
import { CrosswordEvents, } from "../../../../../../common/communication/events-crossword";
import { GameConfigurationService } from "../../game-configuration.service";
import { WordDescription, Cell } from "../../dataStructures";
import { GridManager } from "../../grid-manager.service";
import { PlayManagerService } from "../../play-manager.service/play-manager.service";
import { WordStatusManagerService } from "../../word-status-manager.service/word-status-manager.service";

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
    // TODO: use enum
    // needed so the html recognizes the enum
    public NbPlayers: typeof NbPlayers = NbPlayers;
    public nbPlayers: number;
    public playerName: string;
    public opponentName: string;
    public selectedWord: WordDescription = null;
    public opponentSelectedWord: WordDescription = null;
    // needed so the html recognizes the enum
    public TipMode: typeof TipMode = TipMode;
    public tipMode: TipMode;
    private words: WordDescription[];

    // TODO: fix
    @HostListener("document:click")
    public onBackgroundClick(): void {
        if (this.gridManager.isStarted) {
            this.selectedWord = this.gridEventService.setPlayerSelectedWord(null, false);
        }
    }

    public get difficultyString(): string {
        return Difficulty[this.gameConfiguration.difficulty];
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
        private socketsService: SocketsService) { }

    public ngOnInit(): void {
        this.nbPlayers = this.gameConfiguration.nbPlayers;
        this.playerName = this.gameConfiguration.playerName;
        this.opponentName = this.gameConfiguration.opponentName;
        this.cells = this.gridManager.cells;
        this.words = this.gridManager.words;
        this.selectedWord = this.gridManager.selectedWord;
        this.opponentSelectedWord = this.gridManager.opponentSelectedWord;
        this.tipMode = TipMode.Definitions;
    }

    public toggleTipMode(): void {
        if (this.horizontalWords[0].word === undefined) {
            this.gridManager.fetchCheatModeWords(this.horizontalWords, this.verticalWords);
        }
        this.tipMode === TipMode.Definitions ? this.tipMode = TipMode.Cheat : this.tipMode = TipMode.Definitions; // TODO: REFACTOR
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
