import { RaceValidator } from "./racevalidator";
import { TestBed, tick, fakeAsync, inject } from "@angular/core/testing";
import { Router } from "@angular/router";
import * as THREE from "three";
import { GameResultsComponent } from "../../game-results/game-results.component";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule } from "@angular/forms";
import { Car } from "../car/car";
import { WallsCollisionsService } from "../walls-collisions-service/walls-collisions-service";
import { INewScores, IBestScores } from "../../../../../../../common/communication/interfaces";
import { KeyboardService } from "../commands/keyboard.service";
import { Engine } from "./../car/engine";
import { Track } from "./../../../track";

const MS_BETWEEN_FRAMES: number = 16.6667;

/* tslint:disable: no-magic-numbers */
class MockEngine extends Engine {
    public getDriveTorque(): number {
        return 10000;
    }
}
class MockCar extends Car {
    private _position: THREE.Vector3 = new THREE.Vector3();

    public getUpdatedPosition(): THREE.Vector3 {
        return this._position;
    }

    public set pos(pos: THREE.Vector3) {
        this._position = pos;
    }
}

// "magic numbers" utilisés pour les tests
/* tslint:disable:no-magic-numbers no-floating-promises */

describe("Racevalidator", () => {
    let router: Router;
    const keyboard: KeyboardService = new KeyboardService;
    let car: MockCar;
    const wallsCollisionsService: WallsCollisionsService = new WallsCollisionsService();
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [GameResultsComponent],
            providers: [RaceValidator, WallsCollisionsService],
            imports: [
                FormsModule,
                RouterTestingModule.withRoutes([{ path: "gameResults/:CarIndex", component: GameResultsComponent }])]
        });
    });

    beforeEach(async (done: () => void) => {
        car = new MockCar(wallsCollisionsService, keyboard, new MockEngine());
        done();

    });

    beforeEach(inject([Router], (_router: Router) => {
        router = _router;

    }));

    it('navigate to "gameResults/:CarIndex" takes you to  ""gameResults/:CarIndex"', fakeAsync(() => {
        const carIndex: number = 0;
        router.navigateByUrl("/gameResults/" + carIndex);
        tick(50);
        expect(router.url).toBe("/gameResults/" + carIndex);
    }));

    it("should update LapTimes after one lap ", (() => {
        const points: THREE.Vector3[] = new Array<THREE.Vector3>();
        points.push(new THREE.Vector3(67, 90, 0));
        points.push(new THREE.Vector3(90, 90, 0));
        points.push(new THREE.Vector3(67, 2, 0));
        car.pos = new THREE.Vector3(67, 90, 0);
        car.checkpoint = 2;
        RaceValidator.validateRace(car, 1000, points);
        expect(car.getLapTimes().length).toEqual(1);
    }));

    it("should update LapTimes after three lap ", (() => {
        const points: THREE.Vector3[] = new Array<THREE.Vector3>();
        points.push(new THREE.Vector3(67, 90, 0));
        points.push(new THREE.Vector3(90, 90, 0));
        points.push(new THREE.Vector3(67, 2, 0));
        car.pos = new THREE.Vector3(67, 90, 0);
        car.checkpoint = 2;
        car.setLapTimes(3000);
        car.setLapTimes(8000);
        RaceValidator.validateRace(car, 1000, points);
        expect(car.getLapTimes().length).toEqual(3);
    }));

    it("should update track.scores ", (() => {
        const track: Track = {
            name: "Laurence", description: "", startingZone: new THREE.Line3, points: new Array<THREE.Vector3>(), usesNumber: 0,
            INewScores: new Array<INewScores>(), IBestScores: new Array<IBestScores>()
        };
        car.setLapTimes(3000);
        car.setLapTimes(8000);
        car.setLapTimes(5000);
        RaceValidator.addScoreToTrack(car, track.INewScores, 0);
        expect(track.INewScores.length).toEqual(1);
        expect(track.INewScores[0].scores.length).toEqual(3);
    }));

});
