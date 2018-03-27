import { Component, OnInit } from "@angular/core";
import { ActivatedRoute} from "@angular/router";
import { RacingCommunicationService } from "../../communication.service/communicationRacing.service";
import { Track } from "./../../track";
import { inject } from "inversify";
const DELAY: number = 1000;

@Component({
  selector: "app-game-results",
  templateUrl: "./game-results.component.html",
  styleUrls: ["./game-results.component.css"]
})
export class GameResultsComponent implements OnInit {

  private _scores: number[];

  public constructor(
    private route: ActivatedRoute,  @inject(RacingCommunicationService) private communicationService: RacingCommunicationService) {
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

  private async delay(ms: number): Promise<{}> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async getTrack(name: string): Promise<void> {
    await this.delay(DELAY);
    this.communicationService.getTrackByName(name)
      .then((res: Track[]) => {
        this._scores = res[0].newScores;
      });
  }

}
