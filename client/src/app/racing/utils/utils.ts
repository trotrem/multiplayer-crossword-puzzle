import { Vector3 } from "three";

export interface ILine {
    pos1: THREE.Vector3;
    pos2: THREE.Vector3;
}

const EXPONENT: number = 2;
const PRECISION: number = 0.0001;

export class RaceUtils {

    public static calculateAngle(position1: THREE.Vector3, position2: THREE.Vector3, position3: THREE.Vector3): number {
        return Math.acos((this.calculateDistance(position2, position3) * this.calculateDistance(position2, position3)
            + this.calculateDistance(position2, position1) * this.calculateDistance(position2, position1)
            - this.calculateDistance(position3, position1) * this.calculateDistance(position3, position1)) /
            (EXPONENT * this.calculateDistance(position2, position3) * this.calculateDistance(position2, position1)));
    }

    public static calculateDistance(position1: THREE.Vector3, position2: THREE.Vector3): number {
        return Math.sqrt(Math.pow(position1.x - position2.x, EXPONENT) + Math.pow(position1.y - position2.y, EXPONENT));
    }

    public static arelinesCrossing(
        pos1: Vector3,
        pos2: Vector3,
        pos3: Vector3,
        pos4: Vector3
    ): boolean {
        const intersect: Vector3 = this.getTwoLinesIntersection(
            pos1,
            pos2,
            pos3,
            pos4
        );
        return (
            intersect === null ||
            Math.abs(
                pos1.distanceTo(intersect) +
                intersect.distanceTo(pos2) -
                pos1.distanceTo(pos2)
            ) > PRECISION
        )
    }

    public static getTwoLinesIntersection(
        position1: Vector3,
        position2: Vector3,
        position3: Vector3,
        position4: Vector3
    ): Vector3 {
        if (this.getDet(position1, position2, position3, position4) !== 0) {
            return this.getIntersection(
                position1,
                position2,
                position3,
                position4
            );
        }

        return null;
    }

    private static getDet(
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

    private static getIntersection(
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
            this.getDet(position1, position2, position3, position4);

        intersection.y =
            ((position2.y - position1.y) *
                ((position4.y - position3.y) * position3.x +
                    (position3.x - position4.x) * position3.y) -
                (position4.y - position3.y) *
                ((position2.y - position1.y) * position1.x +
                    (position1.x - position2.x) * position1.y)) /
            this.getDet(position1, position2, position3, position4);

        return intersection;
    }

    private static isPointOnSegment(p: Vector3, q: Vector3, r: Vector3): boolean {
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
    private static getOrientation(p: Vector3, q: Vector3, r: Vector3): number {
        const val: number = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

        if (val === 0) {
            return 0; // colinear
        }

        return val > 0 ? 1 : 2; // clock or counterclock wise
    }

    public static doLinesIntersect(
        p1: Vector3,
        q1: Vector3,
        p2: Vector3,
        q2: Vector3
    ): boolean {
        const o1: number = this.getOrientation(p1, q1, p2);
        const o2: number = this.getOrientation(p1, q1, q2);
        const o3: number = this.getOrientation(p2, q2, p1);
        const o4: number = this.getOrientation(p2, q2, q1);

        return (o1 !== o2 && o3 !== o4) ||
               (o1 === 0 && this.isPointOnSegment(p1, p2, q1)) ||
               (o2 === 0 && this.isPointOnSegment(p1, q2, q1)) ||
               (o3 === 0 && this.isPointOnSegment(p2, p1, q2)) ||
               (o4 === 0 && this.isPointOnSegment(p2, q1, q2));
    }
}
