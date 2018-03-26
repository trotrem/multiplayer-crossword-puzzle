import { TestBed, inject } from "@angular/core/testing";
import * as THREE from "three";
import { CarsPositionsHandler } from "./cars-positions-handler";
import { Car } from "../car/car";
import { WallsCollisionsService } from "./../walls-collisions-service/walls-collisions-service";
import { CarLoader } from "../car/car-loader";
// "magic numbers" utilisés pour les tests
/* tslint:disable:no-magic-numbers */
describe("CarsPositionsHandler", () => {
  const carLoader: CarLoader = new CarLoader();
  const wallsCollisionsService: WallsCollisionsService = new WallsCollisionsService();
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CarsPositionsHandler, WallsCollisionsService]
    });
  });

  it("should define four positions for four cars", async () => {
    const position1: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
    const position2: THREE.Vector3 = new THREE.Vector3(-12, 9, 0);
    const cars: Car[] = new Array<Car>();
    for (let i: number = 0; i < 4; i++) {
      cars.push(new Car(wallsCollisionsService));
      cars[i].mesh = await carLoader.load();

    }
    CarsPositionsHandler.insertCars(new THREE.Line3(position1, position2), new THREE.Scene(), cars);
    for (let i: number = 0; i < 4; i++) {
      expect(cars[i].mesh.position === new THREE.Vector3()).toBeFalsy();
    }

  });

  it("should define a unique position for each car", async () => {
    const cars: Car[] = new Array<Car>();
    for (let i: number = 0; i < 4; i++) {
      cars.push(new Car(wallsCollisionsService));
      cars[i].mesh = await carLoader.load();
    }
    const position1: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
    const position2: THREE.Vector3 = new THREE.Vector3(-12, 9, 0);
    CarsPositionsHandler.insertCars(new THREE.Line3(position1, position2), new THREE.Scene(), cars);
    for (let i: number = 0; i < 4; i++) {
      for (let j: number = 0; j < 4; j++) {
        if (i === j) {
          expect(cars[i].position === cars[j].position).toBeTruthy();
        } else {
          expect(cars[i].position === cars[j].position).toBeFalsy();
        }
      }
    }
  });

  it("the cars shouldn't have the same random position for each service call", async () => {
    const cars1: Car[] = new Array<Car>();
    for (let i: number = 0; i < 4; i++) {
      cars1.push(new Car(wallsCollisionsService));
      cars1[i].mesh = await carLoader.load();
    }
    const cars2: Car[] = new Array<Car>();
    for (let i: number = 0; i < 4; i++) {
      cars2.push(new Car(wallsCollisionsService));
      cars2[i].mesh = await carLoader.load();
    }
    const position1: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
    const position2: THREE.Vector3 = new THREE.Vector3(-12, 9, 0);
    CarsPositionsHandler.insertCars(new THREE.Line3(position1, position2), new THREE.Scene(), cars1);
    CarsPositionsHandler.insertCars(new THREE.Line3(position1, position2), new THREE.Scene(), cars2);
    for (let i: number = 0; i < 4; i++) {
      expect(cars1[i].position === cars2[i].position).toBeFalsy();
    }
  });
});
