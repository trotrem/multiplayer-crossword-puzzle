import { Injectable } from "@angular/core";
import { PositionsDefinerService } from "../PositionsDefiner.service/position-definer.service";
import { Car } from "../car/car";
import * as THREE from "three";

const CARS_MAX: number = 4;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;
const ROTATION_ANGLE_DIVIDER: number = 2;

@Injectable()
export class CarsPositionsHandler {

  public static insertCars(line: THREE.Line3, scene: THREE.Scene, cars: Car[]): void {

    const positions: THREE.Vector3[] = PositionsDefinerService.getCarsPositions(line);
    for (let i: number = 0; i < CARS_MAX; i++) {
    const randomPosition: THREE.Vector3 = positions[Math.floor(Math.random() * positions.length)];
    cars[i].position.set(randomPosition.x, randomPosition.y, randomPosition.z);
    cars[i].rotateX(Math.PI / ROTATION_ANGLE_DIVIDER);
    cars[i].rotateY(this.getRotateCarPosition(line));
    positions.splice(positions.indexOf(randomPosition), 1);
    scene.add(cars[i]);
    }
  }
  private static getRotateCarPosition(line: THREE.Line3): number {

      return Math.atan2(PositionsDefinerService.getDeltaLine(line).y, PositionsDefinerService.getDeltaLine(line).x) ;
    }

}
