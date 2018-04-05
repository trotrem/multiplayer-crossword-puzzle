import * as THREE from "three";
import { Car } from "../car/car";
import { MS_TO_SECONDS, LAP_MAX, CARS_MAX } from "./../constants";
import { RaceUtils } from "../../../utils/utils";
import { inject } from "inversify";
import { Track } from "../../../track";
const ADD_TO_DISTANCE: number = 20;

export class RaceValidator {

   // private _counter: number[];
    // private _cars: Car[];
    // private _track: Track;
    // private _validIndex: number[];

    /* public constructor(
         private _router: Router, @inject(RacingCommunicationService) private communicationService: RacingCommunicationService) {
         this._counter = new Array<number>();
         this._validIndex = new Array<number>();
         for (let i: number = 0; i < CARS_MAX; i++) {
             this.counter.push(0);
             this.validIndex.push(0);
         }
     }*/
    /*  public get validIndex(): number[] {
          return this._validIndex;
      }
      public get router(): Router {
          return this._router;
      }
      public get cars(): Car[] {
          return this._cars;
      }
      public set counter(counter: number[]) {
          this._counter = counter;
      }
      public get counter(): number[] {
          return this._counter;
      }*/

    /* public initialize(track: Track, collisionService: WallsCollisionsService, cars: Car[]): void {
           this.track = track;
           this.track.newScores = new Array<NewScores>();
           this.track.bestScores = track.bestScores;
         this._cars = cars;
 }*/

    public static validateRace(index: number, car: Car, timer: number, track: Track): void {

        car.getUpdatedPosition();
        if (RaceUtils.calculateDistance(car.getUpdatedPosition(), track.points[car.checkpoint])
            <= ADD_TO_DISTANCE) {
            car.checkpoint += 1;
            if (car.checkpoint === track.points.length) {
                this.verifyNextLap(car, timer);
            }
        }

    }
    private static setNextLapParameters(car: Car, timer: number): void {
        car.setLapTimes(timer / MS_TO_SECONDS);
        car.checkpoint = 0;
        car.counterLap += 1;
    }

    private static verifyNextLap(car: Car, timer: number): void {

        this.setNextLapParameters(car, timer);
        if (car.counterLap === LAP_MAX) {
            /* this.addScoreToTrack(carIndex);
             if (carIndex === 0) {
                 this.estimateTime(timer / MS_TO_SECONDS);
                 this.track.usesNumber++;
                 this.communicationService.updateNewScore(this.track);
                 this.navigateToGameResults();
             }*/
        }
    }
}
