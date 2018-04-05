import { Car } from "../car/car";
import THREE = require("three");
import { Vector3 } from "three";
import { WallsCollisionsService } from "../walls-collisions-service/walls-collisions-service";
import { RaceUtils } from "../../../utils/utils";
import { HALF_CIRCLE_DEGREES } from "./../../../../constants";
const MAX_SPEED: number = 50;
const MIN_SPEED: number = 30;
const MAX_DISTANCE: number = 18;
const MIN_DISTANCE: number = 15;
const MAX_ANGLE: number = 2;

export class AiController {

    public isStarted: boolean = false;
    private _checkPoints: THREE.Vector3[] = new Array<THREE.Vector3>();
    private hadTurned: boolean = false;
    private collision: boolean = false;
    private maxDistance: number;

    public constructor(private _car: Car, points: THREE.Vector3[], private collisionWallService: WallsCollisionsService) {
        this._checkPoints.shift();
        this._checkPoints = points.slice().reverse();
        this.maxDistance = this.randomIntFromInterval(MIN_DISTANCE, MAX_DISTANCE);
    }

    public update(): void {
        if (this._car.speed.length() < this.randomIntFromInterval(MIN_SPEED, MAX_SPEED)) {
            this.moveForward();
        } else {
            this.brake();
        }
        if (this._car.checkpoint === this._checkPoints.length - 1) {
            this._car.checkpoint = 0;
        }
        this.verifyCollisionWall();
        this.turnCorner();
    }

    private turnCorner(): void {
        if (RaceUtils.calculateDistance(this._car.mesh.position, this._checkPoints[this._car.checkpoint]) < this.maxDistance) {
            this.turn(this._car.checkpoint + 1);
            this.hadTurned = true;
        } else if (this.hadTurned) {
            this._car.releaseSteering();
            this._car.checkpoint++;
            this.hadTurned = false;
        }
    }

    private verifyCollisionWall(): void {
        if (this.collisionWallService.getCollisionNormal(this._car).length > 0) {
            this.turn(this._car.checkpoint);
            this.collision = true;
        } else if (this.calculateAngle(this._car.checkpoint) < MAX_ANGLE && this.collision) {
            this._car.releaseSteering();
            this.collision = false;
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
        if (this.calculeOrientation(index) > 0) {
            this._car.steerRight();
        } else {
            this._car.steerLeft();
        }
        this._car.isAcceleratorPressed = true;
    }

    private calculeOrientation(index: number): number {
        return this._car.direction.cross(new Vector3(
            this._car.mesh.position.x - this._checkPoints[index].x,
            this._car.mesh.position.y - this._checkPoints[index].y,
            0)).z;
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
