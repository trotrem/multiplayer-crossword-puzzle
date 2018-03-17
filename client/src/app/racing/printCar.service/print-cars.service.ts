import { Injectable } from "@angular/core";
import { RandomCarsFirstPositionsService } from "../randomCarsFirstPositions.service/random-cars-first-positions.service";
import { Car } from "../car/car";
import * as THREE from "three";

const CARS_MAX: number = 4;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;

@Injectable()
export class PrintCarsService {
  private randomPositions: RandomCarsFirstPositionsService;
  private cars: Car[];
  public constructor() {
    this. cars = new Array<Car>(CARS_MAX);
    this.randomPositions = new RandomCarsFirstPositionsService();
  }
  public initiateCars(camera: THREE.PerspectiveCamera, scene: THREE.Scene): Car[] {
    for (let i: number = 0; i < CARS_MAX; i++) {
    this.cars[i] = new Car();
    this.cars[i].init();
    camera.lookAt(this.cars[i].position);
    scene.add(new THREE.AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
    }

    return this.cars;
}
  public insertCars(line: THREE.Line3, scene: THREE.Scene ): Car[] {
    for (let i: number = 0; i < CARS_MAX; i++) {
    const positions: THREE.Vector3[] = this.randomPositions.getCarsPositions(line);
    this.translateCarPosition(i, positions[i]);
    scene.add(this.cars[i]);
    console.warn(this.cars[i].position);
    }

    return this.cars;
}
  private translateCarPosition(index: number, vector: THREE.Vector3): void {
    this.cars[index].translateX(vector.x);
    this.cars[index].translateY(vector.y);
    this.cars[index].translateZ(vector.z);
  }
}
