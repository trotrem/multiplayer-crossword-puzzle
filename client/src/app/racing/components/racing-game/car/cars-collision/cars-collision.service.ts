import * as THREE from "three";
import { Car } from "../Car";
import { Injectable } from "@angular/core";

export interface IPoints {
    minProj: number;
    maxProj: number;
    minDot: number;
    maxDot: number;
}

@Injectable()
export class CarsCollisionService {

    private cars: Car[];

    public constructor() {
    }

    public initializeCars(cars: Car[]): void {
        this.cars = cars;
    }

    private detectCollision(car1: Car, car2: Car): boolean {
        const normals1: THREE.Vector3[] = car1.getNormals();
        const normals2: THREE.Vector3[] = car2.getNormals();

        const vecCar1: THREE.Vector3[] = this.prepareShape(car1);
        const vecCar2: THREE.Vector3[] = this.prepareShape(car2);

        const resultP1: IPoints = this.getMinMax(vecCar1, normals1[1]);
        const resultP2: IPoints = this.getMinMax(vecCar2, normals1[1]);
        const resultQ1: IPoints = this.getMinMax(vecCar1, normals1[0]);
        const resultQ2: IPoints = this.getMinMax(vecCar2, normals1[0]);

        const resultR1: IPoints = this.getMinMax(vecCar1, normals2[1]);
        const resultR2: IPoints = this.getMinMax(vecCar2, normals2[1]);
        const resultS1: IPoints = this.getMinMax(vecCar1, normals2[0]);
        const resultS2: IPoints = this.getMinMax(vecCar2, normals2[0]);

        const separateP: boolean = resultP1.maxProj < resultP2.minProj || resultP2.maxProj < resultP1.minProj;
        const separateQ: boolean = resultQ1.maxProj < resultQ2.minProj || resultQ2.maxProj < resultQ1.minProj;
        const separateR: boolean = resultR1.maxProj < resultR2.minProj || resultR2.maxProj < resultR1.minProj;
        const separateS: boolean = resultS1.maxProj < resultS2.minProj || resultS2.maxProj < resultS1.minProj;

        return (separateP || separateQ || separateR || separateS);

    }

    private prepareShape(car: Car): THREE.Vector3[] {

        return car.getCorners(car.getUpdatedPosition().add(car.velocity));
    }

    private getMinMax(vecCar: THREE.Vector3[], axis: THREE.Vector3): IPoints {
        const points: IPoints = {
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
        /*
        *   Step 1: Get the shape of each car
        *   Step 2: Get those normals
        *   Step 3: Check for overlaps for each axes
        *   Step 4: If overlapped, do physics stuff
        */
        for (let i: number = 0; i < this.cars.length - 1; i++) {
            for (let j: number = i + 1; j < this.cars.length; j++) {
                if (!this.detectCollision(this.cars[i], this.cars[j])) {
                    console.log("BOOM");
                }
            }
        }

    }

    private overlap(vector: THREE.Vector3): boolean {
        return true;
    }

    private handleCollisions(): void {

    }
}
