import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommunicationRacingService } from "../../communication.service/communicationRacing.service";
import { HttpClient } from "@angular/common/http";
import { Track } from "./../../track";
const DELAY: number = 1000;

@Component({
  selector: "app-game-results",
  templateUrl: "./game-results.component.html",
  styleUrls: ["./game-results.component.css"]
})
export class GameResultsComponent implements OnInit {

  private communicationService: CommunicationRacingService;
  private _scores: number[];

  public constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.communicationService = new CommunicationRacingService(http);
    this._scores = new Array<number>();
  }
  public get scores(): number[] {
    return this._scores;
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

  public async getTrack(name: string): Promise<void> {
    await this.delay(DELAY);
    this.communicationService.getTrackByName(name)
      .subscribe((res: Track[]) => {
        this._scores = res[0].newScores;
      });
  }

}
