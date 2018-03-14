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
  private car: Car;
  public constructor() {
    this.car = new Car();
    this.randomPositions = new RandomCarsFirstPositionsService();
  }
  public initiateCar(camera: THREE.PerspectiveCamera, scene: THREE.Scene): Car {
    this.car.init();
    camera.lookAt(this.car.position);
    scene.add(this.car);
    scene.add(new THREE.AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));

    return this.car;
}
  public insertCars(line: THREE.Line3, scene: THREE.Scene ): void {
    const positions: THREE.Vector3[] = this.randomPositions.getRandomPairOfAdjacentPositions(line);
    this.translateCarPosition(positions[0]);
    scene.add(this.car);
    console.warn(this.car.position);
}
  private translateCarPosition( vector: THREE.Vector3): void {
    this.car.translateX(vector.x);
    this.car.translateY(vector.y);
    this.car.translateZ(vector.z);
  }
}
