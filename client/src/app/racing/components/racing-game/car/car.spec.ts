import { Car, DEFAULT_WHEELBASE, DEFAULT_MASS, DEFAULT_DRAG_COEFFICIENT } from "./car";
import { Engine } from "./engine";
import { Wheel } from "./wheel";
import { WallsCollisionsService } from "../../../services/walls-collisions/walls-collisions-service";
import { KeyboardEventService } from "../../../commands/keyboard-event.service";
import { WallService } from "../../../services/walls-collisions/walls";

const MS_BETWEEN_FRAMES: number = 16.6667;

/* tslint:disable: no-magic-numbers */
class MockEngine extends Engine {
    public getDriveTorque(): number {
        return 10000;
    }
}
const wallService: WallService = new WallService();

const wallsCollisionsService: WallsCollisionsService = new WallsCollisionsService(wallService);
const keyboard: KeyboardEventService = new KeyboardEventService;

describe("Car", () => {
    let car: Car;

    beforeEach(async (done: () => void) => {
        car = new Car(wallsCollisionsService, keyboard, new MockEngine());
        await car.init();

        car.isAcceleratorPressed = true;
        car.update(MS_BETWEEN_FRAMES);
        car.isAcceleratorPressed = false;
        done();
    });

    it("should be instantiable using default constructor", () => {
        car = new Car(wallsCollisionsService, keyboard, new MockEngine());
        expect(car).toBeDefined();
        expect(car.speed.length()).toBe(0);
    });

    it("should accelerate when accelerator is pressed", () => {
        const initialSpeed: number = car.speed.length();
        car.isAcceleratorPressed = true;
        car.update(MS_BETWEEN_FRAMES);
        expect(car.speed.length()).toBeLessThanOrEqual(initialSpeed);
    });

    it("should decelerate when brake is pressed", () => {
        car.isAcceleratorPressed = true;
        car.update(MS_BETWEEN_FRAMES);
        car.isAcceleratorPressed = false;

        const initialSpeed: number = car.speed.length();
        car.carController.brake();
        car.update(MS_BETWEEN_FRAMES);
        expect(car.speed.length()).toBeLessThanOrEqual(initialSpeed);
    });

    it("should decelerate without brakes", () => {
        const initialSpeed: number = car.speed.length();

        car.carController.releaseBrakes();
        car.update(MS_BETWEEN_FRAMES);
        expect(car.speed.length()).toBeLessThanOrEqual(initialSpeed);
    });

    it("should turn left when left turn key is pressed", () => {
        const initialAngle: number = car.angle;
        car.isAcceleratorPressed = true;
        car.carController.steerLeft();
        car.update(MS_BETWEEN_FRAMES * 2);
        expect(car.angle).toBeLessThanOrEqual(initialAngle);
    });

    it("should turn right when right turn key is pressed", () => {
        const initialAngle: number = car.angle;
        car.isAcceleratorPressed = true;
        car.carController.steerRight();
        car.update(MS_BETWEEN_FRAMES * 2);
        expect(car.angle).toBeLessThanOrEqual(initialAngle);
    });

    it("should not turn when steering keys are released", () => {
        car.isAcceleratorPressed = true;
        car.carController.steerRight();
        car.update(MS_BETWEEN_FRAMES);

        const initialAngle: number = car.angle;
        car.carController.releaseSteering();
        car.update(MS_BETWEEN_FRAMES);
        expect(car.angle).toBe(initialAngle);
    });

    it("should use default engine parameter when none is provided", () => {
        car = new Car(wallsCollisionsService, keyboard, undefined);
        expect(car["engine"]).toBeDefined();
    });

    it("should use default Wheel parameter when none is provided", () => {
        car = new Car(wallsCollisionsService, keyboard, new MockEngine(), undefined);
        expect(car["rearWheel"]).toBeDefined();
    });

    it("should check validity of wheelbase parameter", () => {
        car = new Car(wallsCollisionsService, keyboard, new MockEngine(), new Wheel(), 0);
        expect(car["wheelbase"]).toBe(DEFAULT_WHEELBASE);
    });

    it("should check validity of mass parameter", () => {
        car = new Car(wallsCollisionsService,  keyboard, new MockEngine(), new Wheel(), DEFAULT_WHEELBASE, 0);
        expect(car["mass"]).toBe(DEFAULT_MASS);
    });

    it("should check validity of dragCoefficient parameter", () => {
        car = new Car(wallsCollisionsService, keyboard, new MockEngine(), new Wheel(), DEFAULT_WHEELBASE, DEFAULT_MASS, -10);
        expect(car["dragCoefficient"]).toBe(DEFAULT_DRAG_COEFFICIENT);
    });
});
