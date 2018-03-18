import { TestBed, inject } from "@angular/core/testing";
import * as THREE from "three";

import { PositionsDefinerService  } from "./position-definer.service";

describe("RandomCarCreatorService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PositionsDefinerService ]
    });
  });

  /*it("should be created", inject([PositionsDefinerService ], (service: PositionsDefinerService ) => {
    expect(service).toBeTruthy();
  }));
  it("should get random positionX inside a specific line",
     inject([RandomCarsFirstPositionsService], (service: RandomCarsFirstPositionsService) => {
    // tslint:disable-next-line:no-magic-numbers
    const line: THREE.Line3 = new THREE.Line3(new THREE.Vector3(2, 4, 8), new THREE.Vector3(-1, 0, 2));
    const vector: THREE.Vector3 = service.getRandomPosition(line);
    expect(vector.x).toBeLessThanOrEqual(line.start.x);
    expect(vector.x).toBeGreaterThanOrEqual(line.end.x);
  }));
  it("should get random positionY inside a specific line",
     inject([RandomCarsFirstPositionsService], (service: RandomCarsFirstPositionsService) => {
    // tslint:disable-next-line:no-magic-numbers
    const line: THREE.Line3 = new THREE.Line3(new THREE.Vector3(2, 4, 8), new THREE.Vector3(-1, 0, 2));
    const vector: THREE.Vector3 = service.getRandomPosition(line);
    expect(vector.y).toBeLessThanOrEqual(line.start.y);
    expect(vector.y).toBeGreaterThanOrEqual(line.end.y);
  }));
  it("should get random positionZ inside a specific line",
     inject([RandomCarsFirstPositionsService], (service: RandomCarsFirstPositionsService) => {
      // tslint:disable-next-line:no-magic-numbers
      const line: THREE.Line3 = new THREE.Line3(new THREE.Vector3(2, 4, 8), new THREE.Vector3(-1, 0, 2));
      const vector: THREE.Vector3 = service.getRandomPosition(line);
      expect(vector.z).toBeLessThanOrEqual(line.start.z);
      expect(vector.z).toBeGreaterThanOrEqual(line.end.z);
    }));
  it("should get a pair of adjacent positions inside to a specific line",
     inject([RandomCarsFirstPositionsService], (service: RandomCarsFirstPositionsService) => {
      // tslint:disable-next-line:no-magic-numbers
      const line: THREE.Line3 = new THREE.Line3(new THREE.Vector3(2, 4, 8), new THREE.Vector3(-1, 0, 2));
      const vectors: THREE.Vector3[] = service.getRandomPairOfAdjacentPositions(line);
      // tslint:disable-next-line:no-magic-numbers
      expect(vectors[1].y).toBe(vectors[0].y + 0.01);
      // tslint:disable-next-line:no-magic-numbers
      expect(vectors[1].z).toBe(vectors[0].z + 0.01);
    }));*/
});
