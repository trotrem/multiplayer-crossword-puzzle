import * as THREE from "three";
import { Car } from "../Car";
import { Injectable } from "@angular/core";
import { Vector3 } from "three";

export interface IProjection {
    minProj: number;
    maxProj: number;
    minDot: number;
    maxDot: number;
}
export interface IMTV {
    direction: THREE.Vector3;
    distance: number;
}

const CAR_1_MOMENTUM_FACTOR: number = 2;
const CAR_2_MOMENTUM_FACTOR: number = 2;

@Injectable()
export class CarsCollisionService {

    private cars: Car[];
    private overlap: number = 100000;
    private smallest: THREE.Vector3 = null;
    private mtv: IMTV = { direction: null, distance: null };

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

        const resultP1: IProjection = this.getMinMax(vecCar1, normals1[1]);
        const resultP2: IProjection = this.getMinMax(vecCar2, normals1[1]);
        const resultQ1: IProjection = this.getMinMax(vecCar1, normals1[0]);
        const resultQ2: IProjection = this.getMinMax(vecCar2, normals1[0]);

        const resultR1: IProjection = this.getMinMax(vecCar1, normals2[1]);
        const resultR2: IProjection = this.getMinMax(vecCar2, normals2[1]);
        const resultS1: IProjection = this.getMinMax(vecCar1, normals2[0]);
        const resultS2: IProjection = this.getMinMax(vecCar2, normals2[0]);

        const separateP: boolean = resultP1.maxProj < resultP2.minProj || resultP2.maxProj < resultP1.minProj;
        if (!separateP) { this.overlaping(resultP1, resultP2, normals1[1]); }
        const separateQ: boolean = resultQ1.maxProj < resultQ2.minProj || resultQ2.maxProj < resultQ1.minProj;
        if (!separateQ) { this.overlaping(resultQ1, resultQ2, normals1[0]); }
        const separateR: boolean = resultR1.maxProj < resultR2.minProj || resultR2.maxProj < resultR1.minProj;
        if (!separateR) { this.overlaping(resultR1, resultR2, normals2[1]); }
        const separateS: boolean = resultS1.maxProj < resultS2.minProj || resultS2.maxProj < resultS1.minProj;
        if (!separateS) { this.overlaping(resultS1, resultS2, normals2[0]); }

        const isSeparate: boolean = separateP || separateQ || separateR || separateS;
        if (!isSeparate) {
            this.mtv.direction = new Vector3(2, 2, 0);
            this.mtv.distance = this.overlap;
        }

        return isSeparate;
    }

    private overlaping(result1: IProjection, result2: IProjection, axis: THREE.Vector3): void {
        let temp: number = this.getOverlap(result1, result2);
        if (temp < this.overlap) {
            this.overlap = temp;
            this.smallest = axis;
        }
    }

    private prepareShape(car: Car): THREE.Vector3[] {
        return car.getCorners(car.getUpdatedPosition().add(car.velocity));
    }

    public getOverlap(p1: IProjection, p2: IProjection): number {
        return (p1.maxProj < p2.maxProj) ? p1.maxProj - p2.minProj : p2.maxProj - p1.minProj;
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
        /*
        *   Step 1: Get the shape of each car
        *   Step 2: Get those normals
        *   Step 3: Check for overlaps for each axes
        *   Step 4: If overlapped, do physics stuff
        */
        for (let i: number = 0; i < this.cars.length - 1; i++) {
            for (let j: number = i + 1; j < this.cars.length; j++) {
                if (!this.detectCollision(this.cars[i], this.cars[j])) {
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
        const theta1: number = speedLength1 !== 0 ? Math.acos(car1.speed.x / speedLength1): 0;
        const theta2: number = speedLength2 !== 0 ? Math.acos(car2.speed.x / speedLength2): 0;

        // Random temps
        let temp1 = (2 * car2.Mass * speedLength2 * Math.cos(theta2 - phi)) / totalMass;
        let temp2 = speedLength1 * Math.sin(theta1 - phi);
        let temp3 = (2 * car1.Mass * speedLength1 * Math.cos(theta1 - phi)) / totalMass;
        let temp4 = (speedLength2 * Math.sin(theta2 - phi));

        // New speeds
        const newSpeedX1: number = ((temp1 * Math.cos(phi)) - (temp2 * Math.sin(phi))) / 2;
        const newSpeedY1: number = (temp1 * Math.sin(phi)) + (temp2 * Math.cos(phi));
        const newSpeedX2: number = (temp3 * Math.cos(phi)) - (temp4 * Math.sin(phi));
        const newSpeedY2: number = (temp3 * Math.sin(phi)) + (temp4 * Math.cos(phi));;

        //console.log(car1.speed.x + " " + car1.speed.y + " " + car1.speed.z)
        car1.speed = new THREE.Vector3(newSpeedX1, newSpeedY1, 0);
        car2.speed = new THREE.Vector3(newSpeedX2, newSpeedY2, 0);

        /* console.log("newSpeed1: " + newSpeedX1 + " " + newSpeedY1)
        console.log("NewSpped2: " + newSpeedX2 + " " + newSpeedY2)
        
        console.log("Masse totale: " + masseTotale)
        console.log("1: " + car1.speed.x)
        console.log("2: " + car2.speed.x)

        console.log("phi: " + phi)
        console.log("theta1: " + theta1)
        console.log("theta2: " + theta2)
        console.log("speedLenght1: " + speedLength1)
        console.log("speedLenght2: " + speedLength2)

        console.log("z: " + car1.speed.z)*/


        /* 1 Dimension */
        // console.log(car1.speed.x + " " + car1.speed.y + " " + car1.speed.z)

       /* const velocity1: THREE.Vector3 = car1.speed;
        const velocity2: THREE.Vector3 = car2.speed;

        //const totalMomentum: THREE.Vector3 = speed1.multiplyScalar(car1.Mass).add(speed2.multiplyScalar(car2.Mass));

        const newVelocity1: THREE.Vector3 = (velocity2.multiplyScalar(2 * car1.Mass)).divideScalar(car1.Mass + car2.Mass);
        const newVelocity2: THREE.Vector3 = (velocity1.multiplyScalar(2 * car2.Mass)).divideScalar(car2.Mass + car1.Mass);


        car1.speed = newVelocity1;
        car2.speed = newVelocity2;*/



    }
}
