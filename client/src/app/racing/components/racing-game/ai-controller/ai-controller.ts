import { Car } from "../car/car";
import THREE = require("three");
import { Vector3 } from "three";
import { Track } from "../../../track";
import { WallsCollisionsService } from "../walls-collisions-service/walls-collisions-service";
import { checkAndUpdateNode } from "@angular/core/src/view/view";
import { RaceUtils } from "../../../utils/utils";

const MAX_SPEED: number = 19;

export class AiController {

    // private _car: Car;
    public isStarted: boolean = false;
    private _checkPoints: THREE.Vector3[] = new Array<THREE.Vector3>();
    private p: number = 9;

    public constructor(private _car: Car, points: THREE.Vector3[]) {
        this._checkPoints.shift();
        this._checkPoints = points.slice().reverse();
    }

    // Called each tick
    public async update(): Promise<void> {
        if (this.isStarted) {
            if (this._car.speed.length() < MAX_SPEED) {
                this.moveForward();
            } else {
                this._car.isAcceleratorPressed = false;
            }
            this.turn();

        }
    }

    private turn(): void {
        const vector: Vector3 = new Vector3(
            this._car.mesh.position.x - this._checkPoints[this._car.checkpoint + 1].x,
            this._car.mesh.position.y - this._checkPoints[this._car.checkpoint + 1].y,
            0);
        const angle: number = this._car.direction.cross(vector).z;
        if (RaceUtils.calculateDistance(this._car.mesh.position, this._checkPoints[this._car.checkpoint]) < 10) {
            if (angle > 0) {
                this._car.steerRight();
            } else {
                this._car.steerLeft();
            }
            this._car.isAcceleratorPressed = true;
            this._car.checkpointPlusPlus();
            console.log(this._car.checkpoint);
        }

    }

    /*private getAngle(x: number, y: number): number {
        return Math.atan2(y, x) * 180 / Math.PI;
    }*/

    private brake(): void {
        this._car.isAcceleratorPressed = false;
        this._car.brake();
    }

    private moveForward(): void {
        this._car.releaseBrakes();
        this._car.isAcceleratorPressed = true;
    }

}
