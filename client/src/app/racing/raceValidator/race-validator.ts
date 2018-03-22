import * as THREE from "three";

export class RaceValidator {
    private static getLapPositionVerifiers( positions: THREE.Vector3[]): THREE.Vector3[] {
        const lapPositionVerifiers: THREE.Vector3[] = new Array<THREE.Vector3>();
        lapPositionVerifiers.push(new THREE.Vector3());

        return lapPositionVerifiers;
    }

    public static validateLap(carPosition: THREE.Vector3, lapPositions: THREE.Vector3[]): boolean {
        return true;
    }
}
