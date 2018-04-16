import { TestBed, inject } from "@angular/core/testing";
import * as THREE from "three";
import { SceneGameService } from "./scene-game-service.service";
import { WallsCollisionsService } from "../walls-collisions-service/walls-collisions-service";
import { KeyboardService } from "../commands/keyboard.service";
import { Car } from "./../car/car";
import { ILine } from "../../../race-utils/race-utils";
import { WallService } from "../walls-collisions-service/walls";

/* tslint:disable:no-magic-numbers*/
describe("SceneGameService", () => {
    const wallsCollisionsService: WallsCollisionsService = new WallsCollisionsService();
    const keyboard: KeyboardService = new KeyboardService;
    const points: THREE.Vector3[] = new Array<THREE.Vector3>();
    const startingZone: THREE.Line3 = new THREE.Line3;
    const wallService: WallService = new WallService();
    let car: Car;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SceneGameService, WallsCollisionsService, WallService, KeyboardService]
        });
    });

    beforeEach(async (done: () => void) => {
        car = new Car(wallsCollisionsService, wallService, keyboard);
        await car.init();
        done();
    });

    it("should be created", inject([SceneGameService], (service: SceneGameService) => {
        expect(service).toBeTruthy();
    }));

    it("should create a scene", inject([SceneGameService], (service: SceneGameService) => {
        points.push(new THREE.Vector3(2, 3, 0));
        points.push(new THREE.Vector3(7, 3, 0));
        points.push(new THREE.Vector3(89, 8, 0));
        points.push(new THREE.Vector3(12, 0, 0));
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(car);
        }
        const walls: ILine[] = new Array<ILine>();
        service.initialize(points, startingZone, cars, walls);
        expect(service.scene).toBeDefined();
    }));
    it("should add four cars to the scene", inject([SceneGameService], (service: SceneGameService) => {
        points.push(new THREE.Vector3(2, 3, 0));
        points.push(new THREE.Vector3(7, 3, 0));
        points.push(new THREE.Vector3(89, 8, 0));
        points.push(new THREE.Vector3(12, 0, 0));
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(car);
        }
        const walls: ILine[] = new Array<ILine>();
        service.initialize(points, startingZone, cars, walls);
        expect(service.scene.children.length).toEqual(19);
    }));
});
