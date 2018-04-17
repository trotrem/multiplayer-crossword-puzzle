import { Injectable } from "@angular/core";
import * as THREE from "three";

const DISTANCE_INDEX: number = 2;
const POWER_INDEX: number = 2;
const DISTANCE_DIVIDER: number = 40;
@Injectable()
export class PositionsDefiner {

    private static getStartingPosition(line: THREE.Line3, index: number): THREE.Vector3 {
        return new THREE.Vector3(
            (((line.end.x + line.start.x) / index)), (((line.end.y + line.start.y) / index)), (((line.end.z + line.start.z)) / index));
    }
    public static getDeltaLine(line: THREE.Line3): THREE.Vector3 {

        return new THREE.Vector3(((line.end.x - line.start.x)), ((line.end.y - line.start.y)), ((line.end.z - line.start.z)));
    }
    private static getMaxDistance(line: THREE.Line3): number {
        return Math.sqrt(Math.pow((line.end.x - line.start.x), POWER_INDEX) +
            Math.pow((line.end.y - line.start.y), POWER_INDEX) + Math.pow((line.end.y - line.start.y), POWER_INDEX));
    }

    private static getCarPosition(vector: THREE.Vector3, index1: number, index2: number): THREE.Vector3 {

        const newVector: THREE.Vector3 = vector.clone();
        newVector.setX(newVector.x - index1);
        newVector.setY(newVector.y - index2);

        return newVector;
    }

    public static getCarsPositions(firstLine: THREE.Line3): THREE.Vector3[] {
        const positions: THREE.Vector3[] = new Array<THREE.Vector3>();
        const firstCarPosition: THREE.Vector3 = this.getStartingPosition(firstLine, DISTANCE_INDEX).clone();
        positions.push(this.getCarPosition(
            firstCarPosition, this.getMaxDistance(firstLine) / (DISTANCE_DIVIDER) * -1, this.getMaxDistance(firstLine) / DISTANCE_DIVIDER));
        positions.push(this.getCarPosition(
            firstCarPosition, this.getMaxDistance(firstLine) / DISTANCE_DIVIDER, this.getMaxDistance(firstLine) / DISTANCE_DIVIDER * -1));
        positions.push(this.getCarPosition(
            firstCarPosition, this.getMaxDistance(firstLine) / DISTANCE_DIVIDER, this.getMaxDistance(firstLine) / DISTANCE_DIVIDER));
        positions.push(this.getCarPosition(
            firstCarPosition, this.getMaxDistance(firstLine) / DISTANCE_DIVIDER * -1,
            this.getMaxDistance(firstLine) / DISTANCE_DIVIDER * -1));

        return positions;
    }

}
