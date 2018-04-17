import { Component, OnInit, Input, HostListener } from "@angular/core";
import { Direction, Difficulty, NbPlayers, IPoint, IWordInfo } from "./../../../../common/communication/types";
import { CommunicationService } from "./communication.service";
import { GridEventService } from "./grid-event.service";
import { SocketsService } from "./sockets.service";
import { CrosswordEvents, IGridData } from "./../../../../common/communication/events";
import { GameConfigurationService } from "./game-configuration.service";
import { WordDescription, AssociatedPlayers, Cell } from "./dataStructures";
import { GridCreator } from "./grid-creator";

export class GridService implements OnInit {
    public cells: Cell[][];
    // needed so the html recognizes the enum
    public NbPlayers: typeof NbPlayers = NbPlayers;
    public nbPlayers: number;
    private words: WordDescription[];
    private _difficulty: Difficulty = Difficulty.Easy;
    private _playerName: string;
    public selectedWord: WordDescription = null;
    public opponentSelectedWord: WordDescription = null;

    public constructor(
        private gameConfiguration: GameConfigurationService,
        private communicationService: CommunicationService,
        private gridEventService: GridEventService,
        private gridCreator: GridCreator
    ) { }

    public ngOnInit(): void {
        this.nbPlayers = this.gameConfiguration.nbPlayers;
        this._difficulty = this.gameConfiguration.difficulty;
        this._playerName = this.gameConfiguration.playerName;
        // TODO sketch
        this.subscribeToGridFetched();
        this.subscribeToValidation();
    }
    private subscribeToGridFetched(): void {
        this.communicationService.gridPromise
            .then((data) => {
                this.cells = GridCreator.createGrid(data, this.gridEventService, this.words, this.nbPlayers, this.cells);
                this.words = GridCreator.fillWords(data, this.cells, this.words);
            });
    }
    private subscribeToValidation(): void {
        this.communicationService.onValidation().subscribe((data) => {
            this.gridEventService.onWordValidated(data);
        });
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
