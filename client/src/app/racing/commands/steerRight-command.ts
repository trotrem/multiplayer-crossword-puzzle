import { ICommand } from "./command";
import { Car } from "../car/car";

export class SteerRightCommand implements ICommand {
    private car: Car;

    public constructor(car: Car) {
        this.car = car;
    }

    public Execute(): void {
        this.car.steerRight();
    }
}
