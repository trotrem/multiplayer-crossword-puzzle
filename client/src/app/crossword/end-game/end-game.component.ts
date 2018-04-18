import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { GameResult } from "../../../../../common/communication/types";
import { CommunicationService } from "../communication.service";
import { GameConfigurationService } from "../game-configuration.service";

@Component({
    selector: "app-end-game",
    templateUrl: "./end-game.component.html",
    styleUrls: ["./end-game.component.css"]
})
export class EndGameComponent {

    public constructor(private router: Router, private route: ActivatedRoute, private communicationService: CommunicationService, private gameConfig: GameConfigurationService) {
        if (gameConfig.nbPlayers === 2) {
            this.onRematchRequest();
        }
    }

    public get message(): string {
        const result: GameResult = Number(this.route.snapshot.paramMap.get("result"));
        // TODO: string magiques?
        return result === GameResult.Victory ? "Congratulations!!! You won!" :
            result === GameResult.Defeat ? "Aw you lost.. Better luck next time!" :
            result === GameResult.Tie ? "It's a tie!" :
             "Something's wrong";
    }

    public playSameCongif(): void {
        this.communicationService.prepareGridFetching();
        this.communicationService.sendRequestRematch();
        if (this.gameConfig.nbPlayers === 2) {
            this.router.navigate(["crossword/waiting"]);
        } else {
            this.router.navigate(["crossword/game"]);
        }
    }

    public returnHome(): void {
        this.router.navigateByUrl("crossword/homePage");
    }
    // TODO: montrer la séléection de l'index dans le ui du crossword
    private onRematchRequest(): void {
        this.communicationService.onRematchRequested().subscribe(() => {
            if (confirm("Your opponent requested a rematch!\nPlay again?")) {
                this.playSameCongif();
            }
        });
    }
}
