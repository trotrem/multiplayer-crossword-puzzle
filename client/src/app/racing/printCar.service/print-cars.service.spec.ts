import { TestBed, inject } from "@angular/core/testing";
import * as THREE from "three";
import { PrintCarsService } from "./print-cars.service";
import { PositionsDefinerService } from "../PositionsDefiner.service/position-definer.service";
describe("PrintCarsService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrintCarsService, PositionsDefinerService]
    });
  });

  it("should be created", inject([PrintCarsService], (service: PrintCarsService) => {
    expect(service).toBeTruthy();
  }));

  it("should initiate four cars", inject([PrintCarsService], (service: PrintCarsService) => {
    service.initiateCars(new THREE.PerspectiveCamera(), new THREE.Scene());
    expect(service).toBeTruthy();
  }));
  it("should define four positions for four cars",
     inject([PrintCarsService], (service: PrintCarsService) => {
    // tslint:disable-next-line:no-magic-numbers
    const position1: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
    // tslint:disable-next-line:no-magic-numbers
    const position2: THREE.Vector3 = new THREE.Vector3(-12, 9, 0);
    service.initiateCars(new THREE.PerspectiveCamera(), new THREE.Scene());
    service.insertCars(new THREE.Line3(position1, position2), new THREE.Scene());
    // tslint:disable-next-line:no-magic-numbers
    expect(service.getCars().length).toBe(4);
  }));
  it("should define a unique position for each car",
     inject([PrintCarsService], (service: PrintCarsService) => {
    // tslint:disable-next-line:no-magic-numbers
    const position1: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
    // tslint:disable-next-line:no-magic-numbers
    const position2: THREE.Vector3 = new THREE.Vector3(-12, 9, 0);
    service.initiateCars(new THREE.PerspectiveCamera(), new THREE.Scene());
    service.insertCars(new THREE.Line3(position1, position2), new THREE.Scene());
    expect(service.getCars()[1] === service.getCars()[0]).toBeFalsy();
    // tslint:disable-next-line:no-magic-numbers
    expect(service.getCars()[1] === service.getCars()[2]).toBeFalsy();
    // tslint:disable-next-line:no-magic-numbers
    expect(service.getCars()[1] === service.getCars()[3]).toBeFalsy();
  }));
});
