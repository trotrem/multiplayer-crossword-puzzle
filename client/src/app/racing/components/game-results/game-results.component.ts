import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RacingCommunicationService } from "../../communication.service/communicationRacing.service";
import { NewScores, BestScores} from "../../../../../../common/communication/interfaces";
import { inject } from "inversify";
import { NgForm } from "@angular/forms";
import * as THREE from "three";
import { Track } from "../../track";
const DELAY: number = 1000;

@Component({
  selector: "app-game-results",
  templateUrl: "./game-results.component.html",
  styleUrls: ["./game-results.component.css"]
})
export class GameResultsComponent implements OnInit {

  private _scores: NewScores[];
  private _bestScores: BestScores[];
  private _track: Track;

  public constructor(
    private route: ActivatedRoute, @inject(RacingCommunicationService) private communicationService: RacingCommunicationService) {
    this._scores = new Array< NewScores>();
    this._bestScores = new Array<BestScores>();
    this._track  = {
      name: "", description: "", startingZone: new THREE.Line3, points: new Array<THREE.Vector3>(), usesNumber: 0,
      newScores: new Array< NewScores>(),  bestScores: new Array< BestScores>()
  };
  }
  public get scores(): NewScores[] {
    return this._scores;
  }
  public get bestScores(): BestScores[] {
    return this._bestScores;
  }
  public async ngOnInit(): Promise<void> {
    const name: string = this.route.snapshot.paramMap.get("name");
    if (name !== null) {
      await this.getTrack(name);
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
        this._bestScores = res[0].bestScores;
      });
  }
  public onSubmit(f: NgForm): void {
    this._track.bestScores.push({name: f.value.description, score: this._scores[0].scores[0]});
    // this._submitValid = true;
  }

  public notReadyToSubmit(): boolean {
  return this._bestScores.length < 5;

  }
  public savetrack(): void {
  this.communicationService.updateBestScore(this._track);

  }
}
