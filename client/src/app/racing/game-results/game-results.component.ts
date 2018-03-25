import { Component, OnInit } from "@angular/core";
import { Car } from "./../car/car";
import { ActivatedRoute, Router } from "@angular/router";
import { RenderService } from "../render-service/render.service";
import { CommunicationRacingService } from "../communication.service/communicationRacing.service";
import { HttpClient } from "@angular/common/http";
import { Track } from "./../track";

const CARS_MAX: number = 4;

@Component({
  selector: "app-game-results",
  templateUrl: "./game-results.component.html",
  styleUrls: ["./game-results.component.css"]
})
export class GameResultsComponent implements OnInit {

  private communicationService: CommunicationRacingService;
  private scores: number[];

  public constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.communicationService = new CommunicationRacingService(http);
  }

  public ngOnInit(): void {
    const name: string = this.route.snapshot.paramMap.get("name");
    if (name !== null) {
      this.getTrack(name);
    }
  }

  private delay(ms: number): Promise<boolean> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

  private async getTrack(name: string): Promise<void> {
    await this.delay(1000);
    this.communicationService.getTrackByName(name)
      .subscribe((res: Track[]) => {
        this.scores = res[0].newScores;
        console.log("here");
      });
  }

}
