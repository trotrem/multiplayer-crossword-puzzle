import { TestBed, async } from "@angular/core/testing";
import { Car } from "../car/car";
import * as THREE from "three";
import { RenderGameService } from "./render-game.service";
import { RouterTestingModule } from "@angular/router/testing";
import { GameResultsComponent } from "../../game-results/game-results.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { HttpClientModule } from "@angular/common/http";
import { WallsCollisionsService } from "./../walls-collisions-service/walls-collisions-service";
import { KeyboardEventService } from "../commands/keyboard-event.service";
import { SceneGameService } from "../scene-game-service/scene-game-service.service";
import { ILine } from "../../../race-utils/vector-utils";
import { FormsModule } from "@angular/forms";
import { WallService } from "../walls-collisions-service/walls";

/* tslint:disable:no-magic-numbers  */
describe("RenderGameService", () => {
    const wallService: WallService = new WallService();
    const wallsCollisionsService: WallsCollisionsService = new WallsCollisionsService(wallService);
    const keyboard: KeyboardEventService = new KeyboardEventService;
    const sceneService: SceneGameService = new SceneGameService(wallService);
    const canvas: HTMLCanvasElement = undefined;
    const startingZone: THREE.Line3 = new THREE.Line3;
    const points: THREE.Vector3[] = new Array<THREE.Vector3>();
    const service: RenderGameService = new RenderGameService(sceneService);
    let car: Car;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GameResultsComponent],
            imports: [
                FormsModule,
                HttpClientModule,
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([{ path: "gameResults/:CarIndex", component: GameResultsComponent }])]

            ,
            providers: [RenderGameService, KeyboardEventService, SceneGameService]
        });

    }));

    beforeEach(async (done: () => void) => {
        car = new Car(wallsCollisionsService, keyboard);
        await car.init();

        points.push(new THREE.Vector3(2, 3, 0));
        points.push(new THREE.Vector3(7, 3, 0));
        points.push(new THREE.Vector3(89, 8, 0));
        points.push(new THREE.Vector3(12, 0, 0));
        done();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
    it("should follow car with top view camera", () => {
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(car);
        }
        service.initialize(canvas, points, startingZone, cars, keyboard);
        cars[0].mesh.position.set(cars[0].getUpdatedPosition().x + 50, cars[0].getUpdatedPosition().y + 20, 0);
        expect(service.getTopCamera().position.x === cars[0].getUpdatedPosition().x &&
            service.getTopCamera().position.y === cars[0].getUpdatedPosition().y).toBeTruthy();
    });

    it("should rotate a rear camera with the car", () => {
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(car);
        }
        service.initialize(canvas, points, startingZone, cars, keyboard);
        cars[0].mesh.position.set(cars[0].getUpdatedPosition().x + 50, cars[0].getUpdatedPosition().y + 20, 0);
        const vectorCam: THREE.Vector3 = new THREE.Vector3;
        service.getRearCamera().getWorldDirection(vectorCam);
        expect(vectorCam.x === cars[0].direction.x &&
            vectorCam.y === cars[0].direction.y).toBeTruthy();
    });

    it("should follow car with top view camera", () => {
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(car);
        }
        service.initialize(canvas, points, startingZone, cars, keyboard);
        cars[0].mesh.position.set(cars[0].getUpdatedPosition().x + 50, cars[0].getUpdatedPosition().y + 20, 0);
        const vectorCam: THREE.Vector3 = new THREE.Vector3;
        service.getTopCamera().getWorldDirection(vectorCam);
        expect(vectorCam.x === cars[0].direction.x &&
            vectorCam.y === cars[0].direction.y).toBeTruthy();
    });
    it("should toggle camera", () => {
        for (let i: number = 0; i < 20; i++) {
            const previousCameraId: number = service.CameraID;
            service.toggleCamera();
            const currentCameraId: number = service.CameraID;
            expect(previousCameraId).not.toEqual(currentCameraId);
        }
    });
    it("should zoom in", () => {
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(car);
        }
        service.initialize(canvas, points, startingZone, cars, keyboard);
        const initialZoom: number[] = [service.TopCamera.zoom, service.RearCamera.zoom];
        for (let i: number = 0; i < 20; i++) {
            service.zoomIn();
        }
        expect(initialZoom[0]).toBeLessThan(service.TopCamera.zoom);
        expect(initialZoom[1]).toBeLessThan(service.RearCamera.zoom);
    });
    it("should not exceed a zoom of 2", () => {
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(car);
        }
        service.initialize(canvas, points, startingZone, cars, keyboard);
        for (let i: number = 0; i < 1000; i++) {
            service.zoomIn();
        }
        expect(service.TopCamera.zoom.toFixed(2)).toBeLessThanOrEqual(2);
        expect(service.RearCamera.zoom.toFixed(2)).toBeLessThanOrEqual(2);
    });
    it("should zoom out", () => {
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(car);
        }
        service.initialize(canvas, points, startingZone, cars, keyboard);
        const initialZoom: number[] = [service.TopCamera.zoom, service.RearCamera.zoom];
        for (let i: number = 0; i < 20; i++) {
            service.zoomOut();
        }
        expect(initialZoom[0]).toBeGreaterThan(service.TopCamera.zoom);
        expect(initialZoom[1]).toBeGreaterThan(service.RearCamera.zoom);
    });
    it("should not go under a zoom of 0.75", () => {
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(car);
        }
        service.initialize(canvas, points, startingZone, cars, keyboard);
        for (let i: number = 0; i < 1000; i++) {
            service.zoomOut();
        }
        expect(service.TopCamera.zoom.toFixed(2)).toBeGreaterThanOrEqual(0.75);
        expect(service.RearCamera.zoom.toFixed(2)).toBeGreaterThanOrEqual(0.75);
    });
});
