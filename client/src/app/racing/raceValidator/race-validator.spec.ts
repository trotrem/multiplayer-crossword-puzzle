import { RaceValidator } from "./race-validator";
import * as THREE from "three";

describe("RaceValidator", () => {
  it("should create an instance", () => {
    expect(new RaceValidator()).toBeTruthy();
  });
  it("should return an array of meshs positions", () => {
    const meshs: THREE.Mesh[] = new Array<THREE.Mesh>();
    const geometry: THREE.CircleGeometry = new THREE.CircleGeometry();
    meshs.push(new THREE.Mesh(geometry, new THREE.Material()));
    expect(RaceValidator.getLapPositionVerifiers(meshs).length).toBe(1);
  });
});
