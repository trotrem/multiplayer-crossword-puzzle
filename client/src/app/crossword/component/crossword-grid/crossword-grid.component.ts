import { Component, OnInit, HostListener } from "@angular/core";
import { Difficulty, NbPlayers, } from "../../../../../../common/communication/types-crossword";
import { GridEventService } from "../../services/grid-event/grid-event.service";
import { GameConfigurationService } from "./../../services/game-configuration/game-configuration.service";
import { WordDescription, Cell } from "../../dataStructures";
import { GridManager } from "./../../services/grid-manager/grid-manager.service";
import { PlayManagerService } from "./../../services/play-manager/play-manager.service";
import { WordStatusManagerService } from "../../services/word-status-manager/word-status-manager.service";

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
    public playerName: string;
    public opponentName: string;
    public selectedWord: WordDescription;
    public opponentSelectedWord: WordDescription;
    // needed so the html recognizes the enum
    public TipMode: typeof TipMode = TipMode;
    public tipMode: TipMode;
    private words: WordDescription[];

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
        private gridEventService: GridEventService,
        private gameConfiguration: GameConfigurationService,
        private gridManager: GridManager) { }

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
        this.tipMode = this.tipMode === TipMode.Definitions ? TipMode.Cheat : TipMode.Definitions;
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

    @HostListener("document:click")
    public onBackgroundClick(): void {
        if (this.gridManager.isStarted) {
            this.selectedWord = this.gridEventService.setPlayerSelectedWord(null, false);
        }
    }
}
