import { Vector3 } from "three";

export interface ILine {
    pos1: Vector3;
    pos2: Vector3;
}

export class VectorUtils {

    public static getAngle(position1: Vector3, position2: Vector3, position3: Vector3): number {
        return Math.acos((Math.pow(this.getDistance(position2, position3), 2)
            + Math.pow(this.getDistance(position2, position1), 2)
            - Math.pow(this.getDistance(position3, position1), 2)) /
            (this.getDistance(position2, position3) * this.getDistance(position2, position1) * 2));
    }

    public static getDistance(position1: Vector3, position2: Vector3): number {
        return Math.sqrt(Math.pow(position1.x - position2.x, 2) + Math.pow(position1.y - position2.y, 2));
    }

    public static getIntersection(line1: ILine, line2: ILine): Vector3 {
        const determinant: number = this.getDet(line1, line2);
        if (determinant === 0) {
            return null;
        }
        const intersection: Vector3 = new Vector3(0, 0, 0);
        intersection.x =
            ((line2.pos1.x - line2.pos2.x) *
                ((line1.pos2.y - line1.pos1.y) * line1.pos1.x +
                    (line1.pos1.x - line1.pos2.x) * line1.pos1.y) -
                (line1.pos1.x - line1.pos2.x) *
                ((line2.pos2.y - line2.pos1.y) * line2.pos1.x +
                    (line2.pos1.x - line2.pos2.x) * line2.pos1.y)) / determinant;

        intersection.y =
            ((line1.pos2.y - line1.pos1.y) *
                ((line2.pos2.y - line2.pos1.y) * line2.pos1.x +
                    (line2.pos1.x - line2.pos2.x) * line2.pos1.y) -
                (line2.pos2.y - line2.pos1.y) *
                ((line1.pos2.y - line1.pos1.y) * line1.pos1.x +
                    (line1.pos1.x - line1.pos2.x) * line1.pos1.y)) / determinant;

        return intersection;
    }

    public static doLinesIntersect(line1: ILine, line2: ILine): boolean {
        const orientation1: number = this.getOrientation(line1.pos1, line1.pos2, line2.pos1);
        const orientation2: number = this.getOrientation(line1.pos1, line1.pos2, line2.pos2);
        const orientation3: number = this.getOrientation(line2.pos1, line2.pos2, line1.pos1);
        const orientation4: number = this.getOrientation(line2.pos1, line2.pos2, line1.pos2);

        return (orientation1 !== orientation2 && orientation3 !== orientation4) ||
            (orientation1 === 0 && this.isPointOnSegment(line1.pos1, { pos1: line2.pos1, pos2: line1.pos2 })) ||
            (orientation2 === 0 && this.isPointOnSegment(line1.pos1, { pos1: line2.pos2, pos2: line1.pos2 })) ||
            (orientation3 === 0 && this.isPointOnSegment(line2.pos1, { pos1: line1.pos1, pos2: line2.pos2 })) ||
            (orientation4 === 0 && this.isPointOnSegment(line2.pos1, { pos1: line1.pos2, pos2: line2.pos2 }));
    }

    private static getDet(line1: ILine, line2: ILine): number {
        return (
            (line1.pos2.y - line1.pos1.y) * (line2.pos1.x - line2.pos2.x) -
            (line2.pos2.y - line2.pos1.y) * (line1.pos1.x - line1.pos2.x)
        );
    }
    private static getOrientation(p: Vector3, q: Vector3, r: Vector3): number {
        const val: number = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        if (val === 0) {
            return 0; // return 0 when the points are colinear
        }

        return val > 0 ? 1 : 2; // return 1 for clock wise or return 2 for counterclock wise
    }

    private static isPointOnSegment(point: Vector3, line: ILine): boolean {

        return (
            point.x <= Math.max(line.pos1.x, line.pos2.x) &&
            point.x >= Math.min(line.pos1.x, line.pos2.x) &&
            point.y <= Math.max(line.pos1.y, line.pos2.y) &&
            point.y >= Math.min(line.pos1.y, line.pos2.y)
        );
    }
}
