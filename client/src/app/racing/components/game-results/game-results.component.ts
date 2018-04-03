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
  private _track: Track;

  public constructor(
    private route: ActivatedRoute, @inject(RacingCommunicationService) private communicationService: RacingCommunicationService) {
    this._scores = new Array< NewScores>();
    this._track  = {
      name: "", description: "", startingZone: new THREE.Line3, points: new Array<THREE.Vector3>(), usesNumber: 0,
      newScores: new Array< NewScores>(),  bestScores: new Array< BestScores>()
  };
  }
  public get scores(): NewScores[] {
    return this._scores;
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
      });
  }
 /* public onSubmit(f: NgForm): void {
    this._track.description = f.value.description;
    this._track.name = f.value.name;
    // this._submitValid = true;
  }

  /*public notReadyToSubmit(): boolean {
  return !this.sceneService.getIsClosed() || !this.sceneService.getTrackValid();

  }
  public savetrack(): void {
  // this._track.points = this.sceneService.getPoints();
  this._track.startingZone = new THREE.Line3(this._track.points[0], this._track.points[1]);
  this.communicationService.deleteTrack(this._track);
  this.communicationService.saveTrack(this._track);
  }*/
}
