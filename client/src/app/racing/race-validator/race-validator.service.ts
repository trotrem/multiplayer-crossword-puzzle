import { Injectable } from "@angular/core";
import * as THREE from "three";
import { Car } from "./../car/car";
import { Router } from "@angular/router";
import { CommunicationRacingService } from "../communication.service/communicationRacing.service";
import { HttpClient } from "@angular/common/http";
import { MS_TO_SECONDS, LAP_MAX, CARS_MAX } from "./../constants";
import { RaceUtils } from "./../utils/utils";
import { Track } from "../track";
const ADD_TO_DISTANCE: number = 30;
const EXPONENT: number = 2;

@Injectable()
export class RaceValidatorService {

  private _counter: number[];
  private communicationService: CommunicationRacingService;
  private _cars: Car[];
  private _track: Track;
  private _validIndex: number[];

  public constructor(private _router: Router, private http: HttpClient) {
    this._cars = new Array<Car>(CARS_MAX);
    this._counter = new Array<number>();
    this.communicationService = new CommunicationRacingService(http);
    this._validIndex = new Array<number>();
    for (let i: number = 0; i < CARS_MAX; i++) {
      this.counter.push(0);
      this.validIndex.push(0);
    }
  }
  public get validIndex(): number[] {
    return this._validIndex;
  }
  public get router(): Router {
    return this._router;
  }
  public get cars(): Car[] {
    return this._cars;
  }

  public get track(): Track {
    return this._track;
  }
  public set track(track: Track) {
    this._track = track;
  }

  public set counter(counter: number[]) {
    this._counter = counter;
  }
  public get counter(): number[] {
    return this._counter;
  }

  public getLapSectionvalidator(carPosition: THREE.Vector3, position: THREE.Vector3): boolean {

    const position2: THREE.Vector3 = carPosition.clone();

    return Math.sqrt(Math.pow(position.x - position2.x, EXPONENT) + Math.pow(position.y - position2.y, EXPONENT)) <= ADD_TO_DISTANCE;
  }

  public async validateRace(index: number, carIndex: number, timer: number): Promise<void> {

    await this.cars[carIndex].getUpdatedPosition();
    if (this.getLapSectionvalidator(
      this.cars[carIndex].getUpdatedPosition(), this.track.points[this.track.points.length - index - 1])) {
      this.validIndex[carIndex] += 1;
      if (this.validIndex[carIndex] === this.track.points.length) {
        this.verifieNextLap(carIndex, timer);
      }
      this.validateRace(this.validIndex[carIndex], carIndex, timer);
    }

  }
  private setNextLapParameters(carIndex: number, timer: number): void {

    this.cars[carIndex].setLabTimes(timer / MS_TO_SECONDS);
    this.validIndex[carIndex] = 0;
    this.counter[carIndex] += 1;
    console.log("tour");
  }

  private async verifieNextLap(carIndex: number, timer: number): Promise<void> {

    this.setNextLapParameters(carIndex, timer);
    if (this.counter[carIndex] === LAP_MAX) {
      this.addScoreToTrack(carIndex);
      if (carIndex === 0) {
        this.estimateTime(timer / MS_TO_SECONDS);
        this.track.usesNumber++;
        await this.communicationService.updateNewScore(this.track);
        this.navigateToGameResults();
      }
    }
  }
  private navigateToGameResults(): void {
    this._router.navigateByUrl("/gameResults/" + this.track.name);
  }

  private addScoreToTrack(carIndex: number): void {
    this.track.newScores.push(carIndex);
    for (const time of this.cars[carIndex].getLabTimes()) {
      this.track.newScores.push(time);
    }
  }

  private estimateTime(time: number): void {
    for (let i: number = 0; i < this.cars.length; i++) {
      if (i > 0) {
        // tslint:disable-next-line:no-magic-numbers
        this.cars[i].speed = new THREE.Vector3(12, 0, 6);
      }
      if (this.counter[i] < LAP_MAX) {
        let distance: number =
          RaceUtils.calculateDistance(this.cars[i].getUpdatedPosition(), this.track.points[this.validIndex[i] + 1]);
        for (let j: number = this.validIndex[i] + 1; j > 0; j--) {
          distance += RaceUtils.calculateDistance(this.track.points[j], this.track.points[j + 1]);
        }
        while (this.cars[i].getLabTimes().length !== LAP_MAX) {
          this.cars[i].getLabTimes().push((distance / this.cars[i].speed.length()) + time);
        }
        this.addScoreToTrack(i);
      }

    }
  }

}
