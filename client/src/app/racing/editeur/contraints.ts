import * as THREE from "three";

const MAX_LENGTH: number = 25;
const PRECISION: number = 0.0000001;
const EXPONENT: number = 2;

export class Contraints {

    public constructor() { }

    private moreThan45Degres(position1: THREE.Vector3, position2: THREE.Vector3, position3: THREE.Vector3): boolean {
        const AB: number = Math.sqrt(Math.pow(position2.x - position1.x, EXPONENT) + Math.pow(position2.y - position1.y, EXPONENT));
        const BC: number = Math.sqrt(Math.pow(position2.x - position3.x, EXPONENT) + Math.pow(position2.y - position3.y, EXPONENT));
        const AC: number = Math.sqrt(Math.pow(position3.x - position1.x, EXPONENT) + Math.pow(position3.y - position1.y, EXPONENT));
        let angle: number = Math.acos((BC * BC + AB * AB - AC * AC) / (EXPONENT * BC * AB));

        const HALF_CIRCLE_DEGREES: number = 180;
        angle = HALF_CIRCLE_DEGREES * (angle) / Math.PI;

        const ANGLE_TRESHOLD: number = 45;
        if (angle < ANGLE_TRESHOLD) {
            return false;
        }

        return true;
    }

    private twoLinesIntersect(
        position1: THREE.Vector3,
        position2: THREE.Vector3,
        position3: THREE.Vector3,
        position4: THREE.Vector3): boolean {

        const intersection: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
        if (position1 === position3 || position1 === position4 || position2 === position3 || position2 === position4) {
            return false;
        }

        const det: number = (position2.y - position1.y) * (position3.x - position4.x)
            - (position4.y - position3.y) * (position1.x - position2.x);

        if (det !== 0) {
            intersection.x = (((position3.x - position4.x)
                * ((position2.y - position1.y) * position1.x + (position1.x - position2.x) * position1.y))
                - ((position1.x - position2.x) * ((position4.y - position3.y) * position3.x
                    + (position3.x - position4.x) * position3.y))) / det;

            intersection.y = ((position2.y - position1.y)
                * ((position4.y - position3.y) * position3.x + (position3.x - position4.x) * position3.y)
                - (position4.y - position3.y) * ((position2.y - position1.y) * position1.x
                    + (position1.x - position2.x) * position1.y)) / det;

            if (this.findIsInLine(position1, position2, intersection) && this.findIsInLine(position3, position4, intersection)) {
                return true;
            }
        }

        return false;
    }

    private findIsInLine(position1: THREE.Vector3, position2: THREE.Vector3, intersection: THREE.Vector3): boolean {
        const dist1: number = Math.sqrt(Math.pow(intersection.x - position1.x, EXPONENT)
            + Math.pow(intersection.y - position1.y, EXPONENT));
        const dist2: number = Math.sqrt(Math.pow(position2.x - intersection.x, EXPONENT)
            + Math.pow(position2.y - intersection.y, EXPONENT));
        const distTotal: number = Math.sqrt(Math.pow(position2.x - position1.x, EXPONENT) + Math.pow(position2.y - position1.y, EXPONENT));
        if (Math.abs(dist1 + dist2 - distTotal) > PRECISION) {
            return false;
        }

        return true;
    }

    private lessThanLength(position1: THREE.Vector3, position2: THREE.Vector3): boolean {
        const dist: number = Math.sqrt(Math.pow(position1.x - position2.x, EXPONENT) + Math.pow(position1.y - position2.y, EXPONENT));
        if (dist < (MAX_LENGTH )) {
            return true;
        }

        return false;
    }

    private checkArrayLength(array: Array<THREE.Vector3>): Array<THREE.Vector3> {
        if (array.length === 1) {
            array.pop();
        }

        return array;
    }

    public isValid(arrayPoints: THREE.Vector3[], position1: THREE.Vector3, position2: THREE.Vector3): THREE.Vector3[] {
        let illegalPoints: Array<THREE.Vector3> = new Array<THREE.Vector3>();
        const index: number = arrayPoints.indexOf(position1);
        // contraint about the segment must not be less than two time the lenght
        if (this.lessThanLength(position1, position2)) {
            illegalPoints.push(new THREE.Vector3(0, 0, 0));
        }
        if (index === 0) {
            return illegalPoints;
        }
        const position0: THREE.Vector3 = arrayPoints[index - 1];
        // contraint about the angle
        if (!this.moreThan45Degres(position2, position1, position0)) {
            illegalPoints = this.checkArrayLength(illegalPoints);
            illegalPoints.push(position0);
            illegalPoints.push(position1);
        }
        // contraint about the angle when the track is close

        if (position2 === arrayPoints[0] && !this.moreThan45Degres(arrayPoints[1], position2, position1)) {
            illegalPoints = this.checkArrayLength(illegalPoints);
            illegalPoints.push(arrayPoints[1]);
            illegalPoints.push(position2);
        }
        // contraint about two segments must not intersect
        for (let i: number = 0; i < arrayPoints.length - 1; i++) {
            if (this.twoLinesIntersect(position2, position1, arrayPoints[i], arrayPoints[i + 1])) {
                illegalPoints = this.checkArrayLength(illegalPoints);
                illegalPoints.push(arrayPoints[i]);
                illegalPoints.push(arrayPoints[i + 1]);
            }
        }

        return illegalPoints;
    }
}
