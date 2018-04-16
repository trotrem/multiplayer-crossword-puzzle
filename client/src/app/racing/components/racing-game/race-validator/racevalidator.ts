import * as THREE from "three";
import { Car } from "../car/car";
import { MS_TO_SECONDS, LAP_MAX } from "./../../../../constants";
import { RaceUtils } from "../../../race-utils/race-utils";
import { INewScores } from "./../../../../../../../common/communication/interfaces";
const ADD_TO_DISTANCE: number = 20;

export class RaceValidator {

    public static validateRace(car: Car, timer: number, points: THREE.Vector3[]): number[] {

        car.getUpdatedPosition();
        if (RaceUtils.getDistance(car.getUpdatedPosition(), points[points.length - car.checkpoint - 1])
            <= ADD_TO_DISTANCE) {
            car.checkpoint += 1;
            if (car.checkpoint === points.length) {
                return this.verifyNextLap(car, timer);
            }
        }

        return new Array<number>();

    }
    private static setNextLapParameters(car: Car, timer: number): void {
        car.setLapTimes(timer / MS_TO_SECONDS);
        car.checkpoint = 0;
        car.counterLap += 1;
    }

    private static verifyNextLap(car: Car, timer: number): number[] {

        this.setNextLapParameters(car, timer);
        if (car.counterLap === LAP_MAX) {
            return car.getLabTimes();
        }

        return new Array<number>();
    }

    public static addScoreToTrack(car: Car, scores: INewScores[], carIndex: number): void {
        const newScore: INewScores = { id: carIndex, scores: new Array<number>() };
        scores.push(newScore);
        for (const time of car.getLabTimes()) {
            scores[scores.length - 1].scores.push(time);
        }
    }

    public static estimateTime(timeNow: number, car: Car, points: THREE.Vector3[]): void {
        let checkPoints: THREE.Vector3[] = new Array<THREE.Vector3>();
        checkPoints.shift();
        checkPoints = points.slice().reverse();
        let distance: number =
            RaceUtils.getDistance(car.getUpdatedPosition(), points[car.checkpoint]);
        for (let j: number = car.checkpoint; j < checkPoints.length - 1; j++) {
            distance += RaceUtils.getDistance(points[j], points[j + 1]);
        }
        const time: number = car.setLapTimes((distance / car.speed.length()) + timeNow);
        while (car.getLabTimes().length !== LAP_MAX) {
            car.getLabTimes().push(time);
        }

    }
}
