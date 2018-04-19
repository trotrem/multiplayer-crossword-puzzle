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

    /*Nous avons décider de disable ce ts-lint car il est beaucoup plus propre et plus simple que de
    /*faire plusieurs conditions. Nous avons vérifié les raisons de ce tslint : plus difficile à maintenir
    /*et la possiblité d'un typo entre les opérations booléennes et binaires. Dans le premier cas, comme
    /*expliqué plus tôt, il est selon nous plus simple d'utiliser les opérations binaires. Pour le deuxième,
    /*nous sommes bien au courant que ce ne sont pas des opérations booléennes mais bien des oéprations binaires.
    /*Cette décision est réfléchi et donc aucune erreur que tslint tente d'éviter n'est possible. Merci de
    /*prendre cette explication en considération.*/

    // tslint:disable:no-bitwise
    private setWordSelectedState(target: SelectedWord, word: WordDescription, setSelected: boolean): void {
        for (const cell of word.cells) {
            cell.selectedBy = setSelected ?
                cell.selectedBy | target.player :
                cell.selectedBy & ~target.player;
        }
    }
}
