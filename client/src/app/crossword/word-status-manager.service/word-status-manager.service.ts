import { Injectable } from "@angular/core";
import { CommunicationService } from "../communication.service";
import { SelectedWord, AssociatedPlayers, WordDescription } from "./../dataStructures";

@Injectable()
export class WordStatusManagerService {

  public constructor(private communicationService: CommunicationService) { }

  public setSelectedWord(
    target: SelectedWord, word: WordDescription, selected: boolean, id: string, nbPlayers: number): WordDescription {
    if (nbPlayers === 2 && target.player === AssociatedPlayers.PLAYER) {
      console.log("sending");
      this.communicationService.sendSelectionStatus({ gameId: id, wordId: word !== null ? word.id : null });
    }

    if (target.word === word) {
      return null;
    }
    if (target.word !== null) {
      this.setWordSelectedState(target, target.word, false);
      target.word = null;
    }
    if (word !== null && selected) {
      this.setWordSelectedState(target, word, true);
      target.word = word;
    }

    return target.word;
  }

  private setWordSelectedState(target: SelectedWord, word: WordDescription, selected: boolean): void {
    for (const cell of word.cells) {
      if (selected) {
        cell.selectedBy = cell.selectedBy | target.player;
      } else {
        cell.selectedBy = cell.selectedBy & ~target.player;
      }
    }
  }
}
