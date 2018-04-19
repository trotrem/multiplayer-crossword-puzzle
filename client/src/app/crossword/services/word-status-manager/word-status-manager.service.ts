import { Injectable } from "@angular/core";
import { CommunicationService } from "../communication/communication.service";
import { SelectedWord, AssociatedPlayers, WordDescription } from "./../../dataStructures";
import { GameConfigurationService } from "../game-configuration/game-configuration.service";

@Injectable()
export class WordStatusManagerService {

    private gameConfigurationService: GameConfigurationService;

    public constructor(private communicationService: CommunicationService) {
    }

    public initialize(gameConfigurationService: GameConfigurationService): void {
        this.gameConfigurationService = gameConfigurationService;
    }

    public setSelectedWord(
        target: SelectedWord, word: WordDescription, setSelected: boolean, id: string): WordDescription {
        if (this.gameConfigurationService.nbPlayers === 2 && target.player === AssociatedPlayers.PLAYER) {
            this.communicationService.sendSelectionStatus({ gameId: id, wordId: word !== null ? word.id : null });
        }
        if (target.word === word) {
            return null;
        }
        if (target.word !== null) {
            this.setWordSelectedState(target, target.word, false);
            target.word = null;
        }
        if (word !== null && setSelected) {
            this.setWordSelectedState(target, word, true);
            target.word = word;
        }

        return target.word;
    }
    // TODO repare
    private setWordSelectedState(target: SelectedWord, word: WordDescription, setSelected: boolean): void {
        for (const cell of word.cells) {
            cell.selectedBy = setSelected ?
                cell.selectedBy | target.player :
                cell.selectedBy & ~target.player;
        }
    }
}