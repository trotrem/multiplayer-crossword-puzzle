import { Car } from "../car/car";
import THREE = require("three");
import { Vector3 } from "three";
import { Track } from "../../../track";
import { WallsCollisionsService } from "../walls-collisions-service/walls-collisions-service";
import { checkAndUpdateNode } from "@angular/core/src/view/view";
import { RaceUtils } from "../../../utils/utils";

const MAX_SPEED: number = 4;
const MAX_DISTANCE: number = 15;

export class AiController {

    // private _car: Car;
    public isStarted: boolean = false;
    private _checkPoints: THREE.Vector3[] = new Array<THREE.Vector3>();
    private _turned: Boolean;

    public constructor(private _car: Car, points: THREE.Vector3[]) {
        this._checkPoints.shift();
        this._checkPoints = points.slice().reverse();
        this._turned = false;
    }

    // Called each tick
    public async update(): Promise<void> {
        /*if (this.isStarted) {
            if (this._car.speed.length() < MAX_SPEED) {
                this.moveForward();
            } else {
                this._car.isAcceleratorPressed = false;
            }

            this.turn();

        }*/
    }

    private turn(): void {
        const angle: number = this._car.direction.cross(new Vector3(
            this._car.mesh.position.x - this._checkPoints[this._car.checkpoint + 1].x,
            this._car.mesh.position.y - this._checkPoints[this._car.checkpoint + 1].y,
            0)).z;
        if (RaceUtils.calculateDistance(this._car.mesh.position, this._checkPoints[this._car.checkpoint]) < MAX_DISTANCE) {
            if (angle > 0) {
                this._car.steerRight();
            } else {
                this._car.steerLeft();
            }
            this._turned = true;
        } else {
            this._car.releaseSteering();
            if (this._turned) {
                this._car.checkpoint++;
                if (this._car.checkpoint === this._checkPoints.length + 1) {
                    this._car.checkpoint = 0;
                }
                this._turned = false;
            }
        }
        // this._car.checkpointPlusPlus();

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

    private async delay(ms: number): Promise<{}> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

}
