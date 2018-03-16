import { Injectable } from "@angular/core";
import * as THREE from "three";
import { Car } from "../car/car";

const DISTANCE_BETWEEN_CARS: number = 0.01;
@Injectable()
export class RandomCarsFirstPositionsService {
  // public constructor() { }
  public getRandomPosition(startingPoint: THREE.Vector3): THREE.Vector3 {
    /*const randomXPosition: number = this.getRandomNumber(startingPoint.x, startingPoint.x);
    const randomYPosition: number = this.getRandomNumber(startingPoint.y, startingPoint.y);
    const randomZPosition: number = this.getRandomNumber(startingPoint.z, startingPoint.z);*/
    const randomXPosition: number =  startingPoint.x;
    const randomYPosition: number = startingPoint.y;
    const randomZPosition: number = startingPoint.z;

    return new THREE.Vector3(randomXPosition, randomYPosition, randomZPosition);
  }
  public getStartingPosition(line: THREE.Line3): THREE.Vector3 {
    return new THREE.Vector3(((line.end.x + line.start.x) / 2), ((line.end.y + line.start.y) / 2), ((line.end.z + line.start.z)) / 2 );
    //  return line.getCenter();
  }

  private getRandomNumber(start: number, end: number): number {

    return Math.floor(Math.random() * (start + 1 - end)) + end;
  }
  private getAdjacentCarPosition(vector: THREE.Vector3, targetVector: THREE.Vector3): THREE.Vector3 {
    const vec: THREE.Vector3 = vector.clone();
    // vec.applyAxisAngle(targetVector.normalize(), Math.PI);
    vec.reflect(targetVector.normalize());
    // return vector.reflect(targetVector.normalize());
    // return vector.applyAxisAngle(targetVector.normalize(), Math.PI);
    return vec;
  }
  private getDeltaVector(line: THREE.Line3): THREE.Vector3 {
    return new THREE.Vector3((line.end.x - line.start.x), (line.end.y - line.start.y), (line.end.z - line.start.z));
    }
  public getRandomPairOfAdjacentPositions(firstLine: THREE.Line3): THREE.Vector3[] {
   const pairPositions: THREE.Vector3[] = new Array<THREE.Vector3>();
   const targetVector: THREE.Vector3 = this.getDeltaVector(firstLine);
   const firstCarPosition: THREE.Vector3 = this.getRandomPosition(this.getStartingPosition(firstLine));
   // firstLine.delta(targetVector);
   pairPositions.push(firstCarPosition);
   pairPositions.push(this.getAdjacentCarPosition(firstCarPosition, targetVector));
  //  pairPositions.push(firstCarPosition);

   return pairPositions;
  }

}
