import * as THREE from "three";
import { VectorUtils, ILine } from "../../../race-utils/vector-utils";
import { HALF_CIRCLE_DEGREES } from "./../../../../constants";
const ANGLE_TRESHOLD: number = 45;
const MAX_LENGTH: number = 25;

export class TrackValidator {

    public static isValid(arrayPoints: THREE.Vector3[], position1: THREE.Vector3, position2: THREE.Vector3): THREE.Vector3[] {
        const illegalPoints: Array<THREE.Vector3> = new Array<THREE.Vector3>();
        const index: number = arrayPoints.indexOf(position1);
        this.lessThanLength(position1, position2, illegalPoints);
        if (index === 0) {
            return illegalPoints;
        }
        this.lessThan45Degres(position2, position1, arrayPoints[index - 1], illegalPoints);

        if (position2 === arrayPoints[0]) {
            this.lessThan45Degres(position1, position2, arrayPoints[1], illegalPoints);
        }
        for (let i: number = 0; i < arrayPoints.length - 1; i++) {
            this.twoLinesIntersect({ pos1: position2, pos2: position1 }, { pos1: arrayPoints[i], pos2: arrayPoints[i + 1] }, illegalPoints);
        }

        return illegalPoints;
    }

    private static lessThan45Degres(
        position1: THREE.Vector3, position2: THREE.Vector3, position3: THREE.Vector3,
        illegalPoints: Array<THREE.Vector3>): void {
        if ((HALF_CIRCLE_DEGREES * (VectorUtils.getAngle(position1, position2, position3)) / Math.PI) < ANGLE_TRESHOLD) {
            this.setPoints(position3, position2, illegalPoints);
        }

    }

    private static twoLinesIntersect(line1: ILine, line2: ILine, illegalPoints: Array<THREE.Vector3>): void {
        if (line1.pos1 === line2.pos1 || line1.pos1 === line2.pos2 || line1.pos2 === line2.pos1 || line1.pos2 === line2.pos2) {
            return;
        }
        if (VectorUtils.doLinesIntersect(line1, line2)) {
            this.setPoints(line2.pos1, line2.pos2, illegalPoints);
        }
    }

    private static lessThanLength(position1: THREE.Vector3, position2: THREE.Vector3, illegalPoints: Array<THREE.Vector3>): void {
        if (VectorUtils.getDistance(position1, position2) < (MAX_LENGTH)) {
            illegalPoints.push(new THREE.Vector3(0, 0, 0));
        }
    }

    private static setPoints(position0: THREE.Vector3, position1: THREE.Vector3, illegalPoints: Array<THREE.Vector3>): void {
        if (illegalPoints.length === 1) {
            illegalPoints.pop();
        }
        illegalPoints.push(position0);
        illegalPoints.push(position1);

    }

    public static emptyPoints(illegalPoints: Array<THREE.Vector3>): void {
        while (illegalPoints.length > 0) {
            illegalPoints.pop();
        }
    }

}
