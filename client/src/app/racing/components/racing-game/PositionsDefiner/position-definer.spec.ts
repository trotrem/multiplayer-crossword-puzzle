import { TestBed, inject } from "@angular/core/testing";
import * as THREE from "three";

import { PositionsDefiner } from "./position-definer";
// "magic numbers" utilisés pour les tests
/* tslint:disable:no-magic-numbers */
describe("PositionsDefinerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PositionsDefiner]
    });
  });

  it("should define an array of four vectors", () => {
    const line: THREE.Line3 = new THREE.Line3(new THREE.Vector3(2, 4, 8), new THREE.Vector3(-1, 0, 2));
    expect(PositionsDefiner.getCarsPositions(line).length).toBe(4);
  });

  it("should define an array of the same four vectors if the same line is given as an argument", () => {
    const line: THREE.Line3 = new THREE.Line3(new THREE.Vector3(2, 4, 8), new THREE.Vector3(-1, 0, 2));
    const positions1: THREE.Vector3[] = PositionsDefiner.getCarsPositions(line);
    const positions2: THREE.Vector3[] = PositionsDefiner.getCarsPositions(line);
    for (let i: number = 0; i < 4; i++) {
      expect(positions1[i]).toBeTruthy(positions2[i]);
    }
  });
});
