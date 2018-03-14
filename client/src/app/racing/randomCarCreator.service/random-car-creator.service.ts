import { Injectable } from "@angular/core";
import * as THREE from "three";
@Injectable()
export class RandomCarCreatorService {

  public constructor() { }
  public getRandomCarPosition(firstLine: THREE.Line3): THREE.Vector3 {
    const randomXPosition: number = Math.floor(Math.random() * (firstLine.start.x + 1 - firstLine.end.x)) + firstLine.end.x;
    const randomYPosition: number = Math.floor(Math.random() * (firstLine.start.y + 1 - firstLine.end.y)) + firstLine.end.y;
    const randomZPosition: number = Math.floor(Math.random() * (firstLine.start.z + 1 - firstLine.end.z)) + firstLine.end.z;

    return new THREE.Vector3(randomXPosition, randomYPosition, randomZPosition);
  }

}
