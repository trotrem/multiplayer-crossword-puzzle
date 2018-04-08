import * as THREE from "three";
import { Car } from "../Car";
import { Injectable } from "@angular/core";

export interface IProjection {
    minProj: number;
    maxProj: number;
    minDot: number;
    maxDot: number;
}

const CAR_1_MOMENTUM_FACTOR: number = 1.9;
const CAR_2_MOMENTUM_FACTOR: number = 2.1;

@Injectable()
export class CarsCollisionService {

    private cars: Car[];
    private overlap: number = 100000;
    private smallest: THREE.Vector3 = null;
    private normals1: THREE.Vector3[];
    private normals2: THREE.Vector3[];
    private vecCar1: THREE.Vector3[];
    private vecCar2: THREE.Vector3[];

    public constructor() {
        this.smallest = null;
        this.normals1 = [];
        this.normals2 = [];
        this.vecCar1 = [];
        this.vecCar2 = [];

    }

    public initializeCars(cars: Car[]): void {
        this.cars = cars;
    }

    private shapeAroundCar(car1: Car, car2: Car): void {
        this.normals1 = car1.getNormals();
        this.normals2 = car2.getNormals();

        this.vecCar1 = this.prepareShape(car1);
        this.vecCar2 = this.prepareShape(car2);
    }

    private detectCollision(car1: Car, car2: Car): boolean {
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
        for (let i: number = 0; i < this.cars.length - 1; i++) {
            for (let j: number = i + 1; j < this.cars.length; j++) {
                if (this.detectCollision(this.cars[i], this.cars[j])) {
                    this.handleCollisions(this.cars[i], this.cars[j]);
                }
            }
        }

    }

    private handleCollisions(car1: Car, car2: Car): void {      
        // Masse
        const totalMass: number = car1.Mass + car2.Mass;
        // Magnitude of speeds
        const speedLength1: number = car1.speed.length();
        const speedLength2: number = car2.speed.length();
        // Angles
        const phi: number = car1.getUpdatedPosition().angleTo(car2.getUpdatedPosition());
        const theta1: number = speedLength1 !== 0 ? Math.acos(car1.speed.x / speedLength1) : 0;
        const theta2: number = speedLength2 !== 0 ? Math.acos(car2.speed.x / speedLength2) : 0;
        // Random temps
        let temp1 = (2 * car2.Mass * speedLength2 * Math.cos(theta2 - phi)) / totalMass;
        let temp2 = speedLength1 * Math.sin(theta1 - phi);
        let temp3 = (2 * car1.Mass * speedLength1 * Math.cos(theta1 - phi)) / totalMass;
        let temp4 = (speedLength2 * Math.sin(theta2 - phi));
        // New speeds
        const newSpeedX1: number = ((temp1 * Math.cos(phi)) - (temp2 * Math.sin(phi))) / CAR_1_MOMENTUM_FACTOR;
        const newSpeedY1: number = (temp1 * Math.sin(phi)) + (temp2 * Math.cos(phi)) / CAR_1_MOMENTUM_FACTOR;
        const newSpeedX2: number = (temp3 * Math.cos(phi)) - (temp4 * Math.sin(phi)) / CAR_2_MOMENTUM_FACTOR;
        const newSpeedY2: number = (temp3 * Math.sin(phi)) + (temp4 * Math.cos(phi)) / CAR_2_MOMENTUM_FACTOR;

        car1.speed = new THREE.Vector3(newSpeedX1, 0, newSpeedY1);
        car2.speed = new THREE.Vector3(newSpeedX2, 0, newSpeedY2);
    }
}
