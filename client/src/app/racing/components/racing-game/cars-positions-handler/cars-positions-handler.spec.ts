import { TestBed } from "@angular/core/testing";
import * as THREE from "three";
import { CarsPositionsHandler } from "./cars-positions-handler";
import { Car } from "../car/car";
import { WallsCollisionsService } from "./../../../services/walls-collisions/walls-collisions-service";
import { CarLoader } from "../car/car-loader";
import { KeyboardEventService } from "../../../commands/keyboard-event.service";
import { WallService } from "./../../../services/walls-collisions/walls";

/* tslint:disable:no-magic-numbers */
describe("CarsPositionsHandler", () => {
    const wallService: WallService = new WallService();
    const wallsCollisionsService: WallsCollisionsService = new WallsCollisionsService(wallService);
    const keyboard: KeyboardEventService = new KeyboardEventService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CarsPositionsHandler, WallsCollisionsService, WallService, KeyboardEventService]
        });
    });

    it("should define four positions for four cars", async () => {
        const position1: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
        const position2: THREE.Vector3 = new THREE.Vector3(-12, 9, 0);
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(new Car(wallsCollisionsService, keyboard));
            cars[i].mesh = await CarLoader.load();

        }
        CarsPositionsHandler.insertCars(new THREE.Line3(position1, position2), cars);
        for (let i: number = 0; i < 4; i++) {
            expect(cars[i].mesh.position === new THREE.Vector3()).toBeFalsy();
        }

    });

    it("should define a unique position for each car", async () => {
        const cars: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars.push(new Car(wallsCollisionsService, keyboard));
            cars[i].mesh = await CarLoader.load();
        }
        const position1: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
        const position2: THREE.Vector3 = new THREE.Vector3(-12, 9, 0);
        CarsPositionsHandler.insertCars(new THREE.Line3(position1, position2), cars);
        for (let i: number = 0; i < 4; i++) {
            for (let j: number = 0; j < 4; j++) {
                if (i === j) {
                    expect(cars[i].position === cars[j].position).toBeTruthy();
                } else {
                    expect(cars[i].position === cars[j].position).toBeFalsy();
                }
            }
        }
    });

    it("the cars shouldn't have the same random position for each service call", async () => {
        const cars1: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars1.push(new Car(wallsCollisionsService, keyboard));
            cars1[i].mesh = await CarLoader.load();
        }
        const cars2: Car[] = new Array<Car>();
        for (let i: number = 0; i < 4; i++) {
            cars2.push(new Car(wallsCollisionsService, keyboard));
            cars2[i].mesh = await CarLoader.load();
        }
        const position1: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
        const position2: THREE.Vector3 = new THREE.Vector3(-12, 9, 0);
        CarsPositionsHandler.insertCars(new THREE.Line3(position1, position2), cars1);
        CarsPositionsHandler.insertCars(new THREE.Line3(position1, position2), cars2);
        for (let i: number = 0; i < 4; i++) {
            expect(cars1[i].position === cars2[i].position).toBeFalsy();
        }
    });
});
