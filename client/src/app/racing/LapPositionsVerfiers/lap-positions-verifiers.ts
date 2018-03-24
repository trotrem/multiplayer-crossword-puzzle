import * as THREE from "three";
const ADD_TO_DISTANCE: number = 100;
const EXPONENT: number = 2;
export class LapPositionsVerfiers {
    public static getLapPositionVerifiers(meshs: THREE.Mesh[]): THREE.Vector3[] {
        const positions: THREE.Vector3[] = new Array<THREE.Vector3>();

        for (const mesh of meshs) {
            positions.push(mesh.position.clone());

        }

        return positions;
    }
    private static getMaxDistance(carPosition: THREE.Vector3): number {

        return carPosition.length() + ADD_TO_DISTANCE;

    }

    public static getLapSectionvalidator(carPosition: THREE.Vector3, position: THREE.Vector3): boolean {

        const position2: THREE.Vector3 = carPosition.clone();
        /* console.log(position2);
         console.log(position);*/

        const dist: number = Math.sqrt(Math.pow(position.x - position2.x, EXPONENT) + Math.pow(position.y - position2.y, EXPONENT));
        console.log(dist);

        return dist <= ADD_TO_DISTANCE/*LapPositionsVerfiers.getMaxDistance(carPosition)*/;
    }

}
