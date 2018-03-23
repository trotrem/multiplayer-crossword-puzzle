import * as THREE from "three";

// TODO: make editor use this
export class RaceUtils {
    public static twoLinesIntersection(
        position1: THREE.Vector3,
        position2: THREE.Vector3,
        position3: THREE.Vector3,
        position4: THREE.Vector3): THREE.Vector3 {
    
        if (this.calculateDet(position1, position2, position3, position4) !== 0) {
            return this.calculateIntersection(position1, position2, position3, position4);
        }

        return null;
    }

    private static calculateDet(
        position1: THREE.Vector3,
        position2: THREE.Vector3,
        position3: THREE.Vector3,
        position4: THREE.Vector3): number {
        return (position2.y - position1.y) * (position3.x - position4.x)
            - (position4.y - position3.y) * (position1.x - position2.x);
    }

    private static calculateIntersection(
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
}