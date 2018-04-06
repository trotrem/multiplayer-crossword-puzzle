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
            track.INewScores[carIndex].scores.push(time);
        }
    }

    public static estimateTime(time: number, car: Car, track: Track): void {
        // tslint:disable-next-line:no-magic-numbers
        car.speed = new THREE.Vector3(12, 0, 6);
        if (car.counterLap < LAP_MAX) {
            let distance: number =
                RaceUtils.calculateDistance(car.getUpdatedPosition(), track.points[car.checkpoint + 1]);
            for (let j: number = car.checkpoint + 1; j > 0; j--) {
                distance += RaceUtils.calculateDistance(track.points[j], track.points[j + 1]);
            }
            while (car.getLabTimes().length !== LAP_MAX) {
                car.getLabTimes().push((distance / car.speed.length()) + time);
            }
        }

    }
}
