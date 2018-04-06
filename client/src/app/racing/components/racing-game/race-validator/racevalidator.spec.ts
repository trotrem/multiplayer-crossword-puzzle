import { RaceValidator } from "./racevalidator";
import { TestBed, tick, fakeAsync, inject } from "@angular/core/testing";
import { Router } from "@angular/router";
import * as THREE from "three";
import { GameResultsComponent } from "../../game-results/game-results.component";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule } from "@angular/forms";
import { Car } from "../car/car";
import { WallsCollisionsService } from "../walls-collisions-service/walls-collisions-service";
import { Track } from "../../../track";
import { INewScores, IBestScores } from "../../../../../../../common/communication/interfaces";

// "magic numbers" utilisés pour les tests
/* tslint:disable:no-magic-numbers no-floating-promises */

describe("Racevalidator", () => {
    let router: Router;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [GameResultsComponent],
            providers: [RaceValidator, WallsCollisionsService],
            imports: [
                FormsModule,
                RouterTestingModule.withRoutes([{ path: "gameResults/:CarIndex", component: GameResultsComponent }])]
        });
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

    it(
        "shouldn't validate a race when a car did less than 3 lap ",
        (inject([WallsCollisionsService], async (service: WallsCollisionsService) => {
            const track: Track = {
                name: "Laurence", description: "", startingZone: new THREE.Line3, points: new Array<THREE.Vector3>(), usesNumber: 0,
                INewScores: new Array<INewScores>(), IBestScores: new Array<IBestScores>()
            };
            const car: Car = new Car(service);
            car.counterLap = 0;
            const score: number[] = RaceValidator.validateRace(car, 1000, track);
            expect(score.length).toEqual(1);
        })));

  /*  it("should validate a race when a car did 3 lap ", (inject([WallsCollisionsService], async (service: WallsCollisionsService) => {
        const track: Track = {
            name: "Laurence", description: "", startingZone: new THREE.Line3, points: new Array<THREE.Vector3>(), usesNumber: 0,
            INewScores: new Array<INewScores>(), IBestScores: new Array<IBestScores>()
        };
        const car: Car = new Car(service);
        car.counterLap = 3;
        expect((RaceValidator.validateRace(car, 2000, track).length)).toBeDefined();
    })));*/

});
