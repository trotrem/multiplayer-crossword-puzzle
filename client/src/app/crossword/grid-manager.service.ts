import { Injectable } from "@angular/core";
import { Direction, Difficulty } from "./../../../../common/communication/types-crossword";
import { CommunicationService } from "./communication.service";
import { GridEventService } from "./grid-event.service/grid-event.service";
import { GameConfigurationService } from "./game-configuration.service";
import { WordDescription, AssociatedPlayers, Cell } from "./dataStructures";
import { GridCreator } from "./grid-creator";

const GRID_WIDTH: number = 10;
const GRID_HEIGHT: number = 10;

@Injectable()
export class GridManager {
    private _cells: Cell[][];
    private _words: WordDescription[];
    private _selectedWord: WordDescription = null;
    private _opponentSelectedWord: WordDescription = null;
    private _isStarted: boolean;

    public get cells(): Cell[][] {
        return this._cells;
    }
    public get words(): WordDescription[] {
        return this._words;
    }
    public get selectedWord(): WordDescription {
        return this._selectedWord;
    }
    public get opponentSelectedWord(): WordDescription {
        return this._opponentSelectedWord;
    }
    public getHorizontalWords(): WordDescription[] {
        return this._words.filter((word) => word.direction === Direction.Horizontal);
    }

    public getVerticalWords(): WordDescription[] {
        return this._words.filter((word) => word.direction === Direction.Vertical);
    }

    public getNbPlayerFoundWords(): number {
        return this._words.filter((word) => word.found === AssociatedPlayers.PLAYER).length;
    }

    public getNbOpponentFoundWords(): number {
        return this._words.filter((word) => word.found === AssociatedPlayers.OPPONENT).length;
    }

    public get isStarted(): boolean {
        return this._isStarted;
    }

    public constructor(
        private gameConfiguration: GameConfigurationService,
        private communicationService: CommunicationService,
        private gridEventService: GridEventService,
    ) {
        this._cells = this.formGrid();
        this._words = new Array<WordDescription>();
        this._selectedWord = null;
        this._opponentSelectedWord = null;
        this.subscriptions();
        this._isStarted = false;
    }

    public fetchCheatModeWords(horizontalWords: WordDescription[], verticalWords: WordDescription[]): void {
        this.communicationService.fetchCheatModeWords(this.gridEventService.id)
            .subscribe((data: string[]) => {
                const words: string[] = data as string[];
                let i: number = 0;
                for (const word of horizontalWords.concat(verticalWords)) {
                    word.word = words[i];
                    i++;
                }
            });
    }

    private formGrid(): Cell[][] {
        const cells: Cell[][] = new Array<Array<Cell>>();
        for (let i: number = 0; i < GRID_HEIGHT; i++) {
            cells[i] = new Array<Cell>();
            for (let j: number = 0; j < GRID_WIDTH; j++) {
                cells[i].push({
                    content: "",
                    selectedBy: AssociatedPlayers.NONE,
                    isBlack: false,
                    letterFound: AssociatedPlayers.NONE
                });
            }
        }

        return cells;
    }

    private subscriptions(): void {
        this.subscribeToGridFetched();
        this.subscribeToValidation();
    }
    private subscribeToGridFetched(): void {
        void this.communicationService.gridPromise
            .then((data) => {
                this._cells = GridCreator.createGrid(
                    data, this.gridEventService, this._words, this.gameConfiguration.nbPlayers, this._cells);
                this._words = GridCreator.fillWords(data, this._cells, this._words);
                this._isStarted = true;
            });
    }
    private subscribeToValidation(): void {
        this.communicationService.returnDataOnWordValidation().subscribe((data) => {
            this.gridEventService.onWordValidated(data);
        });
    }
}
