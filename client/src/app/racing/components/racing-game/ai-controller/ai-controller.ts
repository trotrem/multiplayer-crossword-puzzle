import { Car } from "../car/car";
import { Vector3 } from "three";
import { WallsCollisionsService } from "../walls-collisions-service/walls-collisions-service";
import { VectorUtils } from "../../../race-utils/vector-utils";
import { HALF_CIRCLE_DEGREES, LAP_MAX } from "./../../../../constants";
import { WallService } from "../walls-collisions-service/walls";
const MAX_SPEED: number = 50;
const MIN_SPEED: number = 10;
const MAX_DISTANCE: number = 18;
const MIN_DISTANCE: number = 13;
const MAX_ANGLE: number = 2;

export class AiController {

    private _checkPoints: Vector3[] = new Array<Vector3>();
    private hasTurned: boolean = false;
    private hasCollided: boolean = false;
    private distanceToCorner: number;

    public constructor(
        private _car: Car,
        points: THREE.Vector3[],
        private collisionWallService: WallsCollisionsService,
        private wallService: WallService) {
            this._checkPoints.shift();
            this._checkPoints = points.slice().reverse();
            this.distanceToCorner = this.randomIntFromInterval(MIN_DISTANCE, MAX_DISTANCE);
    }

    public update(): boolean {
        this.updateSpeed();
        const lap: boolean = this.updateCheckPoint();
        this.verifyCollisionWall();
        this.turnCorner();

        return lap;
    }

    private updateSpeed(): void {
        if (this._car.speed.length() < this.randomIntFromInterval(MIN_SPEED, MAX_SPEED)) {
            this.accelerate();
        } else {
            this.brake();
        }
    }

    private updateCheckPoint(): boolean {
        if (this._car.checkpoint === this._checkPoints.length - 1) {
            if (VectorUtils.getDistance(this._car.mesh.position, this._checkPoints[this._car.checkpoint]) < this.distanceToCorner) {
                this._car.checkpoint = 0;
                if (this._car.getLapTimes().length < LAP_MAX) {
                    return true;
                }
            }
        }

        return false;
    }

    private turnCorner(): void {
        if (VectorUtils.getDistance(this._car.mesh.position, this._checkPoints[this._car.checkpoint]) < this.distanceToCorner) {
            this.turn(this._car.checkpoint + 1);
            this.hasTurned = true;
        } else if (this.hasTurned) {
            this._car.carController.releaseSteering();
            this._car.checkpoint++;
            this.hasTurned = false;
        }
    }

    private verifyCollisionWall(): void {
        if (this.collisionWallService.getCollisionNormal(this._car, this.wallService.walls).length > 0) {
            this.turn(this._car.checkpoint);
            this.hasCollided = true;
        } else if (this.calculateAngle(this._car.checkpoint) < MAX_ANGLE && this.hasCollided) {
            this._car.carController.releaseSteering();
            this.hasCollided = false;
        }
    }

    private calculateAngle(index: number): number {
        return this._car.direction.angleTo(new Vector3(
            this._checkPoints[index].x - this._car.mesh.position.x,
            this._checkPoints[index].y - this._car.mesh.position.y,
            0)) * HALF_CIRCLE_DEGREES / Math.PI;
    }

    private randomIntFromInterval(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    private turn(index: number): void {
        if (this.getOrientation(index) > 0) {
            this._car.carController.steerRight();
        } else {
            this._car.carController.steerLeft();
        }
        this._car.isAcceleratorPressed = true;
    }

    private getOrientation(index: number): number {
        return this._car.direction.cross(new Vector3(
            this._car.mesh.position.x - this._checkPoints[index].x,
            this._car.mesh.position.y - this._checkPoints[index].y,
            0)).z;
    }

    private brake(): void {
        this._car.isAcceleratorPressed = false;
        this._car.carController.brake();
    }

    private accelerate(): void {
        this._car.carController.releaseBrakes();
        this._car.isAcceleratorPressed = true;
    }

}
