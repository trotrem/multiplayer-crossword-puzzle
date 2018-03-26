import { ICommand } from "../command";
import { Car } from "../../car/car";

export class SteerRightCommand implements ICommand {
    private _car: Car;

    public constructor(car: Car) {
        this._car = car;
    }

    public execute(): void {
        this._car.steerRight();
    }
}
