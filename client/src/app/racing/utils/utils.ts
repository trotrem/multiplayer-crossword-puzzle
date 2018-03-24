import * as THREE from "three";

const PRECISION: number = 0.0001;

// TODO: make editor use this
export class RaceUtils {
  public static linesCross(
    pos1: THREE.Vector3,
    pos2: THREE.Vector3,
    pos3: THREE.Vector3,
    pos4: THREE.Vector3
  ): boolean {
    const intersection: THREE.Vector3 = this.twoLinesIntersection(
      pos1,
      pos2,
      pos3,
      pos4
    );
    if (
      intersection === null ||
      Math.abs(
        pos1.distanceTo(intersection) +
          intersection.distanceTo(pos2) -
          pos1.distanceTo(pos2)
      ) > PRECISION
    ) {
      return false;
    }

    return true;
  }

  public static twoLinesIntersection(
    position1: THREE.Vector3,
    position2: THREE.Vector3,
    position3: THREE.Vector3,
    position4: THREE.Vector3
  ): THREE.Vector3 {
    if (this.calculateDet(position1, position2, position3, position4) !== 0) {
      return this.calculateIntersection(
        position1,
        position2,
        position3,
        position4
      );
    }

    return null;
  }

  private static calculateDet(
    position1: THREE.Vector3,
    position2: THREE.Vector3,
    position3: THREE.Vector3,
    position4: THREE.Vector3
  ): number {
    return (
      (position2.y - position1.y) * (position3.x - position4.x) -
      (position4.y - position3.y) * (position1.x - position2.x)
    );
  }

  private static calculateIntersection(
    position1: THREE.Vector3,
    position2: THREE.Vector3,
    position3: THREE.Vector3,
    position4: THREE.Vector3
  ): THREE.Vector3 {
    const intersection: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    intersection.x =
      ((position3.x - position4.x) *
        ((position2.y - position1.y) * position1.x +
          (position1.x - position2.x) * position1.y) -
        (position1.x - position2.x) *
          ((position4.y - position3.y) * position3.x +
            (position3.x - position4.x) * position3.y)) /
      this.calculateDet(position1, position2, position3, position4);

    intersection.y =
      ((position2.y - position1.y) *
        ((position4.y - position3.y) * position3.x +
          (position3.x - position4.x) * position3.y) -
        (position4.y - position3.y) *
          ((position2.y - position1.y) * position1.x +
            (position1.x - position2.x) * position1.y)) /
      this.calculateDet(position1, position2, position3, position4);

    return intersection;
  }
}
