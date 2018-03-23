import { Component, OnInit } from "@angular/core";
import { Car } from "./../car/car";

@Component({
  selector: "app-game-results",
  templateUrl: "./game-results.component.html",
  styleUrls: ["./game-results.component.css"]
})
export class GameResultsComponent implements OnInit {

  private cars: Car[];

  public constructor() { }

  public ngOnInit(): void {
  }

}
