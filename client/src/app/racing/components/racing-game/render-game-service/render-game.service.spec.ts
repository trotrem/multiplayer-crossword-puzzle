import { TestBed, async } from "@angular/core/testing";
import { Car } from "../car/car";
import * as THREE from "three";
import { RenderGameService } from "./render-game.service";
import { RouterTestingModule } from "@angular/router/testing";
import { GameResultsComponent } from "../../game-results/game-results.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { HttpClientModule } from "@angular/common/http";
import { WallsCollisionsService } from "./../walls-collisions-service/walls-collisions-service";
import { CarLoader } from "../car/car-loader";
import { KeyboardService } from "../commands/keyboard.service";
import { INewScores, IBestScores } from "../../../../../../../common/communication/interfaces";
import { SceneGameService } from "../scene-game-service/scene-game-service.service";
import { ILine } from "../../../race-utils/race-utils";

// "magic numbers" utilisés pour les tests
/* tslint:disable:no-magic-numbers no-floating-promises await-promise */
describe("RenderGameService", () => {
    const carLoader: CarLoader = new CarLoader();
    const wallsCollisionsService: WallsCollisionsService = new WallsCollisionsService();
    const keyboard: KeyboardService = new KeyboardService;
    const sceneService: SceneGameService = new SceneGameService();
    // tslint:disable-next-line:prefer-const
    let canvas: HTMLCanvasElement;
    const startingZone: THREE.Line3 = new THREE.Line3;
    const points: THREE. Vector3[] = new Array<THREE.Vector3>();
    const service: RenderGameService = new RenderGameService(sceneService);
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GameResultsComponent],
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([{ path: "gameResults/:CarIndex", component: GameResultsComponent }])]
            ,
            providers: [RenderGameService, KeyboardService, SceneGameService]
        });

    }));

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
    it("should follow car with top view camera", async () => {
        const walls: ILine[] = new Array<ILine>();
        let isEqual: boolean = false;
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(new Car(wallsCollisionsService, keyboard));
            cars[i].mesh = await carLoader.load();
        }
        service.initialize(canvas, points, startingZone, cars, walls, keyboard);
      /*  CarsPositionsHandler.insertCars(
            new THREE.Line3(new THREE.Vector3(-23, -2, 0), new THREE.Vector3(3, 7, 10)), service.getScene(), cars);*/
        cars[0].mesh.position.set(cars[0].getUpdatedPosition().x + 50, cars[0].getUpdatedPosition().y + 20, 0);
        if (service.getTopCamera().position.x === cars[0].getUpdatedPosition().x &&
            service.getTopCamera().position.y === cars[0].getUpdatedPosition().y) {
            isEqual = true;
        }
        expect(isEqual).toBe(true);
    });

    it("should rotate a rear camera with the car", async () => {
        const walls: ILine[] = new Array<ILine>();
        let isEqual: boolean = false;
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(new Car(wallsCollisionsService, keyboard));
            cars[i].mesh = await carLoader.load();
        }
        service.initialize(canvas, points, startingZone, cars, walls, keyboard);
        /*CarsPositionsHandler.insertCars(
            new THREE.Line3(new THREE.Vector3(-23, -2, 0), new THREE.Vector3(3, 7, 10)), service.getScene(), cars);*/
        cars[0].mesh.position.set(cars[0].getUpdatedPosition().x + 50, cars[0].getUpdatedPosition().y + 20, 0);
        const vectorCam: THREE.Vector3 = new THREE.Vector3;
        service.getRearCamera().getWorldDirection(vectorCam);
        if (vectorCam.x === cars[0].direction.x &&
            vectorCam.y === cars[0].direction.y) {
            isEqual = true;
        }
        expect(isEqual).toBe(true);
    });

    it("should follow car with top view camera", async () => {
        const walls: ILine[] = new Array<ILine>();
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(new Car(wallsCollisionsService, keyboard));
            cars[i].mesh = await carLoader.load();
        }
        service.initialize(canvas, points, startingZone, cars, walls, keyboard);
      /*  CarsPositionsHandler.insertCars(
            new THREE.Line3(new THREE.Vector3(-23, -2, 0), new THREE.Vector3(3, 7, 10)), service.getScene(), cars);*/
        cars[0].mesh.position.set(cars[0].getUpdatedPosition().x + 50, cars[0].getUpdatedPosition().y + 20, 0);
        let isEqual: boolean = false;
        const vectorCam: THREE.Vector3 = new THREE.Vector3;
        service.getTopCamera().getWorldDirection(vectorCam);
        if (vectorCam.x === cars[0].direction.x &&
            vectorCam.y === cars[0].direction.y) {
            isEqual = true;
        }
        expect(isEqual).toBe(true);
    });
    it("should toggle camera", () => {
        for (let i: number = 0; i < 20; i++) {
            const previousCameraId: number = service.CameraID;
            service.toggleCamera();
            const currentCameraId: number = service.CameraID;
            expect(previousCameraId).not.toEqual(currentCameraId);
        }
    });
    it("should zoom in", async () => {
        const walls: ILine[] = new Array<ILine>();
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(new Car(wallsCollisionsService, keyboard));
            cars[i].mesh = await carLoader.load();
        }
        service.initialize(canvas, points, startingZone, cars, walls, keyboard);
        const initialZoom: number[] = [service.TopCamera.zoom, service.RearCamera.zoom];
        for (let i: number = 0; i < 20; i++) {
            service.zoomIn();
        }
        expect(initialZoom[0]).toBeLessThan(service.TopCamera.zoom);
        expect(initialZoom[1]).toBeLessThan(service.RearCamera.zoom);
    });
    it("should not exceed a zoom of 2", async () => {
        const walls: ILine[] = new Array<ILine>();
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(new Car(wallsCollisionsService, keyboard));
            cars[i].mesh = await carLoader.load();
        }
        service.initialize(canvas, points, startingZone, cars, walls, keyboard);
        for (let i: number = 0; i < 1000; i++) {
            service.zoomIn();
        }
        expect(service.TopCamera.zoom.toFixed(2)).toBeLessThanOrEqual(2);
        expect(service.RearCamera.zoom.toFixed(2)).toBeLessThanOrEqual(2);
    });
    it("should zoom out", async () => {
        const walls: ILine[] = new Array<ILine>();
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(new Car(wallsCollisionsService, keyboard));
            cars[i].mesh = await carLoader.load();
        }
        service.initialize(canvas, points, startingZone, cars, walls, keyboard);
        const initialZoom: number[] = [service.TopCamera.zoom, service.RearCamera.zoom];
        for (let i: number = 0; i < 20; i++) {
            service.zoomOut();
        }
        expect(initialZoom[0]).toBeGreaterThan(service.TopCamera.zoom);
        expect(initialZoom[1]).toBeGreaterThan(service.RearCamera.zoom);
    });
    it("should not go under a zoom of 0.75", async () => {
        const walls: ILine[] = new Array<ILine>();
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(new Car(wallsCollisionsService, keyboard));
            cars[i].mesh = await carLoader.load();
        }
        service.initialize(canvas, points, startingZone, cars, walls, keyboard);
        for (let i: number = 0; i < 1000; i++) {
            service.zoomOut();
        }
        expect(service.TopCamera.zoom.toFixed(2)).toBeGreaterThanOrEqual(0.75);
        expect(service.RearCamera.zoom.toFixed(2)).toBeGreaterThanOrEqual(0.75);
    });
});
