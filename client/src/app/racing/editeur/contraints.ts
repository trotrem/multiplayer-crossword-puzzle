import * as THREE from "three";
const HALF_CIRCLE_DEGREES: number = 180;
const ANGLE_TRESHOLD: number = 45;
const MAX_LENGTH: number = 25;
const PRECISION: number = 0.0000001;
const EXPONENT: number = 2;

export class Contraints {

    public constructor() { }

    private lessThan45Degres(position1: THREE.Vector3, position2: THREE.Vector3, position3: THREE.Vector3): boolean {
        if ((HALF_CIRCLE_DEGREES * (this.calculAngle(position1, position2, position3)) / Math.PI) < ANGLE_TRESHOLD) {
            return true;
        }

        return false;
    }
    private calculAngle(position1: THREE.Vector3, position2: THREE.Vector3, position3: THREE.Vector3): number {
        return Math.acos((this.calculDistance(position2, position3) * this.calculDistance(position2, position3)
            + this.calculDistance(position2, position1) * this.calculDistance(position2, position1)
            - this.calculDistance(position3, position1) * this.calculDistance(position3, position1)) /
            (EXPONENT * this.calculDistance(position2, position3) * this.calculDistance(position2, position1)));
    }

    private calculDistance(position1: THREE.Vector3, position2: THREE.Vector3): number {
        return Math.sqrt(Math.pow(position1.x - position2.x, EXPONENT) + Math.pow(position1.y - position2.y, EXPONENT));
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
        if (Math.abs(this.calculDistance(intersection, position1) + this.calculDistance(position2, intersection)
            - this.calculDistance(position2, position1)) > PRECISION) {
            return false;
        }

        return true;
    }

    private lessThanLength(position1: THREE.Vector3, position2: THREE.Vector3): boolean {
        if (this.calculDistance(position1, position2) < (MAX_LENGTH)) {
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
        if (this.lessThan45Degres(position2, position1, position0)) {
            illegalPoints = this.checkArrayLength(illegalPoints);
            illegalPoints.push(position0);
            illegalPoints.push(position1);
        }
        // contraint about the angle when the track is close

        if (position2 === arrayPoints[0] && this.lessThan45Degres(arrayPoints[1], position2, position1)) {
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
