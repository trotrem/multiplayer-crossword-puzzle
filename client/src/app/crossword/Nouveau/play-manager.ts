import { WordDescription } from "./../dataStructures";
import { IWordValidationPayload } from "../../../../../common/communication/events";
import { CommunicationService } from "../communication.service";

export class PlayManager {
    public  static write(
        char: string, word: WordDescription, words: WordDescription[], id: string, communicationService: CommunicationService): void {
        for (const cell of word.cells) {
            if (cell.content === "") {
                cell.content = char;
                this.validate(word, id, communicationService);
                this.wordFoundByOtherWord(words, id, communicationService);

                return;
            }
        }
    }
    public  static erase(word: WordDescription): void {
        let i: number;
        for (i = word.cells.length - 1; i >= 0; i--) {
            if (word.cells[i].content !== "" && !word.cells[i].letterFound) {
                word.cells[i].content = "";

                return;
            }
        }
    }
    private static validate(word: WordDescription, id: string, communicationService: CommunicationService): void {
        const parameters: IWordValidationPayload = {
            gameId: id,
            wordIndex: word.id,
            word: word.cells.map((elem) => elem.content).join("")
        };
        communicationService.validate(parameters);
    }

    private static wordFoundByOtherWord(words: WordDescription[], id: string, communicationService: CommunicationService): void {
        for (const word of words) {
            this.validate(word, id, communicationService);
        }
    }

}
