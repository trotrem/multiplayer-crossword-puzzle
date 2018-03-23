import * as THREE from "three";
const ARRAY_MIN: number = 2;
// const MAX_DISTANCE: number = 60;
const MULTIPLY_DISTANCE: number = 2;
export class RaceValidator {
    public static getLapPositionVerifiers( meshs: THREE.Mesh[]): THREE.Vector3[] {
        const positions: THREE.Vector3[] = new Array<THREE.Vector3>();

        for (let i: number = 0; i < meshs.length - ARRAY_MIN ; i += ARRAY_MIN) {
            positions.push(meshs[i].position);
        }

        return positions;
    }
    private static getMaxDistance(carPosition: THREE.Vector3): number {

        return carPosition.length() * MULTIPLY_DISTANCE;

    }

    public static validateLapSection(carPosition: THREE.Vector3, position: THREE.Vector3): boolean {

        const position2: THREE.Vector3 = carPosition.clone().set(carPosition.x, carPosition.z, carPosition.y);

        return position2.distanceTo(position) <= RaceValidator.getMaxDistance(carPosition);
    }

}
