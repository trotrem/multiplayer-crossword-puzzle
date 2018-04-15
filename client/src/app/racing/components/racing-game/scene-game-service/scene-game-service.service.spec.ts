import { TestBed, inject } from "@angular/core/testing";
import * as THREE from "three";
import { SceneGameService } from "./scene-game-service.service";
import { WallsCollisionsService } from "../walls-collisions-service/walls-collisions-service";
import { KeyboardService } from "../commands/keyboard.service";
import { Car } from "./../car/car";
import { CarLoader } from "../car/car-loader";
import { IBestScores, INewScores } from "./../../../../../../../common/communication/interfaces";
import { CarsPositionsHandler } from "../cars-positions-handler/cars-positions-handler";
import { ILine } from "../../../utils/utils";

// "magic numbers" utilisés pour les tests
/* tslint:disable:no-magic-numbers*/
describe("SceneGameService", () => {
    const carLoader: CarLoader = new CarLoader();
    const wallsCollisionsService: WallsCollisionsService = new WallsCollisionsService();
    const keyboard: KeyboardService = new KeyboardService;
    const points: THREE.Vector3[] =  new Array<THREE.Vector3>();
    const startingZone: THREE.Line3 = new THREE.Line3;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SceneGameService, WallsCollisionsService, KeyboardService]
        });
    });

    it("should be created", inject([SceneGameService], (service: SceneGameService) => {
        expect(service).toBeTruthy();
    }));

    it("should be create a scene", inject([SceneGameService], async (service: SceneGameService) => {
        const walls: ILine[] = new Array<ILine>();
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(new Car(wallsCollisionsService, keyboard));
            cars[i].mesh = await carLoader.load();
        }
        service.initialize(points, startingZone, cars, walls);
        expect(service.scene).toBeDefined();
    }));
    it("should add four cars to the scene", inject([SceneGameService], async (service: SceneGameService) => {
        const walls: ILine[] = new Array<ILine>();
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(new Car(wallsCollisionsService, keyboard));
            await cars[i].init().then(() => { });
        }
        service.initialize(points, startingZone, cars, walls);
        /*for (const car of CarsPositionsHandler.insertCars(
            new THREE.Line3(new THREE.Vector3(-23, -2, 0), new THREE.Vector3(3, 7, 10)), cars)) {
            service.scene.add(car);
            }*/
        expect(service.scene.children.length).toEqual(56);
    }));
});
