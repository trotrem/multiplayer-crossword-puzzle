import { Car } from "./car";

const MAXIMUM_STEERING_ANGLE: number = 0.25;

export class CarController {

    public constructor(private car: Car) { }

    public steerLeft(): void {
        this.car.steeringWheel = MAXIMUM_STEERING_ANGLE;
    }
    public steerRight(): void {
        this.car.steeringWheel = -MAXIMUM_STEERING_ANGLE;
    }
    public releaseSteering(): void {
        this.car.steeringWheel = 0;
    }
    public releaseBrakes(): void {
        this.car.isBraking = false;
    }
    public brake(): void {
        this.car.isBraking = true;
    }
}
