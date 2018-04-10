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
    private _normals1: Array<THREE.Vector3>;
    private _normals2: Array<THREE.Vector3>;
    private _vecCar1: Array<THREE.Vector3>;
    private _vecCar2: Array<THREE.Vector3>;

    public constructor() {
        this._cars = [];
        this._normals1 = [];
        this._normals2 = [];
        this._vecCar1 = [];
        this._vecCar2 = [];
    }

    public initializeCars(cars: Car[]): void {
        this._cars = cars;
    }

    private shapeAroundCar(car1: Car, car2: Car): void {
        this._normals1 = car1.getNormals();
        this._normals2 = car2.getNormals();
        this._vecCar1 = this.prepareShape(car1);
        this._vecCar2 = this.prepareShape(car2);
    }

    private detectCollision(car1: Car, car2: Car): boolean {
        this.shapeAroundCar(car1, car2);
        const resultP1: IProjection = this.getMinMax(this._vecCar1, this._normals1[1]);
        const resultP2: IProjection = this.getMinMax(this._vecCar2, this._normals1[1]);
        const resultQ1: IProjection = this.getMinMax(this._vecCar1, this._normals1[0]);
        const resultQ2: IProjection = this.getMinMax(this._vecCar2, this._normals1[0]);

        const resultR1: IProjection = this.getMinMax(this._vecCar1, this._normals2[1]);
        const resultR2: IProjection = this.getMinMax(this._vecCar2, this._normals2[1]);
        const resultS1: IProjection = this.getMinMax(this._vecCar1, this._normals2[0]);
        const resultS2: IProjection = this.getMinMax(this._vecCar2, this._normals2[0]);

        const separateP: boolean = resultP1.maxProj < resultP2.minProj || resultP2.maxProj < resultP1.minProj;
        const separateQ: boolean = resultQ1.maxProj < resultQ2.minProj || resultQ2.maxProj < resultQ1.minProj;
        const separateR: boolean = resultR1.maxProj < resultR2.minProj || resultR2.maxProj < resultR1.minProj;
        const separateS: boolean = resultS1.maxProj < resultS2.minProj || resultS2.maxProj < resultS1.minProj;

        return !(separateP || separateQ || separateR || separateS);


        /*
        this.shapeAroundCar(car1, car2);
        const resultP1: IProjection = this.getMinMax(this.vecCar1, this.normals1[1]);
        const resultP2: IProjection = this.getMinMax(this.vecCar2, this.normals1[1]);
        const resultQ1: IProjection = this.getMinMax(this.vecCar1, this.normals1[0]);
        const resultQ2: IProjection = this.getMinMax(this.vecCar2, this.normals1[0]);

        const resultR1: IProjection = this.getMinMax(this.vecCar1, this.normals2[1]);
        const resultR2: IProjection = this.getMinMax(this.vecCar2, this.normals2[1]);
        const resultS1: IProjection = this.getMinMax(this.vecCar1, this.normals2[0]);
        const resultS2: IProjection = this.getMinMax(this.vecCar2, this.normals2[0]);

        const separateP: boolean = resultP1.maxProj < resultP2.minProj || resultP2.maxProj < resultP1.minProj;
        const separateQ: boolean = resultQ1.maxProj < resultQ2.minProj || resultQ2.maxProj < resultQ1.minProj;
        const separateR: boolean = resultR1.maxProj < resultR2.minProj || resultR2.maxProj < resultR1.minProj;
        const separateS: boolean = resultS1.maxProj < resultS2.minProj || resultS2.maxProj < resultS1.minProj;

        return !(separateP || separateQ || separateR || separateS);
        */

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
        for (let i: number = 0; i < this._cars.length - 1; i++) {
            for (let j: number = i + 1; j < this._cars.length; j++) {
                if (this.detectCollision(this._cars[i], this._cars[j])) {
                    this.handleCollisions(this._cars[i], this._cars[j]);
                }
            }
        }

    }

    private handleCollisions(car1: Car, car2: Car): void {
        let speedFactorVector: THREE.Vector3 = new THREE.Vector3(0, 0 ,0);
        const totalMass: number = car1.Mass + car2.Mass;
        const speedLength1: number = car1.speed.length();
        const speedLength2: number = car2.speed.length();
        // Angle entre les 2 positions de voitures
        const phi: number = car1.getUpdatedPosition().angleTo(car2.getUpdatedPosition());
        // Angles des vitesses
        const theta1: number = car1.speed.length() !== 0 ? Math.acos(car1.speed.x / car1.speed.length()) : 0;
        const theta2: number = car2.speed.length() !== 0 ? Math.acos(car2.speed.x / car2.speed.length()) : 0;

        const temp1: number = (car2.Mass * speedLength2 * Math.cos(theta2 - phi) * 2) / totalMass;
        const temp2: number = car1.speed.length() * Math.sin(theta1 - phi);
        const temp3: number = (car1.Mass * speedLength1 * Math.cos(theta1 - phi) * 2) / totalMass;
        const temp4: number = (car2.speed.length() * Math.sin(theta2 - phi));

        const newSpeedX1: number = ((temp1 * Math.cos(phi)) - (temp2 * Math.sin(phi))) / CAR_1_MOMENTUM_FACTOR;
        const newSpeedZ1: number = ((temp1 * Math.sin(phi)) + (temp2 * Math.cos(phi))) / CAR_1_MOMENTUM_FACTOR;
        const newSpeedX2: number = ((temp3 * Math.cos(phi)) - (temp4 * Math.sin(phi))) / CAR_2_MOMENTUM_FACTOR;
        const newSpeedZ2: number = ((temp3 * Math.sin(phi)) + (temp4 * Math.cos(phi))) / CAR_2_MOMENTUM_FACTOR;
       
        const newSpeed1 = new THREE.Vector3(newSpeedX1, 0, newSpeedZ1);
        const newSpeed2 = new THREE.Vector3(newSpeedX2, 0, newSpeedZ2);

        car1.speed = car1.speed.length() > MINIMUM_SPEED ? newSpeed1 : car1.speed.add( speedFactorVector.set(car1.speed.x, 0,  car1.speed.z));
        car2.speed = car2.speed.length() > MINIMUM_SPEED ? newSpeed2 : car2.speed.add( speedFactorVector.set(car2.speed.x, 0,  car2.speed.z));
    }
}
