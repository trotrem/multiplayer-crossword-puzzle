import { LapPositionsVerfiers } from "./lap-positions-verifiers";
import * as THREE from "three";

describe("RaceValidator", () => {
  it("should create an instance", () => {
    expect(new LapPositionsVerfiers()).toBeTruthy();
  });
  it("should return an array of positions from an array of meshes", () => {
    const meshs: THREE.Mesh[] = new Array<THREE.Mesh>();
    const geometry: THREE.CircleGeometry = new THREE.CircleGeometry();
    meshs.push(new THREE.Mesh(geometry, new THREE.Material()));
    expect(LapPositionsVerfiers.getLapPositionVerifiers(meshs).length).toBe(1);
  });
  it("should return true if position is close to a positionVerifier", () => {
    const positionVerifier: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
    const position: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
    expect(LapPositionsVerfiers.getLapSectionvalidator(position, positionVerifier)).toBe(true);
  });
  it("should return false if position is far from a positionVerifier", () => {
    // tslint:disable-next-line:no-magic-numbers
    const positionVerifier: THREE.Vector3 = new THREE.Vector3(-100, 0, 0);
    const position: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
    expect(LapPositionsVerfiers.getLapSectionvalidator(position, positionVerifier)).toBe(false);
  });
});
