import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-end-game",
  templateUrl: "./end-game.component.html",
  styleUrls: ["./end-game.component.css"]
})
export class EndGameComponent {

  public constructor(private router: Router) { }

  public playSameCongif(): void {
    this.router.navigate(["/crossword/game"]);
  }

  public returnHome(): void {
    this.router.navigateByUrl("crossword/homePage");
  }
}
