import { TestBed, inject, async, fakeAsync, tick } from "@angular/core/testing";
import { Car } from "../car/car";
import * as THREE from "three";
import { RenderService } from "./render.service";
import { CarsPositionsHandler } from "../cars-positions-handler/cars-positions-handler";
import { Routes, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { GameResultsComponent } from "../game-results/game-results.component";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { Track } from "./../track";
import { WallsCollisionsService } from "./../walls-collisions-service/walls-collisions-service";
import { CarLoader } from "../car/car-loader";
import { OrthographicCamera } from "../camera/topView-camera";
import { PerspectiveCamera } from "../camera/rearView-camera";
// "magic numbers" utilisés pour les tests
/* tslint:disable:no-magic-numbers */
describe("RenderService", () => {
    const carLoader: CarLoader = new CarLoader();
    const wallsCollisionsService: WallsCollisionsService = new WallsCollisionsService();
    // tslint:disable-next-line:prefer-const
    let container: HTMLDivElement;
    let http: HttpClient;
    const points: THREE.Vector3[] = new Array<THREE.Vector3>();
    let router: Router;
    const track: Track = {
        name: "Laurence", description: "", startingZone: new THREE.Line3, points: new Array<THREE.Vector3>(), usesNumber: 0,
        newScores: new Array<number>()
    };
    const service: RenderService = new RenderService(router, http);
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GameResultsComponent],
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([{ path: "gameResults/:CarIndex", component: GameResultsComponent }])]
            ,
            providers: [RenderService]
        });

    }));

    beforeEach(inject([Router, HttpClient], (_router: Router, _http: HttpClient) => {
        http = _http;
        router = _router;
    }));

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
    it("should be create a scene", () => {
        service.initialize(
            container, track);
        expect(service.getScene()).toBeDefined();
    });
    it("should add four cars to the scene", async () => {
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(new Car(wallsCollisionsService));
            cars[i].mesh = await carLoader.load();
        }
        service.initialize(container, track);
        CarsPositionsHandler.insertCars(
            new THREE.Line3(new THREE.Vector3(-23, -2, 0), new THREE.Vector3(3, 7, 10)), service.getScene(), cars);
        expect(service.getScene().children.length).toEqual(4);
    });
    /*it("should follow car with top view camera", async () => {
        let isEqual: boolean = false;
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(new Car(wallsCollisionsService));
            cars[i].mesh = await carLoader.load();
        }
        service.initialize(container, track);
        CarsPositionsHandler.insertCars(
            new THREE.Line3(new THREE.Vector3(-23, -2, 0), new THREE.Vector3(3, 7, 10)), service.getScene(), cars);
        cars[0].mesh.position.set(cars[0].getUpdatedPosition().x + 50, cars[0].getUpdatedPosition().y + 20, 0);
        if (service.getTopCamera().position.x === cars[0].getUpdatedPosition().x &&
            service.getTopCamera().position.y === cars[0].getUpdatedPosition().y) {
            isEqual = true;
        }
        expect(isEqual).toBe(true);
    });

    it("should rotate a rear camera with the car", async () => {
        let isEqual: boolean = false;
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(new Car(wallsCollisionsService));
            cars[i].mesh = await carLoader.load();
        }
        service.initialize(container, track);
        CarsPositionsHandler.insertCars(
            new THREE.Line3(new THREE.Vector3(-23, -2, 0), new THREE.Vector3(3, 7, 10)), service.getScene(), cars);
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
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(new Car(wallsCollisionsService));
            cars[i].mesh = await carLoader.load();
        }
        service.initialize(container, track);
        CarsPositionsHandler.insertCars(
            new THREE.Line3(new THREE.Vector3(-23, -2, 0), new THREE.Vector3(3, 7, 10)), service.getScene(), cars);
        cars[0].mesh.position.set(cars[0].getUpdatedPosition().x + 50, cars[0].getUpdatedPosition().y + 20, 0);
        const isEqual: boolean = false;
        expect(false).toEqual(true);
    });*/

});
