import * as THREE from "three";
import { Car } from "../Car";
import { Injectable } from "@angular/core";

export interface IProjection {
    minProj: number;
    maxProj: number;
}

const CAR_1_MOMENTUM_FACTOR: number = 3.9;
const CAR_2_MOMENTUM_FACTOR: number = 4.1;
const MINIMUM_SPEED: number = 0.05;
const SPEED_FACTOR: number = 2.5;
const SPEED_VECTOR_FACTOR: THREE.Vector3 = new THREE.Vector3(SPEED_FACTOR, 0, SPEED_FACTOR);

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

    public detectCollision(cars: Car[]): boolean {
        this.shapeAroundCar(cars);
        const resultsP: IProjection[] = [];
        const resultsQ: IProjection[] = [];
        const resultsR: IProjection[] = [];
        const resultsS: IProjection[] = [];

        for (let i: number = 0; i < cars.length; i++) {
            resultsP[i] = this.getMinMax(this._vecCars[i], this._normals[0][1]);
            resultsQ[i] = this.getMinMax(this._vecCars[i], this._normals[0][0]);
            resultsR[i] = this.getMinMax(this._vecCars[i], this._normals[1][1]);
            resultsS[i] = this.getMinMax(this._vecCars[i], this._normals[1][0]);
        }

        return this.getCollisionDetection(resultsP, resultsQ, resultsR, resultsS);
    }
    private shapeAroundCar(cars: Car[]): void {
        for (let i: number = 0; i < cars.length; i++) {
            this._normals[i] = cars[i].getNormals();
            this._vecCars[i] = this.prepareShape(cars[i]);
        }
    }
    private prepareShape(car: Car): THREE.Vector3[] {
        return car.getCorners(car.getUpdatedPosition().add(car.velocity));
    }
    private getMinMax(vecCar: THREE.Vector3[], axis: THREE.Vector3): IProjection {
        const points: IProjection = {
            minProj: vecCar[1].dot(axis),
            maxProj: vecCar[1].dot(axis),
        };
        for (let j: number = 2; j < vecCar.length; j++) {
            const currProj: number = vecCar[j].dot(axis);
            if (points.minProj > currProj) {
                points.minProj = currProj;
            }
            if (currProj > points.maxProj) {
                points.maxProj = currProj;
            }
        }

        return points;
    }
    private getCollisionDetection(
        resultsP: IProjection[],
        resultsQ: IProjection[],
        resultsR: IProjection[],
        resultsS: IProjection[]): boolean {

        return !(this.getResult(resultsP) || this.getResult(resultsQ) || this.getResult(resultsR) || this.getResult(resultsS));
    }
    private getResult(results: IProjection[]): boolean {
        return results[0].maxProj < results[1].minProj || results[1].maxProj < results[0].minProj;
    }

    private handleCollisions(cars: Car[]): void {
        const totalMass: number = cars[0].Mass + cars[1].Mass;
        const phi: number = cars[0].getUpdatedPosition().angleTo(cars[1].getUpdatedPosition()); // Angle entre les 2 positions de voitures

        const theta1: number = this.getTheta(cars[0]);
        const theta2: number = this.getTheta(cars[1]);

        const newSpeed: THREE.Vector3[] = this.getNewSpeed(cars, theta1, theta2, phi, totalMass);
        for (let i: number = 0; i < cars.length; i++) {
            cars[i].speed = cars[i].speed.length() > MINIMUM_SPEED ? newSpeed[i] : cars[i].speed.add(SPEED_VECTOR_FACTOR);
        }
    }
    private getTheta(car: Car): number {
        return car.speed.length() !== 0 ? Math.acos(car.speed.x / car.speed.length()) : 0; // Angle de vitesse
    }
    private getNewSpeed(cars: Car[], theta1: number, theta2: number, phi: number, totalMass: number): THREE.Vector3[] {
        const const1Speed1: number = this.getConst1(cars[1], theta2, phi, totalMass);
        const const2Speed1: number = this.getConst2(cars[0], theta1, phi);
        const const1Speed2: number = this.getConst1(cars[0], theta1, phi, totalMass);
        const const2Speed2: number = this.getConst2(cars[1], theta2, phi);

        return [
            new THREE.Vector3(this.getSpeedX(const1Speed1, const2Speed1, phi), 0, this.getSpeedZ(const1Speed1, const2Speed1, phi)),
            new THREE.Vector3(this.getSpeedX(const1Speed2, const2Speed2, phi), 0, this.getSpeedZ(const1Speed2, const2Speed2, phi))];
    }
    private getSpeedX(const1: number, const2: number, phi: number): number {
        return ((const1 * Math.cos(phi)) - (const2 * Math.sin(phi))) / CAR_1_MOMENTUM_FACTOR;
    }
    private getSpeedZ(const1: number, const2: number, phi: number): number {
        return ((const1 * Math.cos(phi)) - (const2 * Math.sin(phi))) / CAR_1_MOMENTUM_FACTOR;
    }
    private getConst1(car: Car, theta: number, phi: number, totalMass: number): number {
        return (car.Mass * car.speed.length() * Math.cos(theta - phi) * 2) / totalMass;
    }
    private getConst2(car: Car, theta: number, phi: number): number {
        return car.speed.length() * Math.sin(theta - phi);
    }
}
