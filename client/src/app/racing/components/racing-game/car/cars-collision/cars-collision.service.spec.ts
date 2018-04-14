import { TestBed } from "@angular/core/testing";
import * as THREE from "three";
import { CarsCollisionService } from "./cars-collision.service";
import { KeyboardService } from "../../commands/keyboard.service";
import { WallsCollisionsService } from "../../walls-collisions-service/walls-collisions-service";
import { Car } from "../car";
import { CarLoader } from "../car-loader";
describe("CarsCollisionService", () => {
    const carLoader: CarLoader = new CarLoader();
    const wallsCollisionsService: WallsCollisionsService = new WallsCollisionsService();
    const keyboard: KeyboardService = new KeyboardService;
    const carsCollision: CarsCollisionService = new CarsCollisionService();

    it("Should detect a collision between two cars", async () => {
        const cars: Car[] = new Array<Car>();
        let isCollided: boolean = false;
        for (let i: number = 0; i < 2; i++) {
            cars.push(new Car(wallsCollisionsService, keyboard));
            cars[i].mesh = await carLoader.load();
        }
        cars[0].mesh.position.set(0, 0, 0);
        cars[1].mesh.position.set(1, 1, 0);
        isCollided = carsCollision.detectCollision(cars);
        expect(isCollided).toBe(true);
    });

    it("should Handle collision", () => {

    });

});
