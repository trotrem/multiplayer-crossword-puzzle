import { Injectable } from "@angular/core";
import * as THREE from "three";

const DISTANCE_INDEX: number = 2 ;
const POWER_INDEX: number = 2 ;
const DISTANCE_DIVIDER: number = 10;
@Injectable()
export class PositionsDefinerService {
  private getStartingPosition(line: THREE.Line3, index: number): THREE.Vector3 {
    return new THREE.Vector3(((line.end.x + line.start.x) / index),
                             ((line.end.y + line.start.y) / index), ((line.end.z + line.start.z)) / index );

  }
  public getDeltaLine(line: THREE.Line3): THREE.Vector3 {

    return new THREE.Vector3(((line.end.x - line.start.x)), ((line.end.y - line.start.y) ), ((line.end.z - line.start.z)));
  }
  private getMaxDistance(line: THREE.Line3): number {
    return Math.sqrt(Math.pow((line.end.x - line.start.x), POWER_INDEX) +
     Math.pow((line.end.y - line.start.y), POWER_INDEX) + Math.pow((line.end.y - line.start.y), POWER_INDEX));
  }

  private getCarPosition(vector: THREE.Vector3, index1: number, index2: number, line: THREE.Line3): THREE.Vector3 {
    const matrix: THREE.Matrix4 = new THREE.Matrix4();
    matrix.makeBasis(new THREE.Vector3(vector.x, 0 , 0 ),
                     new THREE.Vector3( 0 , vector.y, 0 ),
                     new THREE.Vector3( 0 , 0 , vector.z ));
    matrix.makeTranslation(index1 , index2 , 0 );
    const newVector: THREE.Vector3 = new THREE.Vector3();
    newVector.applyMatrix4(matrix);

    return newVector;
  }

  public getCarsPositions(firstLine: THREE.Line3): THREE.Vector3[] {
   const positions: THREE.Vector3[] = new Array<THREE.Vector3>();
   const firstCarPosition: THREE.Vector3 = this.getStartingPosition(firstLine, DISTANCE_INDEX).clone();
   positions.push(this.getCarPosition(firstCarPosition, this.getMaxDistance(firstLine) / (DISTANCE_DIVIDER) * -1,
                                      this.getMaxDistance(firstLine) / DISTANCE_DIVIDER, firstLine));
   positions.push(this.getCarPosition(firstCarPosition, this.getMaxDistance(firstLine) / DISTANCE_DIVIDER,
                                      this.getMaxDistance(firstLine) / DISTANCE_DIVIDER * -1, firstLine));
   positions.push(this.getCarPosition(firstCarPosition, this.getMaxDistance(firstLine) / DISTANCE_DIVIDER,
                                      this.getMaxDistance(firstLine) / DISTANCE_DIVIDER, firstLine));
   positions.push(this.getCarPosition(firstCarPosition, this.getMaxDistance(firstLine) / DISTANCE_DIVIDER * -1,
                                      this.getMaxDistance(firstLine) / DISTANCE_DIVIDER * -1, firstLine));

   return positions;
  }

}
