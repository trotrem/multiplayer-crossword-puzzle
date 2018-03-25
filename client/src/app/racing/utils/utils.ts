
const EXPONENT: number = 2;
import { Vector3 } from "three";

const PRECISION: number = 0.0001;

export class RaceUtils {

  public static calculateDistance(position1: THREE.Vector3, position2: THREE.Vector3): number {
    return Math.sqrt(Math.pow(position1.x - position2.x, EXPONENT) + Math.pow(position1.y - position2.y, EXPONENT));
  }
  public static linesCross(
    pos1: Vector3,
    pos2: Vector3,
    pos3: Vector3,
    pos4: Vector3
  ): boolean {
    const intersect: Vector3 = this.twoLinesIntersection(
      pos1,
      pos2,
      pos3,
      pos4
    );
    if (
      intersect === null ||
      Math.abs(
        pos1.distanceTo(intersect) +
        intersect.distanceTo(pos2) -
        pos1.distanceTo(pos2)
      ) > PRECISION
    ) {
      return false;
    }

    return true;
  }

  public static twoLinesIntersection(
    position1: Vector3,
    position2: Vector3,
    position3: Vector3,
    position4: Vector3
  ): Vector3 {
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
    position1: Vector3,
    position2: Vector3,
    position3: Vector3,
    position4: Vector3
  ): Vector3 {
    const intersection: Vector3 = new Vector3(0, 0, 0);
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

  // Given three colinear points p, q, r, the function checks if
  // point q lies on line segment 'pr'
  private static onSegment(p: Vector3, q: Vector3, r: Vector3): boolean {
    if (
      q.x <= Math.max(p.x, r.x) &&
      q.x >= Math.min(p.x, r.x) &&
      q.y <= Math.max(p.y, r.y) &&
      q.y >= Math.min(p.y, r.y)
    ) {
      return true;
    }

    return false;
  }

  // To find orientation of ordered triplet (p, q, r).
  // The function returns following values
  // 0 --> p, q and r are colinear
  // 1 --> Clockwise
  // 2 --> Counterclockwise
  private static orientation(p: Vector3, q: Vector3, r: Vector3): number {
    const val: number = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

    if (val === 0) {
      return 0; // colinear
    }

    return val > 0 ? 1 : 2; // clock or counterclock wise
  }

  // The main function that returns true if line segment 'p1q1'
  // and 'p2q2' intersect.
  public static doIntersect(
    p1: Vector3,
    q1: Vector3,
    p2: Vector3,
    q2: Vector3
  ): boolean {
    // Find the four orientations needed for general and
    // special cases
    const o1: number = this.orientation(p1, q1, p2);
    const o2: number = this.orientation(p1, q1, q2);
    const o3: number = this.orientation(p2, q2, p1);
    const o4: number = this.orientation(p2, q2, q1);

    // General case
    if (o1 !== o2 && o3 !== o4) {
      return true;
    }

    // Special Cases
    // p1, q1 and p2 are colinear and p2 lies on segment p1q1
    if (o1 === 0 && this.onSegment(p1, p2, q1)) {
      return true;
    }

    // p1, q1 and q2 are colinear and q2 lies on segment p1q1
    if (o2 === 0 && this.onSegment(p1, q2, q1)) {
      return true;
    }

    // p2, q2 and p1 are colinear and p1 lies on segment p2q2
    if (o3 === 0 && this.onSegment(p2, p1, q2)) {
      return true;
    }

    // p2, q2 and q1 are colinear and q1 lies on segment p2q2
    if (o4 === 0 && this.onSegment(p2, q1, q2)) {
      return true;
    }

    return false; // Doesn't fall in any of the above cases
  }
}
