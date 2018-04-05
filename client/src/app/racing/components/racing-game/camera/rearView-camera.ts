import * as THREE from "three";
import { Car } from "../car/car";

const Z_POSITION: number = 10;
const XY_POSITION: number = 100;

export class PerspectiveCamera extends THREE.PerspectiveCamera {
    private static readonly NEAR: number = 1;
    private static readonly FAR: number = 1000;
    private static readonly VIEW_ANGLE: number = 70;

    public constructor() {
        super(
            PerspectiveCamera.VIEW_ANGLE,
            window.innerWidth / window.innerHeight,
            PerspectiveCamera.NEAR,
            PerspectiveCamera.FAR
        );
    }

    public updatePosition(car: Car): void {
        this.position.copy(car.getUpdatedPosition().sub(car.direction.multiplyScalar(XY_POSITION)));
        this.position.z = Z_POSITION;

        this.lookAt(car.getUpdatedPosition());
        this.updateProjectionMatrix();
    }
}
