import * as THREE from "three";
import { VectorUtils, ILine } from "../../../race-utils/vector-utils";
import {HALF_CIRCLE_DEGREES} from "./../../../../constants";
const ANGLE_TRESHOLD: number = 45;
const MAX_LENGTH: number = 25;

export class TrackValidator {

    private illegalPoints: Array<THREE.Vector3>;

    public constructor() {
        this.illegalPoints = new Array<THREE.Vector3>();
    }

    private lessThan45Degres(position1: THREE.Vector3, position2: THREE.Vector3, position3: THREE.Vector3): void {
        if ((HALF_CIRCLE_DEGREES * (VectorUtils.getAngle(position1, position2, position3)) / Math.PI) < ANGLE_TRESHOLD) {
            this.setPoints(position3, position2);
        }

    }

    private twoLinesIntersect(line1: ILine, line2: ILine): void {
        if (line1.pos1 === line2.pos1 || line1.pos1 === line2.pos2 || line1.pos2 === line2.pos1 || line1.pos2 === line2.pos2) {
            return;
        }
        if (VectorUtils.doLinesIntersect(line1, line2)) {
            this.setPoints(line2.pos1, line2.pos2);
        }
    }

    private lessThanLength(position1: THREE.Vector3, position2: THREE.Vector3): void {
        if (VectorUtils.getDistance(position1, position2) < (MAX_LENGTH)) {
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
            this.twoLinesIntersect({pos1: position2, pos2:  position1}, {pos1: arrayPoints[i], pos2: arrayPoints[i + 1]});
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
