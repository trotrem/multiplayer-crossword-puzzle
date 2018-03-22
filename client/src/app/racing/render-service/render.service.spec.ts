import { TestBed, inject } from "@angular/core/testing";
import { Car } from "../car/car";
import * as THREE from "three";
import { RenderService } from "./render.service";
import { CarsPositionsHandler } from "../cars-positions-handler/cars-positions-handler";
// "magic numbers" utilisés pour les tests
/* tslint:disable:no-magic-numbers */
describe("RenderService", () => {
    // tslint:disable-next-line:prefer-const
    let container: HTMLDivElement;
    const points: THREE.Vector3[] = new Array<THREE.Vector3>();
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RenderService, CarsPositionsHandler]
        });
    });

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
});
