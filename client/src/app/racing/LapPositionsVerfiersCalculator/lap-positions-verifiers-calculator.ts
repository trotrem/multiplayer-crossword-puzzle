import * as THREE from "three";
const ADD_TO_DISTANCE: number = 30;
export class LapPositionsVerfiersCalculator {
    public static getLapPositionVerifiers( meshs: THREE.Mesh[]): THREE.Vector3[] {
        const positions: THREE.Vector3[] = new Array<THREE.Vector3>();

        for (const mesh of meshs) {
                positions.push(mesh.position.clone());

        }

        return positions;
    }
    private static getMaxDistance(carPosition: THREE.Vector3): number {

        return carPosition.length() + ADD_TO_DISTANCE ;

    }

    public static validateLapSection(carPosition: THREE.Vector3, position: THREE.Vector3): boolean {

        const position2: THREE.Vector3 = carPosition.clone().set(carPosition.x, carPosition.z, carPosition.y);

        return position2.distanceTo(position) <= LapPositionsVerfiersCalculator.getMaxDistance(carPosition);
    }

}
