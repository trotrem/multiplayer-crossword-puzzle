import * as THREE from "three";
import { Car } from "../car/car";
import { MS_TO_SECONDS, LAP_MAX } from "./../../../../constants";
import { RaceUtils } from "../../../utils/utils";
import { Track } from "../../../track";
import { INewScores } from "./../../../../../../../common/communication/interfaces";
const ADD_TO_DISTANCE: number = 20;

export class RaceValidator {

    public static validateRace(car: Car, timer: number, track: Track): number[] {

        car.getUpdatedPosition();
        if (RaceUtils.calculateDistance(car.getUpdatedPosition(), track.points[track.points.length - car.checkpoint - 1])
            <= ADD_TO_DISTANCE) {
            car.checkpoint += 1;
            if (car.checkpoint === track.points.length) {
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

    public static addScoreToTrack(car: Car, track: Track, carIndex: number): void {
        const newScore: INewScores = { id: carIndex, scores: new Array<number>() };
        track.INewScores.push(newScore);
        for (const time of car.getLabTimes()) {
            track.INewScores[track.INewScores.length - 1].scores.push(time);
        }
    }

    public static estimateTime(timeNow: number, car: Car, points: THREE.Vector3[]): void {

        let distance: number =
            RaceUtils.calculateDistance(car.getUpdatedPosition(), points[car.checkpoint]);
        for (let j: number = car.checkpoint; j > 0; j--) {
            distance += RaceUtils.calculateDistance(points[j], points[j + 1]);
        }
        const time: number = car.setLapTimes((distance / car.speed.length()) + timeNow);
        while (car.getLabTimes().length !== LAP_MAX) {
            car.getLabTimes().push(time);
        }

    }
}
