import { Car } from "../car/car";
import THREE = require("three");
import { Vector3 } from "three";
import { Track } from "../../../track";
import { WallsCollisionsService } from "../walls-collisions-service/walls-collisions-service";
import { checkAndUpdateNode } from "@angular/core/src/view/view";

const MAX_SPEED: number = 4;
const MAX_ACCEPTABLE_ANGLE: number = 0;

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
    public update(): void {
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
        if (this._car.checkpoint !== this.p) {
            console.log("eh");
        }
        this.p = this._car.checkpoint;
        const dir: Vector3 = this._car.direction;
        const angle: number = Math.asin(dir.cross(this._checkPoints[this._car.checkpoint]).z);
        if (Math.abs(angle) > MAX_ACCEPTABLE_ANGLE) {
            if (angle > 0) {
                this._car.steerRight();
            } else {
                this._car.steerLeft();
            }
        } else {
            this._car.releaseSteering();
        }
    }

    private getAngle(x: number, y: number): number {
        return Math.atan2(y, x) * 180 / Math.PI;
    }

    private shouldTurnLeft(angle: number, destinationAngle: number): boolean {
        let cnt1: number = 0;
        let angle1: number = angle;
        while (angle1 !== destinationAngle) {
            angle1 += 1;
            if (angle1 > 180) {
                angle1 = -180;
            }
            cnt1 += 1;
        }

        return cnt1 < 180;
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
