import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RacingCommunicationService } from "../../communication.service/communicationRacing.service";
import { NewScores, BestScores} from "../../../../../../common/communication/interfaces";
import { inject } from "inversify";
import { NgForm } from "@angular/forms";
import * as THREE from "three";
import { Track } from "../../track";
import {LAP_MAX} from "../racing-game/constants";
const DELAY: number = 1000;
const BEST_SCORES_MAX: number = 5;

@Component({
  selector: "app-game-results",
  templateUrl: "./game-results.component.html",
  styleUrls: ["./game-results.component.css"]
})
export class GameResultsComponent implements OnInit {

  private _scores: NewScores[];
  private _bestScores: BestScores[];
  private _newBestScore: BestScores;
  private _track: Track;

  public constructor(private router: Router , private route: ActivatedRoute,
                     @inject(RacingCommunicationService) private communicationService: RacingCommunicationService) {
    this._scores = new Array< NewScores>();
    this._bestScores = new Array<BestScores>();
    this._newBestScore = {name: "", score: 0};
    this._track  = {
      name: "", description: "", startingZone: new THREE.Line3, points: new Array<THREE.Vector3>(), usesNumber: 0,
      newScores: new Array< NewScores>(),  bestScores: new Array< BestScores>()
  };
  }
  public get scores(): NewScores[] {
    return this._scores;
  }
  public get newBestScore(): BestScores {
    return this._newBestScore;
  }
  public get bestScores(): BestScores[] {
    return this._bestScores;
  }
  public async ngOnInit(): Promise<void> {
    const name: string = this.route.snapshot.paramMap.get("name");
    if (name !== null) {
      await this.getTrack(name);
    }
    if (this.isNotBestScore()) {
    document.getElementById("congrats").style.display = "none";
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
        this._scores = res[0].newScores;
        this._bestScores = res[0].bestScores;
        this.bestScoresSort();
        this.calculateHumanScore();
      });
  }
  private bestScoresSort(): void {
    this._bestScores = this._bestScores.sort((n1, n2) => {
      return n1.score - n2.score ;
    });
  }
  public isNotBestScore(): boolean {
      this.bestScoresSort();
      if (this._bestScores.length < BEST_SCORES_MAX ) {
        return false;
      }
      if (this._newBestScore.score < this._bestScores[BEST_SCORES_MAX - 1].score) {

      return false;
    }

      return true;
  }
  private calculateHumanScore(): void {
    for (const sc of this._scores[0].scores) {
      this._newBestScore.score += sc;
    }
  }
  public onSubmit(f: NgForm): void {
    if (this._bestScores.length >= BEST_SCORES_MAX ) {
      this._track.bestScores.pop();
    }
    this._newBestScore.name = f.value.name;

  }
  private replay(): void {
    this.router.navigateByUrl("/race/" + this._track.name);
  }
  private returnToMain(): void {
    this.router.navigateByUrl("/");
  }

  public saveBestScore(): void {
  this._track.bestScores.push(this._newBestScore);
  this.bestScoresSort();
  this.communicationService.updateNewScore(this._track);

  }
}
