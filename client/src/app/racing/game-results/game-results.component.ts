import { Component, OnInit } from "@angular/core";
import { Car } from "./../car/car";
import { ActivatedRoute, Router } from "@angular/router";
import { RenderService } from "../render-service/render.service";

@Component({
  selector: "app-game-results",
  templateUrl: "./game-results.component.html",
  styleUrls: ["./game-results.component.css"]
})
export class GameResultsComponent implements OnInit {

  private renderService: RenderService;
  public constructor(private route: ActivatedRoute, private router: Router) {
    this.renderService = new RenderService(router);
  }

  public ngOnInit(): void {
    // console.warn(this.renderService.getCars()[0].getLabTimes());
  }

}
