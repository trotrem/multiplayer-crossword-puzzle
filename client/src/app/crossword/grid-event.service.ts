import { Injectable } from "@angular/core";
import { WordDescription } from "./wordDescription";
import { IWordValidationParameters, Difficulty, ICrosswordSettings, NbPlayers } from "../../../../common/communication/types";
import { Cell, FoundStatus } from "./cell";
import { CommunicationService } from "./communication.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Subscription } from "rxjs/Subscription";
import { IValidationData } from "../../../../common/communication/events";

const BACKSPACE: number = 8;
const DELETE: number = 46;
const UPPER_A: number = 65;
const UPPER_Z: number = 90;
const LOWER_A: number = 97;
const LOWER_Z: number = 122;

@Injectable()
export class GridEventService {
    private _selectedWord: WordDescription = null;
    private _words: WordDescription[];
    private _id: number;
    private _crosswordSettings: ICrosswordSettings;

    public constructor(
        private communicationService: CommunicationService,
        private router: Router) {
    }

    public initialize(words: WordDescription[], nbPlayers: NbPlayers): void {
        this._words = words;
        this._crosswordSettings = { difficulty: Difficulty.Easy, nbPlayers: nbPlayers };
    }

    public setSelectedWord(word: WordDescription, selected: boolean): WordDescription {
        if (this._selectedWord === word) {
            return null;
        }
        if (this._selectedWord !== null) {
            this.setWordSelectedState(this._selectedWord, false);
            this._selectedWord = null;
        }
        if (word !== null && selected) {
            this.setWordSelectedState(word, true);
            this._selectedWord = word;
        }

        return this._selectedWord;
    }

    private setWordSelectedState(word: WordDescription, selected: boolean): void {
        for (const cell of word.cells) {
            cell.selected = selected;
        }
    }

    public onCellClicked(event: MouseEvent, cell: Cell): WordDescription {
        if (cell.letterFound) {
            return null;
        }
        event.stopPropagation();
        for (const word of this._words) {
            if (word.cells[0] === cell && word !== this._selectedWord) {

                return this.setSelectedWord(word, true);
            }
        }
        for (const word of this._words) {
            if (word.cells.indexOf(cell) !== -1 && word !== this._selectedWord) {

                return this.setSelectedWord(word, true);
            }
        }

        return this._selectedWord;
    }

    public onIndexClicked(event: MouseEvent, word: WordDescription): WordDescription {
        if (word.found) {
            return null;
        }
        event.stopPropagation();

        return this.setSelectedWord(word, true);
    }

    public onKeyPress(event: KeyboardEvent): void {
        if (this._selectedWord !== null) {
            if (event.keyCode >= UPPER_A &&
                event.keyCode <= UPPER_Z ||
                event.keyCode >= LOWER_A &&
                event.keyCode <= LOWER_Z) {
                this.write(String.fromCharCode(event.keyCode).toUpperCase(), this._selectedWord);
            }
            if (event.keyCode === BACKSPACE || event.keyCode === DELETE) {
                this.erase(this._selectedWord);
            }
        }
    }

    private write(char: string, word: WordDescription): void {
        for (const cell of word.cells) {
            if (cell.content === "") {
                cell.content = char;
                this.validate(word);
                this.wordFoundByOtherWord();

                return;
            }
        }
    }

    private erase(word: WordDescription): void {
        let i: number;
        for (i = word.cells.length - 1; i >= 0; i--) {
            if (word.cells[i].content !== "" && !word.cells[i].letterFound) {
                word.cells[i].content = "";

                return;
            }
        }
    }

    private validate(word: WordDescription): void {
        const parameters: IWordValidationParameters = {
            gridId: this._id,
            wordIndex: word.id,
            word: word.cells.map((elem) => elem.content).join("")
        };
        this.communicationService.validate(parameters);
    }

    public onWordValidated(data: IValidationData): void {
        const word: WordDescription = this._words[data.index];
        const foundStatus: FoundStatus = data.validatedByReceiver ? FoundStatus.PLAYER : FoundStatus.OPPONENT;
        if (data) {
            for (let i: number = 0; i < word.cells.length; i++) {
                word.cells[i].letterFound = (foundStatus !== word.cells[i].letterFound && word.cells[i].letterFound !== FoundStatus.NOT) ?
                    FoundStatus.BOTH :
                    foundStatus;

                word.cells[i].content = data.word[i];
            }
            word.found = foundStatus;
        }
        this.validateGrid();
    }

    // TODO only check crossing word
    private wordFoundByOtherWord(): void {
        for (const word of this._words) {
            this.validate(word);
        }
    }

    private validateGrid(): void {
        for (const word of this._words) {
            if (!word.found) {
                return;
            }
        }
        this.openEndGame();
    }

    private openEndGame(): void {
        this.router.navigate(["/crossword/endGame"]);
    }

    public setNbPlayers(nbPlayers: NbPlayers): void {
        this._crosswordSettings.nbPlayers = nbPlayers;
    }

    public setDifficulty(difficulty: Difficulty): void {
        this._crosswordSettings.difficulty = difficulty;
    }

    public getDifficulty(): Difficulty {
        return this._crosswordSettings.difficulty;
    }

    public setId(id: number): void {
        this._id = id;
    }

    public getId(): number {
        return this._id;
    }
}
