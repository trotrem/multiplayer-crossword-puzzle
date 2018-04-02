import { Car } from "../car/car";
import THREE = require("three");
import { Vector3 } from "three";
import { WallsCollisionsService } from "../walls-collisions-service/walls-collisions-service";
import { checkAndUpdateNode } from "@angular/core/src/view/view";
import { RaceUtils } from "../../../utils/utils";

const MAX_SPEED: number = 50;
const MIN_SPEED: number = 10;
const MAX_DISTANCE: number = 15;

export class AiController {

    public isStarted: boolean = false;
    private _checkPoints: THREE.Vector3[] = new Array<THREE.Vector3>();

    public constructor(private _car: Car, points: THREE.Vector3[]) {
        this._checkPoints.shift();
        this._checkPoints = points.slice().reverse();
    }

    // Called each tick
    public update(): void {
        if (this._car.speed.length() < MIN_SPEED) {
            this.moveForward();
        } else {
            // this._car.isAcceleratorPressed = false;
            this.brake();
        }
        if (this._car.checkpoint === this._checkPoints.length - 1) {
            this._car.checkpoint = 0;
        }
        if (RaceUtils.calculateDistance(this._car.mesh.position, this._checkPoints[this._car.checkpoint]) < MAX_DISTANCE) {
            this.turn();
        } else {
            this._car.releaseSteering();
            this._car.checkpoint++;
        }

    }

    private maxSpeed(): number {
        return Math.floor(Math.random() * MAX_SPEED) + MIN_SPEED;
    }

    private turn(): void {
        if (this._car.direction.cross(new Vector3(
            this._car.mesh.position.x - this._checkPoints[this._car.checkpoint + 1].x,
            this._car.mesh.position.y - this._checkPoints[this._car.checkpoint + 1].y,
            0)).z > 0) {
            this._car.steerRight();
        } else {
            this._car.steerLeft();
        }
    }

    private brake(): void {
        this._car.isAcceleratorPressed = false;
        this._car.brake();
    }

    private moveForward(): void {
        this._car.releaseBrakes();
        this._car.isAcceleratorPressed = true;
    }

}
