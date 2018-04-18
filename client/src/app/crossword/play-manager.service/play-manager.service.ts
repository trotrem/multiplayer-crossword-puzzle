import { Injectable } from "@angular/core";
import { CommunicationService } from "../communication.service";
import { WordDescription } from "./../dataStructures";
import { IWordValidationPayload } from "../../../../../common/communication/events";

@Injectable()
export class PlayManagerService {

    public constructor(private communicationService: CommunicationService) { }

    public write(
        char: string, word: WordDescription, words: WordDescription[], id: string): void {
        for (const cell of word.cells) {
            if (cell.content === "") {
                cell.content = char;
                this.validate(word, id);
                this.wordFoundByOtherWord(words, id);

                return;
            }
        }
    }

    public erase(word: WordDescription): void {
        let i: number;
        for (i = word.cells.length - 1; i >= 0; i--) {
            if (word.cells[i].content !== "" && !word.cells[i].letterFound) {
                word.cells[i].content = "";

                return;
            }
        }
    }

    /********************************************************************************************************* */
    private validate(word: WordDescription, id: string): void {
        const parameters: IWordValidationPayload = {
            gameId: id,
            wordIndex: word.id,
            word: word.cells.map((elem) => elem.content).join("")
        };
        this.communicationService.sendEventOnValidatedWord(parameters);
    }

    private wordFoundByOtherWord(words: WordDescription[], id: string): void {
        for (const word of words) {
            this.validate(word, id);
        }
    }

}
