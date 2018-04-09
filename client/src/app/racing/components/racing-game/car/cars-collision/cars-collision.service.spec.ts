import { TestBed } from "@angular/core/testing";
import * as THREE from "three";
import { CarsCollisionService } from "./cars-collision.service";
import { KeyboardService } from "../../commands/keyboard.service";
import { WallsCollisionsService } from "../../walls-collisions-service/walls-collisions-service";
import { Car } from "../car";
describe("CarsCollisionService", () => {
    it("Should detect a collision between two cars", () => {
        const keyboard: KeyboardService = new KeyboardService();
        const wallsCollision: WallsCollisionsService = new WallsCollisionsService();
        const car1: Car = new Car(wallsCollision, keyboard);
        const car2: Car = new Car(wallsCollision, keyboard);
        const carsCollision: CarsCollisionService = new CarsCollisionService();
        let collision: boolean = false;
        // les deux car devrait se superposer
        car1.mesh.position.set(0, 0, 0);
        car2.mesh.position.set(1, 1, 0);
        collision = carsCollision.detectCollision(car1, car2);
        expect(collision).toBe(true);
    });

});
