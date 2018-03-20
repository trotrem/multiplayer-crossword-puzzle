import { Injectable } from "@angular/core";
import { PositionsDefinerService } from "../PositionsDefiner.service/position-definer.service";
import { Car } from "../car/car";
import * as THREE from "three";

const CARS_MAX: number = 4;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;
const ROTATION_ANGLE_DIVIDER: number = 2;

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
    // console.log(cars[i].position);
    this.translateCarPosition(i, randomPosition, cars);
    cars[i].rotateX(Math.PI / ROTATION_ANGLE_DIVIDER);
    cars[i].rotateY(this.getRotateCarPosition(line));
    positions.splice(positions.indexOf(randomPosition), 1);
    scene.add(cars[i]);
    }
  }
  public getRotateCarPosition(line: THREE.Line3): number {

      return Math.atan2(this.carsPositions.getDeltaLine(line).y, this.carsPositions.getDeltaLine(line).x) ;
    }

  private translateCarPosition(index: number, vector: THREE.Vector3, cars: Car[]): void {
    const matrix: THREE.Matrix4 = new THREE.Matrix4();
    matrix.makeTranslation(vector.x, vector.y, vector.z);
    cars[index].applyMatrix(matrix);
  }
}
