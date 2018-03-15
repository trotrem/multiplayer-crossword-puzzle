import { Injectable } from "@angular/core";
import * as THREE from "three";
import { Car } from "../car/car";

const DISTANCE_BETWEEN_CARS: number = 0.01;
@Injectable()
export class RandomCarsFirstPositionsService {
  // public constructor() { }
  public getRandomPosition(firstLine: THREE.Line3): THREE.Vector3 {
    const randomXPosition: number = this.getRandomNumber(firstLine.start.x, firstLine.end.x);
    const randomYPosition: number = this.getRandomNumber(firstLine.start.y, firstLine.end.y);
    const randomZPosition: number = this.getRandomNumber(firstLine.start.z, firstLine.end.z);

    return new THREE.Vector3(randomXPosition, randomYPosition, randomZPosition);
  }
  private getRandomNumber(start: number, end: number): number {

    return Math.floor(Math.random() * (start + 1 - end)) + end;
  }
  private getAdjacentCarPosition(vector: THREE.Vector3): THREE.Vector3 {

    return new THREE.Vector3(vector.x, vector.y + DISTANCE_BETWEEN_CARS, vector.z + DISTANCE_BETWEEN_CARS );
  }
  public getRandomPairOfAdjacentPositions(firstLine: THREE.Line3): THREE.Vector3[] {
   const pairPositions: THREE.Vector3[] = new Array<THREE.Vector3>();
   const firstCarPosition: THREE.Vector3 = this.getRandomPosition(firstLine);
   pairPositions.push(firstCarPosition);
   pairPositions.push(this.getAdjacentCarPosition(firstCarPosition));

   return pairPositions;
  }

}
