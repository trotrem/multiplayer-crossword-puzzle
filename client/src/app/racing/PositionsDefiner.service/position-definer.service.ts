import { Injectable } from "@angular/core";
import * as THREE from "three";

const FIRST_CAR_INDEX: number = 2;
const HALF_LINE_DEVIDER: number = 2 ;
const SECOND_CAR_INDEX: number = 1;
const QUARTER_DISTANCE_DIVIDER: number = 4;
@Injectable()
export class PositionsDefinerService {
  private getStartingPosition(line: THREE.Line3, index: number): THREE.Vector3 {
    return new THREE.Vector3(((line.end.x + line.start.x) / index),
                             ((line.end.y + line.start.y) / index), ((line.end.z + line.start.z)) / index );
  }
  private getMaxDistance(line: THREE.Line3): number {
    return Math.sqrt(Math.pow((line.end.x - line.start.x), HALF_LINE_DEVIDER) +
     Math.pow((line.end.y - line.start.y), HALF_LINE_DEVIDER) + Math.pow((line.end.y - line.start.y), HALF_LINE_DEVIDER));
  }

  private getCarPosition(vector: THREE.Vector3, index: number): THREE.Vector3 {
    const vec: THREE.Spherical = new THREE.Spherical();
    vec.setFromVector3(vector);
    vec.set(vec.radius, vec.phi, Math.PI * index);
    const vect: THREE.Vector3 = new THREE.Vector3();
    vect.setFromSpherical(vec);

    return vect;
  }

  public getCarsPositions(firstLine: THREE.Line3): THREE.Vector3[] {
   const pairPositions: THREE.Vector3[] = new Array<THREE.Vector3>();
   const firstCarPosition: THREE.Vector3 = this.getStartingPosition(firstLine, HALF_LINE_DEVIDER).clone();
   pairPositions.push(this.getCarPosition(firstCarPosition, FIRST_CAR_INDEX));
   pairPositions.push(this.getCarPosition(firstCarPosition, SECOND_CAR_INDEX));

   pairPositions.push(this.getCarPosition(firstCarPosition, FIRST_CAR_INDEX).
   setX(this.getCarPosition(firstCarPosition, SECOND_CAR_INDEX).x + this.getMaxDistance(firstLine) / QUARTER_DISTANCE_DIVIDER));

   pairPositions.push(this.getCarPosition(firstCarPosition, SECOND_CAR_INDEX).
   setX(this.getCarPosition(firstCarPosition, SECOND_CAR_INDEX).x + this.getMaxDistance(firstLine) / QUARTER_DISTANCE_DIVIDER));

   return pairPositions;
  }

}
