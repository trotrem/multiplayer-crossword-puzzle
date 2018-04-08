import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RacingCommunicationService } from "../../communication.service/communicationRacing.service";
import { INewScores, IBestScores} from "../../../../../../common/communication/interfaces";
import { inject } from "inversify";
import { NgForm } from "@angular/forms";
import * as THREE from "three";
import { Track } from "../../track";
import {LAP_MAX} from "../../../constants";
const DELAY: number = 1000;
const BEST_SCORES_MAX: number = 5;

@Component({
  selector: "app-game-results",
  templateUrl: "./game-results.component.html",
  styleUrls: ["./game-results.component.css"]
})
export class GameResultsComponent implements OnInit {

  private _scores: INewScores[];
  private _IBestScores: IBestScores[];
  private _newIBestScore: IBestScores;
  private _track: Track;
  private _isAdded: boolean;

  public constructor(private router: Router , private route: ActivatedRoute,
                     @inject(RacingCommunicationService) private communicationService: RacingCommunicationService) {
    this._scores = new Array< INewScores>();
    this._IBestScores = new Array<IBestScores>();
    this._newIBestScore = {name: "", score: 0};
    this._track  = {
      name: "", description: "", startingZone: new THREE.Line3, points: new Array<THREE.Vector3>(), usesNumber: 0,
      INewScores: new Array< INewScores>(),  IBestScores: new Array< IBestScores>()
  };
    this._isAdded = false;
  }
  public get scores(): INewScores[] {
    return this._scores;
  }
  public get isAdded(): boolean {
    return this._isAdded;
  }
  public get newIBestScore(): IBestScores {
    return this._newIBestScore;
  }
  public get IBestScores(): IBestScores[] {
    return this._IBestScores;
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
        this._track = res[0];
        this._scores = res[0].INewScores;
        this._IBestScores = res[0].IBestScores;
        this.IBestScoresSort();
        this.calculateHumanScore();
      });
  }
  private IBestScoresSort(): void {
    this._IBestScores = this._IBestScores.sort((n1, n2) => {
      return n1.score - n2.score ;
    });
  }
  public isNotIBestScore(): boolean {
      this.IBestScoresSort();
      if (this._IBestScores.length < BEST_SCORES_MAX ) {
        return false;
      } else if (this._newIBestScore.score < this._IBestScores[this._IBestScores.length - 1].score) {

        return false;
    }

      return true;
  }
  private calculateHumanScore(): void {
    for (const sc of this._scores[0].scores) {
      this._newIBestScore.score += sc;
    }
  }
  public onSubmit(f: NgForm): void {

    this._newIBestScore.name = f.value.name;

  }
  private replay(): void {
    this.router.navigateByUrl("/race/" + this._track.name);
  }
  private returnToMain(): void {
    this.router.navigateByUrl("/");
  }

  public saveIBestScore(): void {
  if (this._IBestScores.length >= BEST_SCORES_MAX ) {
      this._track.IBestScores.pop();
    }
  this._isAdded = true;
  this._track.IBestScores.push(this._newIBestScore);
  this.IBestScoresSort();
  this.communicationService.updateNewScore(this._track);

  }
}
