import * as THREE from "three";
const HALF_CIRCLE_DEGREES: number = 180;
const ANGLE_TRESHOLD: number = 45;
const MAX_LENGTH: number = 25;
const PRECISION: number = 0.0000001;
const EXPONENT: number = 2;

export class TrackValidator {

    private illegalPoints: Array<THREE.Vector3>;

    public constructor() {
        this.illegalPoints = new Array<THREE.Vector3>();
    }

    public getIllegalPoints(): Array<THREE.Vector3> {
        return this.illegalPoints;
    }

    public setIllegalPoints(illegalPoints: Array<THREE.Vector3>): void {
        this.illegalPoints = illegalPoints;
    }

    private lessThan45Degres(position1: THREE.Vector3, position2: THREE.Vector3, position3: THREE.Vector3): void {
        if ((HALF_CIRCLE_DEGREES * (this.calculateAngle(position1, position2, position3)) / Math.PI) < ANGLE_TRESHOLD) {
            this.setPoints(position3, position2);
        }

    }
    private calculateAngle(position1: THREE.Vector3, position2: THREE.Vector3, position3: THREE.Vector3): number {
        return Math.acos((this.calculateDistance(position2, position3) * this.calculateDistance(position2, position3)
            + this.calculateDistance(position2, position1) * this.calculateDistance(position2, position1)
            - this.calculateDistance(position3, position1) * this.calculateDistance(position3, position1)) /
            (EXPONENT * this.calculateDistance(position2, position3) * this.calculateDistance(position2, position1)));
    }

    private calculateDistance(position1: THREE.Vector3, position2: THREE.Vector3): number {
        return Math.sqrt(Math.pow(position1.x - position2.x, EXPONENT) + Math.pow(position1.y - position2.y, EXPONENT));
    }
    private twoLinesIntersect(
        position1: THREE.Vector3,
        position2: THREE.Vector3,
        position3: THREE.Vector3,
        position4: THREE.Vector3): void {

        let intersection: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
        if (position1 === position3 || position1 === position4 || position2 === position3 || position2 === position4) {
            return;
        }

        if (this.calculateDet(position1, position2, position3, position4) !== 0) {
            intersection = this.calculateIntersection(position1, position2, position3, position4);

            if (this.findIsInLine(position1, position2, intersection) && this.findIsInLine(position3, position4, intersection)) {
                this.setPoints(position3, position4);
            }
        }
    }

    private calculateDet(
        position1: THREE.Vector3,
        position2: THREE.Vector3,
        position3: THREE.Vector3,
        position4: THREE.Vector3): number {
        return (position2.y - position1.y) * (position3.x - position4.x)
            - (position4.y - position3.y) * (position1.x - position2.x);
    }

    private calculateIntersection(
        position1: THREE.Vector3,
        position2: THREE.Vector3,
        position3: THREE.Vector3,
        position4: THREE.Vector3): THREE.Vector3 {
        const intersection: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
        intersection.x = (((position3.x - position4.x)
            * ((position2.y - position1.y) * position1.x + (position1.x - position2.x) * position1.y))
            - ((position1.x - position2.x) * ((position4.y - position3.y) * position3.x
                + (position3.x - position4.x) * position3.y))) / this.calculateDet(position1, position2, position3, position4);

        intersection.y = ((position2.y - position1.y)
            * ((position4.y - position3.y) * position3.x + (position3.x - position4.x) * position3.y)
            - (position4.y - position3.y) * ((position2.y - position1.y) * position1.x
                + (position1.x - position2.x) * position1.y)) / this.calculateDet(position1, position2, position3, position4);

        return intersection;
    }

    private findIsInLine(position1: THREE.Vector3, position2: THREE.Vector3, intersection: THREE.Vector3): boolean {
        if (Math.abs(this.calculateDistance(intersection, position1) + this.calculateDistance(position2, intersection)
            - this.calculateDistance(position2, position1)) > PRECISION) {
            return false;
        }

        return true;
    }

    private lessThanLength(position1: THREE.Vector3, position2: THREE.Vector3): void {
        if (this.calculateDistance(position1, position2) < (MAX_LENGTH)) {
            this.illegalPoints.push(new THREE.Vector3(0, 0, 0));
        }
    }

    public isValid(arrayPoints: THREE.Vector3[], position1: THREE.Vector3, position2: THREE.Vector3): THREE.Vector3[] {
        const index: number = arrayPoints.indexOf(position1);
        this.lessThanLength(position1, position2);
        if (index === 0) {
            return this.illegalPoints;
        }
        this.lessThan45Degres(position2, position1, arrayPoints[index - 1]);

        if (position2 === arrayPoints[0]) {
            this.lessThan45Degres(position1, position2, arrayPoints[1]);
        }
        for (let i: number = 0; i < arrayPoints.length - 1; i++) {
            this.twoLinesIntersect(position2, position1, arrayPoints[i], arrayPoints[i + 1]);
        }

        return this.illegalPoints;
    }

    private setPoints(position0: THREE.Vector3, position1: THREE.Vector3): void {
        if (this.illegalPoints.length === 1) {
            this.illegalPoints.pop();
        }
        this.illegalPoints.push(position0);
        this.illegalPoints.push(position1);

    }

    public emptyPoints(): void {
        while (this.illegalPoints.length > 0) {
            this.illegalPoints.pop();
        }
    }

}
