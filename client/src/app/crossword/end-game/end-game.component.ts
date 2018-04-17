import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { GameResult } from "../../../../../common/communication/types";

@Component({
  selector: "app-end-game",
  templateUrl: "./end-game.component.html",
  styleUrls: ["./end-game.component.css"]
})
export class EndGameComponent {

    public constructor(private router: Router, private route: ActivatedRoute) { }

    public get message(): string {
        const result: GameResult = Number(this.route.snapshot.paramMap.get("result"));

        return result === GameResult.Victory ? "Congratulations!!! You won!" :
            result === GameResult.Defeat ? "Aw you lost.. Better luck next time!" :
            result === GameResult.Tie ? "It's a tie!" :
             "Something's wrong";
    }

    public playSameCongif(): void {
        this.router.navigate(["crossword/game"]);
    }

    public returnHome(): void {
        this.router.navigateByUrl("crossword/homePage");
    }
}
