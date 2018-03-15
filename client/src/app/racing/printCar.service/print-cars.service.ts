import { Injectable } from "@angular/core";
import { RandomCarsFirstPositionsService } from "../randomCarsFirstPositions.service/random-cars-first-positions.service";
import { Car } from "../car/car";
import * as THREE from "three";

const CARS_PAIRS_MAX: number = 2;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;

@Injectable()
export class PrintCarsService {
  private randomPositions: RandomCarsFirstPositionsService;
  private carsPair: Car[];
  public constructor() {
    this. carsPair = new Array<Car>(CARS_PAIRS_MAX);
    this.randomPositions = new RandomCarsFirstPositionsService();
  }
  public initiateCars(camera: THREE.PerspectiveCamera, scene: THREE.Scene): Car[] {
    for (let i: number = 0; i < CARS_PAIRS_MAX; i++) {
    this.carsPair[i] = new Car();
    this.carsPair[i].init();
    camera.lookAt(this.carsPair[i].position);
    scene.add(new THREE.AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
    }

    return this.carsPair;
}
  public insertPairOfCars(line: THREE.Line3, scene: THREE.Scene ): Car[] {
    for (let i: number = 0; i < CARS_PAIRS_MAX; i++) {
    const positions: THREE.Vector3[] = this.randomPositions.getRandomPairOfAdjacentPositions(line);
    this.translateCarPosition(i, positions[i]);
    scene.add(this.carsPair[i]);
    console.warn(this.carsPair[i].position);
    }

    return this.carsPair;
}
  private translateCarPosition(index: number, vector: THREE.Vector3): void {
    this.carsPair[index].translateX(vector.x);
    this.carsPair[index].translateY(vector.y);
    this.carsPair[index].translateZ(vector.z);
  }
}
