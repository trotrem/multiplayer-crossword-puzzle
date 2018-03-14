import { TestBed, inject } from "@angular/core/testing";
import * as THREE from "three";

import { RandomCarCreatorService } from "./random-car-creator.service";

describe("RandomCarCreatorService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RandomCarCreatorService]
    });
  });

  it("should be created", inject([RandomCarCreatorService], (service: RandomCarCreatorService) => {
    expect(service).toBeTruthy();
  }));
  it("should get random positionX inside a specific line", inject([RandomCarCreatorService], (service: RandomCarCreatorService) => {
    // tslint:disable-next-line:no-magic-numbers
    const line: THREE.Line3 = new THREE.Line3(new THREE.Vector3(2, 4, 8), new THREE.Vector3(-1, 0, 2));
    const vector: THREE.Vector3 = service.getRandomCarPosition(line);
    expect(vector.x).toBeLessThanOrEqual(line.start.x);
    expect(vector.x).toBeGreaterThanOrEqual(line.end.x);
  }));
  it("should get random positionY inside a specific line", inject([RandomCarCreatorService], (service: RandomCarCreatorService) => {
    // tslint:disable-next-line:no-magic-numbers
    const line: THREE.Line3 = new THREE.Line3(new THREE.Vector3(2, 4, 8), new THREE.Vector3(-1, 0, 2));
    const vector: THREE.Vector3 = service.getRandomCarPosition(line);
    expect(vector.y).toBeLessThanOrEqual(line.start.y);
    expect(vector.y).toBeGreaterThanOrEqual(line.end.y);
  }));
  it("should get random positionZ inside a specific line", inject([RandomCarCreatorService], (service: RandomCarCreatorService) => {
    // tslint:disable-next-line:no-magic-numbers
    const line: THREE.Line3 = new THREE.Line3(new THREE.Vector3(2, 4, 8), new THREE.Vector3(-1, 0, 2));
    const vector: THREE.Vector3 = service.getRandomCarPosition(line);
    expect(vector.z).toBeLessThanOrEqual(line.start.z);
    expect(vector.z).toBeGreaterThanOrEqual(line.end.z);
  }));
});
