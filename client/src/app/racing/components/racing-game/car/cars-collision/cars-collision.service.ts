import * as THREE from "three";
import { Car } from "../Car";
import { Injectable } from "@angular/core";

export interface IProjection {
    minProj: number;
    maxProj: number;
    minDot: number;
    maxDot: number;
}

const CAR_1_MOMENTUM_FACTOR: number = 3.9;
const CAR_2_MOMENTUM_FACTOR: number = 4.1;
const MINIMUM_SPEED: number = 0.05;

@Injectable()
export class CarsCollisionService {

    private _cars: Car[];
    private _normals: Array<Array<THREE.Vector3>>;
    private _vecCar: Array<Array<THREE.Vector3>>;

    public constructor() {
        this._cars = [];
        this._normals = [];
        this._vecCar = [];
    }

    public initializeCars(cars: Car[]): void {
        this._cars = cars;
    }

    private shapeAroundCar(cars: Car[]): void {
        for (let i = 0; i < cars.length; i++) {
            this._normals[i] = cars[i].getNormals();
            this._vecCar[i] = this.prepareShape(cars[i]);
        }
    }

    public detectCollision(cars: Car[]): boolean {
        this.shapeAroundCar(cars);

        const resultP1: IProjection = this.getMinMax(this._vecCar[0], this._normals[0][1]);
        const resultP2: IProjection = this.getMinMax(this._vecCar[1], this._normals[0][1]);
        const resultQ1: IProjection = this.getMinMax(this._vecCar[0], this._normals[0][0]);
        const resultQ2: IProjection = this.getMinMax(this._vecCar[1], this._normals[0][0]);

        const resultR1: IProjection = this.getMinMax(this._vecCar[0], this._normals[1][1]);
        const resultR2: IProjection = this.getMinMax(this._vecCar[1], this._normals[1][1]);
        const resultS1: IProjection = this.getMinMax(this._vecCar[0], this._normals[1][0]);
        const resultS2: IProjection = this.getMinMax(this._vecCar[1], this._normals[1][0]);

        const separateP: boolean = resultP1.maxProj < resultP2.minProj || resultP2.maxProj < resultP1.minProj;
        const separateQ: boolean = resultQ1.maxProj < resultQ2.minProj || resultQ2.maxProj < resultQ1.minProj;
        const separateR: boolean = resultR1.maxProj < resultR2.minProj || resultR2.maxProj < resultR1.minProj;
        const separateS: boolean = resultS1.maxProj < resultS2.minProj || resultS2.maxProj < resultS1.minProj;

        return !(separateP || separateQ || separateR || separateS);
    }

    private prepareShape(car: Car): THREE.Vector3[] {
        return car.getCorners(car.getUpdatedPosition().add(car.velocity));
    }

    private getMinMax(vecCar: THREE.Vector3[], axis: THREE.Vector3): IProjection {
        const points: IProjection = {
            minProj: vecCar[1].dot(axis),
            minDot: 1,
            maxProj: vecCar[1].dot(axis),
            maxDot: 1,
        };
        for (let j: number = 2; j < vecCar.length; j++) {
            const currProj: number = vecCar[j].dot(axis);
            if (points.minProj > currProj) {
                points.minProj = currProj;
                points.minDot = j;
            }
            if (currProj > points.maxProj) {
                points.maxProj = currProj;
                points.maxDot = j;
            }
        }

        return points;
    }

    public checkCarsCollisions(): void {
        let tempCars: Car[] = [];
        for (let i: number = 0; i < this._cars.length - 1; i++) {
            for (let j: number = i + 1; j < this._cars.length; j++) {
                tempCars = [this._cars[i], this._cars[j]];
                if (this.detectCollision(tempCars)) {
                    this.handleCollisions(tempCars);
                }
            }
        }

    }

    private handleCollisions(cars: Car[]): void {
        const totalMass: number = cars[0].Mass + cars[1].Mass;
        const speedLength1: number = cars[0].speed.length();
        const speedLength2: number = cars[1].speed.length();
        // Angle entre les 2 positions de voitures
        const phi: number = cars[0].getUpdatedPosition().angleTo(cars[1].getUpdatedPosition());
        // Angles des vitesses
        const theta1: number = cars[0].speed.length() !== 0 ? Math.acos(cars[0].speed.x / cars[0].speed.length()) : 0;
        const theta2: number = cars[1].speed.length() !== 0 ? Math.acos(cars[1].speed.x / cars[1].speed.length()) : 0;

        const temp1: number = (cars[1].Mass * speedLength2 * Math.cos(theta2 - phi) * 2) / totalMass;
        const temp2: number = cars[0].speed.length() * Math.sin(theta1 - phi);
        const temp3: number = (cars[0].Mass * speedLength1 * Math.cos(theta1 - phi) * 2) / totalMass;
        const temp4: number = (cars[1].speed.length() * Math.sin(theta2 - phi));

        const newSpeedX1: number = ((temp1 * Math.cos(phi)) - (temp2 * Math.sin(phi))) / CAR_1_MOMENTUM_FACTOR;
        const newSpeedZ1: number = ((temp1 * Math.sin(phi)) + (temp2 * Math.cos(phi))) / CAR_1_MOMENTUM_FACTOR;
        const newSpeedX2: number = ((temp3 * Math.cos(phi)) - (temp4 * Math.sin(phi))) / CAR_2_MOMENTUM_FACTOR;
        const newSpeedZ2: number = ((temp3 * Math.sin(phi)) + (temp4 * Math.cos(phi))) / CAR_2_MOMENTUM_FACTOR;

        const newSpeed1 = new THREE.Vector3(newSpeedX1, 0, newSpeedZ1);
        const newSpeed2 = new THREE.Vector3(newSpeedX2, 0 , newSpeedZ2);

        cars[0].speed = cars[0].speed.length() !== 0 ? newSpeed1: cars[0].speed;
        cars[1].speed = cars[1].speed.length() !== 0 ? newSpeed2: cars[1].speed;
    }
}
