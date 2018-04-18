import { Injectable } from "@angular/core";
import { GameResult } from "../../../../../common/communication/types";
import { CommunicationService } from "./../communication.service";
import { Router } from "@angular/router";
import { IValidationData, IWordSelection, IGameResult } from "../../../../../common/communication/events";
import { WordDescription, Cell, AssociatedPlayers, SelectedWord } from "./../dataStructures";
import { PlayManagerService } from "../play-manager.service/play-manager.service";
import { WordStatusManagerService } from "../word-status-manager.service/word-status-manager.service";
import { GameConfigurationService } from "../game-configuration.service";

const BACKSPACE: number = 8;
const DELETE: number = 46;
const UPPER_A: number = 65;
const UPPER_Z: number = 90;
const LOWER_A: number = 97;
const LOWER_Z: number = 122;

@Injectable()
export class GridEventService {
    private _selectedWord: SelectedWord = { player: AssociatedPlayers.PLAYER, word: null };
    private _opponentSelectedWord: SelectedWord = { player: AssociatedPlayers.OPPONENT, word: null };
    private _words: WordDescription[];
    private _id: string;

    public constructor(
        private communicationService: CommunicationService,
        private playManagerService: PlayManagerService,
        private wordStatusManagerService: WordStatusManagerService,
        private gameConfigurationService: GameConfigurationService,
        private router: Router) {
    }

    public initialize(words: WordDescription[], id: string): void {
        this.wordStatusManagerService.initialize(this.gameConfigurationService);
        this._id = id;
        this._words = words;
        if (this.gameConfigurationService.nbPlayers === 2) {
            this.subscribeToOpponentSelection();
        }
        this.subscribeToGameEnded();
    }

    private subscribeToGameEnded(): void {
        this.communicationService.sendEventOnGameEnded().subscribe((data: IGameResult) => {

            this.openEndGame(data.result);
        });
    }

    private subscribeToOpponentSelection(): void {
        this.communicationService.sendEventOnOpponentSelectedWord().subscribe((word: IWordSelection) => {
            this.wordStatusManagerService.setSelectedWord(
                this._opponentSelectedWord, word.wordId !== null ? this._words[word.wordId] : null,
                true, this._id);
        });
    }

    public setPlayerSelectedWord(word: WordDescription, selected: boolean): WordDescription {
        return this.wordStatusManagerService.setSelectedWord(
            this._selectedWord, word, selected, this._id);
    }

    public onCellClicked(event: MouseEvent, cell: Cell): WordDescription {
        if (cell.letterFound) {
            return null;
        }
        event.stopPropagation();
        for (const word of this._words) {
            if (word.cells[0] === cell && word !== this._selectedWord.word) {

                return this.wordStatusManagerService.setSelectedWord(
                    this._selectedWord, word, true, this._id);
            }
        }
        for (const word of this._words) {
            if (word.cells.indexOf(cell) !== -1 && word !== this._selectedWord.word) {

                return this.wordStatusManagerService.setSelectedWord(
                    this._selectedWord, word, true, this._id);
            }
        }

        return this._selectedWord.word;
    }

    public onIndexClicked(event: MouseEvent, word: WordDescription): WordDescription {
        if (word.found) {
            return null;
        }
        event.stopPropagation();

        return this.wordStatusManagerService.setSelectedWord(
            this._selectedWord, word, true, this._id);
    }

    public onKeyPress(event: KeyboardEvent): void {
        if (this._selectedWord !== null) {
            if (event.keyCode >= UPPER_A &&
                event.keyCode <= UPPER_Z ||
                event.keyCode >= LOWER_A &&
                event.keyCode <= LOWER_Z) {
                this.playManagerService.write(
                    String.fromCharCode(event.keyCode).toUpperCase(),
                    this._selectedWord.word, this._words, this._id);
            }
            if (event.keyCode === BACKSPACE || event.keyCode === DELETE) {
                this.playManagerService.erase(this._selectedWord.word);
            }
        }
    }
    public onWordValidated(data: IValidationData): void {
        const word: WordDescription = this._words[data.index];
        const foundStatus: AssociatedPlayers = data.validatedByReceiver ? AssociatedPlayers.PLAYER : AssociatedPlayers.OPPONENT;
        if (data) {
            for (let i: number = 0; i < word.cells.length; i++) {
                word.cells[i].letterFound =
                    (foundStatus !== word.cells[i].letterFound && word.cells[i].letterFound !== AssociatedPlayers.NONE) ?
                        AssociatedPlayers.BOTH :
                        foundStatus;

                word.cells[i].content = data.word[i];
            }
            word.found = foundStatus;
        }
    }

    private openEndGame(result: GameResult): void {
        this.router.navigate(["/crossword/endGame/" + result]);
    }

    public getId(): string {
        return this._id;
    }
}
