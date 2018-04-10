import * as THREE from "three";
import { Car } from "../Car";
import { Injectable } from "@angular/core";

// Possible refactor
export interface IProjection {
    minProj: number;
    maxProj: number;
    minDot: number;
    maxDot: number;
}

const CAR_1_MOMENTUM_FACTOR: number = 3.9;
const CAR_2_MOMENTUM_FACTOR: number = 4.1;
const MINIMUM_SPEED: number = 0.05;
const SPEED_VECTOR_FACTOR: THREE.Vector3 = new THREE.Vector3(2.5, 0, 2.5);

@Injectable()
export class CarsCollisionService {

    private _cars: Car[];
    private _normals: Array<Array<THREE.Vector3>>;
    private _vecCars: Array<Array<THREE.Vector3>>;

    public constructor() {
        this._cars = [];
        this._normals = [];
        this._vecCars = [];
    }

    public initializeCars(cars: Car[]): void {
        this._cars = cars;
    }

    private prepareShape(car: Car): THREE.Vector3[] {
        return car.getCorners(car.getUpdatedPosition().add(car.velocity));
    }

    private shapeAroundCar(cars: Car[]): void {
        for (let i = 0; i < cars.length; i++) {
            this._normals[i] = cars[i].getNormals();
            this._vecCars[i] = this.prepareShape(cars[i]);
        }
    }

    /*********************************************************************REFACTOR*********************************************************************/
    private detectCollision(cars: Car[]): boolean {
        this.shapeAroundCar(cars);
        let resultsP: IProjection[] = [];
        let resultsQ: IProjection[] = [];
        let resultsR: IProjection[] = [];
        let resultsS: IProjection[] = [];
        for (let i = 0; i < cars.length; i++) {
            resultsP[i] = this.getMinMax(this._vecCars[i], this._normals[0][1]);
            resultsQ[i] = this.getMinMax(this._vecCars[i], this._normals[0][0]);
            resultsR[i] = this.getMinMax(this._vecCars[i], this._normals[1][1]);
            resultsS[i] = this.getMinMax(this._vecCars[i], this._normals[1][0]);
        }
        const separateP: boolean = resultsP[0].maxProj < resultsP[1].minProj || resultsP[1].maxProj < resultsP[0].minProj;
        const separateQ: boolean = resultsQ[0].maxProj < resultsQ[1].minProj || resultsQ[1].maxProj < resultsQ[0].minProj;
        const separateR: boolean = resultsR[0].maxProj < resultsR[1].minProj || resultsR[1].maxProj < resultsR[0].minProj;
        const separateS: boolean = resultsS[0].maxProj < resultsS[1].minProj || resultsS[1].maxProj < resultsS[0].minProj;

        return !(separateP || separateQ || separateR || separateS);
    }
    /**************************************************************************************************************************************************/

    /*********************************************************************REFACTOR*********************************************************************/
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
    /**************************************************************************************************************************************************/

    public checkCarsCollisions(): void {
        let tempCars: Car[] = [];
        for (let i: number = 0; i < this._cars.length - 1; i++) {
            for (let j: number = i + 1; j < this._cars.length; j++) {
                tempCars = [this._cars[i], this._cars[j]]
                if (this.detectCollision(tempCars)) {
                    this.handleCollisions(tempCars);
                }
            }
        }

    }

     /*********************************************************************REFACTOR*********************************************************************/
    private handleCollisions(cars: Car[]): void {
        const totalMass: number = cars[0].Mass + cars[1].Mass;
        const phi: number = cars[0].getUpdatedPosition().angleTo(cars[1].getUpdatedPosition()); // Angle entre les 2 positions de voitures

        // Produire un tableau pour rapetisser?

        const theta1: number = cars[0].speed.length() !== 0 ? Math.acos(cars[0].speed.x / cars[0].speed.length()) : 0; // Angle de vitesse
        const theta2: number = cars[1].speed.length() !== 0 ? Math.acos(cars[1].speed.x / cars[1].speed.length()) : 0; // Angle de vitesse

        const temp1: number = (cars[1].Mass * cars[1].speed.length() * Math.cos(theta2 - phi) * 2) / totalMass;
        const temp2: number = cars[0].speed.length() * Math.sin(theta1 - phi);
        const temp3: number = (cars[0].Mass * cars[0].speed.length() * Math.cos(theta1 - phi) * 2) / totalMass;
        const temp4: number = (cars[1].speed.length() * Math.sin(theta2 - phi));

        const newSpeedX1: number = ((temp1 * Math.cos(phi)) - (temp2 * Math.sin(phi))) / CAR_1_MOMENTUM_FACTOR;
        const newSpeedZ1: number = ((temp1 * Math.sin(phi)) + (temp2 * Math.cos(phi))) / CAR_1_MOMENTUM_FACTOR;
        const newSpeedX2: number = ((temp3 * Math.cos(phi)) - (temp4 * Math.sin(phi))) / CAR_2_MOMENTUM_FACTOR;
        const newSpeedZ2: number = ((temp3 * Math.sin(phi)) + (temp4 * Math.cos(phi))) / CAR_2_MOMENTUM_FACTOR;

        const newSpeed: THREE.Vector3[] = [new THREE.Vector3(newSpeedX1, 0, newSpeedZ1), new THREE.Vector3(newSpeedX2, 0, newSpeedZ2)]

        for (let i = 0; i < cars.length; i++) {
            cars[i].speed = cars[i].speed.length() > MINIMUM_SPEED ? newSpeed[i] : cars[i].speed.add(SPEED_VECTOR_FACTOR);
        }
    }
    /**************************************************************************************************************************************************/
}
