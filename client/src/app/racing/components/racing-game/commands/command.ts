import { Car } from "./../car/car";
import { RenderGameService } from "./../render-game-service/render-game.service";

// Reason to disable: All classes are simply concrete commands of ICommand. 
/* tslint:disable:max-classes-per-file*/
export interface IMap<T> {
    [key: string]: T;
}

export interface ICommand {
    execute(): void;
}

export class AccelerationCommand implements ICommand {
    private _car: Car;

    public constructor(car: Car) {
        this._car = car;
    }

    public execute(): void {
        this._car.isAcceleratorPressed = true;
    }
}

export class BrakeCommand implements ICommand {
    private _car: Car;

    public constructor(car: Car) {
        this._car = car;
    }

    public execute(): void {
        this._car.carController.brake();
    }
}

export class DecelerateCommand implements ICommand {
    private _car: Car;

    public constructor(car: Car) {
        this._car = car;
    }

    public execute(): void {
        this._car.isAcceleratorPressed = false;
    }
}

export class ReleaseBrakesCommand implements ICommand {
    private _car: Car;

    public constructor(car: Car) {
        this._car = car;
    }

    public execute(): void {
        this._car.carController.releaseBrakes();
    }
}

export class ReleaseSteerCommand implements ICommand {
    private _car: Car;

    public constructor(car: Car) {
        this._car = car;
    }

    public execute(): void {
        this._car.carController.releaseSteering();
    }
}

export class SteerLeftCommand implements ICommand {
    private _car: Car;

    public constructor(car: Car) {
        this._car = car;
    }

    public execute(): void {
        this._car.carController.steerLeft();
    }
}

export class SteerRightCommand implements ICommand {
    private _car: Car;

    public constructor(car: Car) {
        this._car = car;
    }

    public execute(): void {
        this._car.carController.steerRight();
    }
}

export class SwitchCameraCommand implements ICommand {
    public constructor(private renderService: RenderGameService) {
    }

    public execute(): void {
        this.renderService.toggleCamera();
    }
}

export class ZoomInCommand implements ICommand {
    public constructor(private renderService: RenderGameService) {
    }

    public execute(): void {
        this.renderService.zoomIn();
    }
}

export class ZoomOutCommand implements ICommand {
    public constructor(private renderService: RenderGameService) {
    }

    public execute(): void {
        this.renderService.zoomOut();
    }
}
