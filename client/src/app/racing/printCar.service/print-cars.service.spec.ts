import { TestBed, inject } from "@angular/core/testing";
import * as THREE from "three";
import { PrintCarsService } from "./print-cars.service";
import { Car } from "../car/car";
// "magic numbers" utilisés pour les tests
/* tslint:disable:no-magic-numbers */
describe("PrintCarsService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrintCarsService]
    });
  });

  it("should be created", inject([PrintCarsService], (service: PrintCarsService) => {
    expect(service).toBeTruthy();
  }));

  it("should initiate four positions", inject([PrintCarsService], (service: PrintCarsService) => {
    expect(service.getCarsPosition()).toBeDefined();
  }));
  it("should define four positions for four cars",
     inject([PrintCarsService], (service: PrintCarsService) => {
    const position1: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
    const position2: THREE.Vector3 = new THREE.Vector3(-12, 9, 0);
    const cars: Car[] = new Array <Car>();
    for (let i: number = 0; i < 4; i++) {
      cars.push(new Car());
    }
    service.insertCars(new THREE.Line3(position1, position2), new THREE.Scene(), cars);
    for (let i: number = 0; i < 4; i++) {
      expect(cars[i].position === new THREE.Vector3()).toBeFalsy();
    }

  }));
  it("should define a unique position for each car",
     inject([PrintCarsService], (service: PrintCarsService) => {
    const cars: Car[] = new Array <Car>();
    for (let i: number = 0; i < 4; i++) {
        cars.push(new Car());
      }
    const position1: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
    const position2: THREE.Vector3 = new THREE.Vector3(-12, 9, 0);
    service.insertCars(new THREE.Line3(position1, position2), new THREE.Scene(), cars);
    for (let i: number = 0; i < 4; i++) {
      for (let j: number = 0; j < 4; j++) {
        if (i === j) {
          expect(cars[i].position === cars[j].position).toBeTruthy();
        } else {
          expect(cars[i].position === cars[j].position).toBeFalsy();
        }
      }
    }
  }));
  it("the cars shouldn't have the same random position for each service call",
     inject([PrintCarsService], (service: PrintCarsService) => {
    const cars1: Car[] = new Array <Car>();
    for (let i: number = 0; i < 4; i++) {
        cars1.push(new Car());
      }
    const cars2: Car[] = new Array <Car>();
    for (let i: number = 0; i < 4; i++) {
          cars2.push(new Car());
      }
    const position1: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
    const position2: THREE.Vector3 = new THREE.Vector3(-12, 9, 0);
    service.insertCars(new THREE.Line3(position1, position2), new THREE.Scene(), cars1);
    service.insertCars(new THREE.Line3(position1, position2), new THREE.Scene(), cars2);
    for (let i: number = 0; i < 4; i++) {
          expect(cars1[i].position === cars2[i].position).toBeFalsy();
        }
  }));
});
