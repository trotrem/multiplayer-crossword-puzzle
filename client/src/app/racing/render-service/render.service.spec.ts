import { TestBed, inject, async, fakeAsync, tick } from "@angular/core/testing";
import { Car } from "../car/car";
import * as THREE from "three";
import { RenderService } from "./render.service";
import { CarsPositionsHandler } from "../cars-positions-handler/cars-positions-handler";
import { Routes, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { GameResultsComponent } from "../game-results/game-results.component";
// "magic numbers" utilisés pour les tests
/* tslint:disable:no-magic-numbers */
describe("RenderService", () => {
    // tslint:disable-next-line:prefer-const
    let container: HTMLDivElement;
    const points: THREE.Vector3[] = new Array<THREE.Vector3>();
    let router: Router;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GameResultsComponent],
            imports: [
                RouterTestingModule.withRoutes([{ path: "gameResults/:CarIndex", component: GameResultsComponent }])]
            ,
            providers: [RenderService]
        });

    }));

    beforeEach(inject([Router], (_router: Router) => {
        router = _router;
    }));

    it("should be created", inject([RenderService], (service: RenderService) => {
        expect(service).toBeTruthy();
    }));
    it("should be create a scene", inject([RenderService], (service: RenderService) => {
        service.initialize(
            container,
            new THREE.Line3(new THREE.Vector3(-23, -2, 0), new THREE.Vector3(3, 7, 10)),
            points);
        expect(service.getScene()).toBeDefined();
    }));
    it("should add four cars to the scene", inject([RenderService], (service: RenderService) => {
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(new Car());
        }
        service.initialize(container, new THREE.Line3(new THREE.Vector3(-23, -2, 0), new THREE.Vector3(3, 7, 10)), points);
        CarsPositionsHandler.insertCars(
            new THREE.Line3(new THREE.Vector3(-23, -2, 0), new THREE.Vector3(3, 7, 10)), service.getScene(), cars);
        expect(service.getScene().children.length).toEqual(4);
    }));
    it("race shoudn't be finished if a car don't finish 3 laps ", inject([RenderService], (service: RenderService) => {

        service.initialize(
            container,
            new THREE.Line3(new THREE.Vector3(-23, -2, 0), new THREE.Vector3(3, 7, 10)),
            points);
        service.setCounter(2);
        expect(service.getRaceIsFinished()).toBe(false);
    }));

    it('navigate to "gameResults/:CarIndex" takes you to  ""gameResults/:CarIndex"', fakeAsync(() => {
        const carIndex: number = 0;
        router.navigateByUrl("/gameResults/" + carIndex);
        tick(50);
        expect(router.url).toBe("/gameResults/" + carIndex);
    }));

});
