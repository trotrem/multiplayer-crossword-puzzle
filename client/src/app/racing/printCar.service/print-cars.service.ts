import { Injectable } from "@angular/core";
import { PositionsDefinerService } from "../PositionsDefiner.service/position-definer.service";
import { Car } from "../car/car";
import * as THREE from "three";

const CARS_MAX: number = 4;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;

@Injectable()
export class PrintCarsService {
  private carsPositions: PositionsDefinerService;
  public constructor() {
    this.carsPositions = new PositionsDefinerService();
  }
  public getCarsPosition(): PositionsDefinerService {
    return this.carsPositions;
  }
  public setCarsPositions(positions: PositionsDefinerService): void {
    this.carsPositions = positions;
  }

  public insertCars(line: THREE.Line3, scene: THREE.Scene, cars: Car[]): void {

    const positions: THREE.Vector3[] = this.carsPositions.getCarsPositions(line);
    for (let i: number = 0; i < CARS_MAX; i++) {
    const randomPosition: THREE.Vector3 = positions[Math.floor(Math.random() * positions.length)];
    this.translateCarPosition(i, randomPosition, cars);
    positions.splice(positions.indexOf(randomPosition), 1);
    scene.add(cars[i]);
    }
}
  private translateCarPosition(index: number, vector: THREE.Vector3, cars: Car[]): void {
    cars[index].translateX(vector.x);
    cars[index].translateY(vector.y);
    cars[index].translateZ(vector.z);
  }
}
