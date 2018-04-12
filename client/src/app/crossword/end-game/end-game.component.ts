import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Difficulty } from "./../../../../../common/communication/types";

/* tslint:disable:no-magic-numbers no-floating-promises */

@Component({
  selector: "app-end-game",
  templateUrl: "./end-game.component.html",
  styleUrls: ["./end-game.component.css"]
})
export class EndGameComponent implements OnInit {
  private _difficulty: Difficulty = Difficulty.Easy;

  public constructor(private route: ActivatedRoute, private router: Router) { }

  public ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this._difficulty = params["Difficulty"];
    });
  }

  public playSameCongif(): void {
    this.router.navigate(["/crossword/game/" + this._difficulty]);
  }

  public returnHome(): void {
    this.router.navigateByUrl("/homePage");
  }
}
