import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { GameResult } from "../../../../../../common/communication/types-crossword";
import { CommunicationService } from "../../services/communication/communication.service";
import { GameConfigurationService } from "../../services/game-configuration/game-configuration.service";

const VICTORY_MESSAGE: string = "Congratulations!!! You won!";
const DEFEAT_MESSAGE: string = "Aw you lost.. Better luck next time!";
const TIE_MESSAGE: string = "It's a tie!";
const ERROR_MESSAGE: string = "Something's wrong";

@Component({
    selector: "app-end-game",
    templateUrl: "./end-game.component.html",
    styleUrls: ["./end-game.component.css"]
})
export class EndGameComponent {

    public constructor(
        private router: Router,
        private route: ActivatedRoute,
        private communicationService: CommunicationService,
        private gameConfig: GameConfigurationService) {

        if (gameConfig.nbPlayers === 2) {
            this.onRematchRequest();
        }
    }

    public getMessage(): string {
        const result: GameResult = Number(this.route.snapshot.paramMap.get("result"));

        return result === GameResult.Victory ? VICTORY_MESSAGE :
            result === GameResult.Defeat ? DEFEAT_MESSAGE :
                result === GameResult.Tie ? TIE_MESSAGE :
                    ERROR_MESSAGE;
    }

    public playSameCongif(): void {
        this.communicationService.prepareGridFetching();
        this.communicationService.sendRequestRematch();
        if (this.gameConfig.nbPlayers === 2) {
            this.router.navigate(["waiting"]);
        } else {
            this.router.navigate(["game"]);
        }
    }

    public returnHome(): void {
        this.router.navigateByUrl("");
    }
    private onRematchRequest(): void {
        this.communicationService.onRematchRequested().subscribe(() => {
            if (confirm("Your opponent requested a rematch!\nPlay again?")) {
                this.playSameCongif();
            }
        });
    }
}
