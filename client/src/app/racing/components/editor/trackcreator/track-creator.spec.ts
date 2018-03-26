import { TrackCreator } from "./track-creator";
import * as THREE from "three";

describe("TrackCreator", () => {
  const component: TrackCreator = new TrackCreator();
  it("should create an instance", () => {
    expect(component).toBeDefined();
  });

  it("should create a point", () => {
      // tslint:disable-next-line:no-magic-numbers
      const position: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
      const point: THREE.Points = component.createPoint(position);
      expect(point).toBeDefined();
  });

  it("should create a line", () => {
      const points: Array<THREE.Vector3> = new Array<THREE.Vector3>();
      // tslint:disable-next-line:no-magic-numbers
      const position1: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
      // tslint:disable-next-line:no-magic-numbers
      const position2: THREE.Vector3 = new THREE.Vector3(23, -2, 0);
      points.push(position1);
      component.points = points;
      const lines: Array<THREE.Line> = component.createLine(position1, position2);
      expect(lines.length).toBe(1);
  });
  it("should recreate a conflict line ", () => {
    const illegalPoints: Array<THREE.Vector3> = new Array<THREE.Vector3>();
    // tslint:disable-next-line:no-magic-numbers
    const position1: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
    // tslint:disable-next-line:no-magic-numbers
    const position2: THREE.Vector3 = new THREE.Vector3(23, -2, 0);
    illegalPoints.push(position1);
    illegalPoints.push(new THREE.Vector3(0, 0, 0));
    illegalPoints.push(position2);
    const lines: Array<THREE.Line> = component.redrawConflictingLines(illegalPoints);
    // tslint:disable-next-line:no-magic-numbers
    expect(lines.length).toBe(2);
});
});