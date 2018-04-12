import { Car } from "./car";

const MAXIMUM_STEERING_ANGLE: number = 0.25;

export class CarController extends Car {

    public steerLeft(): void {
        this.steeringWheelDirection = MAXIMUM_STEERING_ANGLE;
    }
    public steerRight(): void {
        this.steeringWheelDirection = -MAXIMUM_STEERING_ANGLE;
    }
    public releaseSteering(): void {
        this.steeringWheelDirection = 0;
    }
    public releaseBrakes(): void {
        this.isBraking = false;
    }
    public brake(): void {
        this.isBraking = true;
    }
}
