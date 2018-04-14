import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RacingCommunicationService } from "../../communication.service/communicationRacing.service";
import { INewScores, IBestScores } from "../../../../../../common/communication/interfaces";
import { NgForm } from "@angular/forms";
import * as THREE from "three";
import { Track } from "../../track";
import { ResultsManager } from "../racing-game/resultsManager/results-manager";
const DELAY: number = 1000;
const BEST_SCORES_MAX: number = 5;

@Component({
    selector: "app-game-results",
    templateUrl: "./game-results.component.html",
    styleUrls: ["./game-results.component.css"]
})
export class GameResultsComponent implements OnInit {

    private _scores: INewScores[];
    private _bestScores: IBestScores[];
    private _newBestScore: IBestScores;
    private _track: Track;
    private _isAdded: boolean;

    public constructor(
        private router: Router, private route: ActivatedRoute,
        private communicationService: RacingCommunicationService) {
        this._scores = new Array<INewScores>();
        this._scores.push({ id: 0, scores: new Array<number>() });
        this._bestScores = new Array<IBestScores>();
        this._newBestScore = { name: "", score: 0 };
        this._track = {
            name: "", description: "", startingZone: new THREE.Line3, points: new Array<THREE.Vector3>(), usesNumber: 0,
            INewScores: new Array<INewScores>(), IBestScores: new Array<IBestScores>()
        };
        this._isAdded = false;
    }
    public get scores(): INewScores[] {
        return this._scores;
    }
    public get isAdded(): boolean {
        return this._isAdded;
    }
    public get newBestScore(): IBestScores {
        return this._newBestScore;
    }
    public set newBestScore(score: IBestScores) {
        this._newBestScore = score;
    }
    public get bestScores(): IBestScores[] {
        return this._bestScores;
    }
    public set bestScores(bestScores: IBestScores[]) {
        this._bestScores = bestScores;
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
                this._bestScores = res[0].IBestScores;
                ResultsManager.bestScoresSort(this._bestScores);
                ResultsManager.calculateHumanScore(this._scores, this._newBestScore);
            });
    }
    public isNotBestScore(): boolean {
        if (this._scores[0].id !== 0) {
            return true;
        }
        if (this._bestScores.length < BEST_SCORES_MAX) {
            return false;
        } else if (this._newBestScore.score < this._bestScores[this._bestScores.length - 1].score) {

            return false;
        }

        return true;
    }
    public onSubmit(f: NgForm): void {

        this._newBestScore.name = f.value.name;

    }
    public replay(): void {
        this.router.navigateByUrl("/race/" + this._track.name);
    }
    public returnToMain(): void {
        this.router.navigateByUrl("/");
    }

    public saveBestScore(): void {
        if (this._bestScores.length >= BEST_SCORES_MAX) {
            this._track.IBestScores.pop();
        }
        this._isAdded = true;
        this._track.IBestScores.push(this._newBestScore);
        ResultsManager.bestScoresSort(this._bestScores);
        this.communicationService.updateNewScore(this._track);

    }
}
