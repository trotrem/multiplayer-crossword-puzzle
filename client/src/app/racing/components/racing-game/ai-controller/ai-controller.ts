import { Car } from "../car/car";
import THREE = require("three");
import { Vector3 } from "three";
import { WallsCollisionsService } from "../walls-collisions-service/walls-collisions-service";
import { RaceUtils } from "../../../utils/utils";
import { HALF_CIRCLE_DEGREES } from "./../../../../constants";
const MAX_SPEED: number = 50;
const MIN_SPEED: number = 30;
const MAX_DISTANCE: number = 18;
const MIN_DISTANCE: number = 13;
const MAX_ANGLE: number = 2;

export class AiController {

    public isStarted: boolean = false;
    private _checkPoints: THREE.Vector3[] = new Array<THREE.Vector3>();
    private hasTurned: boolean = false;
    private hasCollided: boolean = false;
    private distanceToCorner: number;

    // TODO : Inject collisionWallService (later)
    public constructor(private _car: Car, points: THREE.Vector3[], private collisionWallService: WallsCollisionsService) {
        this._checkPoints.shift();
        this._checkPoints = points.slice().reverse();
        this.distanceToCorner = this.randomIntFromInterval(MIN_DISTANCE, MAX_DISTANCE);
    }

    public update(): void {
        this.updateSpeed();
        this.updateCheckPoint();
        this.verifyCollisionWall();
        this.turnCorner();
    }

    private updateSpeed(): void {
        if (this._car.speed.length() < this.randomIntFromInterval(MIN_SPEED, MAX_SPEED)) {
            this.accelerate();
        } else {
            this.brake();
        }
    }

    private updateCheckPoint(): void {
        if (this._car.checkpoint === this._checkPoints.length - 1) {
            if (RaceUtils.calculateDistance(this._car.mesh.position, this._checkPoints[this._car.checkpoint]) < this.distanceToCorner) {
                this._car.checkpoint = 0;
            }
        }
    }

    private turnCorner(): void {
        if (RaceUtils.calculateDistance(this._car.mesh.position, this._checkPoints[this._car.checkpoint]) < this.distanceToCorner) {
            this.turn(this._car.checkpoint + 1);
            this.hasTurned = true;
        } else if (this.hasTurned) {
            this._car.releaseSteering();
            this._car.checkpoint++;
            this.hasTurned = false;
        }
    }

    private verifyCollisionWall(): void {
        if (this.collisionWallService.getCollisionNormal(this._car).length > 0) {
            this.turn(this._car.checkpoint);
            this.hasCollided = true;
        } else if (this.calculateAngle(this._car.checkpoint) < MAX_ANGLE && this.hasCollided) {
            this._car.releaseSteering();
            this.hasCollided = false;
        }
    }

    private calculateAngle(index: number): number {
        return this._car.direction.angleTo(new Vector3(
            this._checkPoints[index].x - this._car.mesh.position.x,
            this._checkPoints[index].y - this._car.mesh.position.y,
            0)) * HALF_CIRCLE_DEGREES / Math.PI;
    }

    // TODO : À vérifier, utils pour gridword et racing ? utilisé dans les 2
    private randomIntFromInterval(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    private turn(index: number): void {
        if (this.getOrientation(index) > 0) {
            this._car.steerRight();
        } else {
            this._car.steerLeft();
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
        this._car.brake();
    }

    private accelerate(): void {
        this._car.releaseBrakes();
        this._car.isAcceleratorPressed = true;
    }

}
