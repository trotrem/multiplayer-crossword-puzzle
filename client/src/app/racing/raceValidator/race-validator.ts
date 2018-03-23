import * as THREE from "three";
const ARRAY_DIVIDER: number = 1;
const MAX_DISTANCE: number = 60;
export class RaceValidator {
    public static getLapPositionVerifiers( meshs: THREE.Mesh[]): THREE.Vector3[] {
        const positions: THREE.Vector3[] = new Array<THREE.Vector3>();
        for (let i: number = 0; i < meshs.length ; i += ARRAY_DIVIDER) {
            positions.push(meshs[i].position);
        }

        return positions;
    }

    public static validateLapSection(carPosition: THREE.Vector3, position: THREE.Vector3): boolean {

        const position2: THREE.Vector3 = carPosition.clone().set(carPosition.x, carPosition.z, carPosition.y);

        return position2.distanceTo(position) <= MAX_DISTANCE;
    }

}
