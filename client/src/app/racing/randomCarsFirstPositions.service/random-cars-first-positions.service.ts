import { Injectable } from "@angular/core";
import * as THREE from "three";

const DISTANCE_BETWEEN_CARS: number = 0.01;
@Injectable()
export class RandomCarsFirstPositionsService {
  // public constructor() { }
  public getRandomPosition(startingPoint: THREE.Vector3): THREE.Vector3 {
    const randomXPosition: number =  startingPoint.x;
    const randomYPosition: number = startingPoint.y;
    const randomZPosition: number = startingPoint.z;

    return new THREE.Vector3(randomXPosition, randomYPosition, randomZPosition);
  }
  public getStartingPosition(line: THREE.Line3): THREE.Vector3 {

    return new THREE.Vector3(((line.end.x + line.start.x) / 2), ((line.end.y + line.start.y) / 2), ((line.end.z + line.start.z)) / 2 );
  }

  private getAdjacentCar1Position(vector: THREE.Vector3, targetVector: THREE.Vector3): THREE.Vector3 {
    const vec: THREE.Spherical = new THREE.Spherical();
    vec.setFromVector3(vector);
    // vec.reflect(targetVector.normalize());
    vec.set(vec.radius, vec.phi, Math.PI * 2);
    const vect: THREE.Vector3 = new THREE.Vector3();

    return vect.setFromSpherical(vec);
  }
  private getAdjacentCar2Position(vector: THREE.Vector3, targetVector: THREE.Vector3): THREE.Vector3 {
    const vec: THREE.Spherical = new THREE.Spherical();
    vec.setFromVector3(vector);
    vec.set(vec.radius, vec.phi, Math.PI * 1);
    const vect: THREE.Vector3 = new THREE.Vector3();

    return vect.setFromSpherical(vec);
  }
  private getDeltaVector(line: THREE.Line3): THREE.Vector3 {
    return new THREE.Vector3((line.end.x - line.start.x), (line.end.y - line.start.y), (line.end.z - line.start.z));
  }

  public getRandomPairOfAdjacentPositions(firstLine: THREE.Line3): THREE.Vector3[] {
   const pairPositions: THREE.Vector3[] = new Array<THREE.Vector3>();
   const targetVector: THREE.Vector3 = this.getDeltaVector(firstLine);
   const firstCarPosition: THREE.Vector3 = this.getStartingPosition(firstLine).clone();
   pairPositions.push(this.getAdjacentCar1Position(firstCarPosition, targetVector));
   pairPositions.push(this.getAdjacentCar2Position(firstCarPosition, targetVector));

   return pairPositions;
  }

}
