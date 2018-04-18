
import { CarsCollisionService } from "./cars-collision.service";
import { KeyboardEventService } from "../../commands/keyboard-event.service";
import { WallsCollisionsService } from "../../walls-collisions-service/walls-collisions-service";
import { Car } from "../car";
import { CarLoader } from "../car-loader";
import { WallService } from "../../walls-collisions-service/walls";
describe("CarsCollisionService", () => {
    const wallsCollisionsService: WallsCollisionsService = new WallsCollisionsService();
    const keyboard: KeyboardEventService = new KeyboardEventService;
    const carsCollision: CarsCollisionService = new CarsCollisionService();
    const wallService: WallService = new WallService();

    it("Should detect a collision between two cars", async () => {
        const cars: Car[] = new Array<Car>();
        let isCollided: boolean = false;
        for (let i: number = 0; i < 2; i++) {
            cars.push(new Car(wallsCollisionsService, wallService, keyboard));
            cars[i].mesh = await CarLoader.load();
        }
        cars[0].mesh.position.set(0, 0, 0);
        cars[1].mesh.position.set(1, 1, 0);
        isCollided = carsCollision.detectCollision(cars);
        expect(isCollided).toBe(true);
    });
});
