import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { GameResult } from "../../../../../../common/communication/types";

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

    public constructor(private router: Router, private route: ActivatedRoute) { }

    public get message(): string {
        const result: GameResult = Number(this.route.snapshot.paramMap.get("result"));

        return result === GameResult.Victory ? VICTORY_MESSAGE :
               result === GameResult.Defeat ? DEFEAT_MESSAGE :
               result === GameResult.Tie ? TIE_MESSAGE :
               ERROR_MESSAGE;
    }

    public playSameCongif(): void {
        this.router.navigate(["crossword/game"]);
    }

    public returnHome(): void {
        this.router.navigateByUrl("crossword/homePage");
    }
}
