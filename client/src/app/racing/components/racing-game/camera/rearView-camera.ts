import * as THREE from "three";
import { Car } from "../car/car";

export class PerspectiveCamera extends THREE.PerspectiveCamera {
    private static readonly NEAR: number = 1;
    private static readonly FAR: number = 1000;
    private static readonly VIEW_ANGLE: number = 70;
    private DEGREE: number = 360;
    private Z_POSITION: number = 2;
    private XY_POSITION: number = 4;

    public constructor() {
        super(
            PerspectiveCamera.VIEW_ANGLE,
            window.innerWidth / window.innerHeight,
            PerspectiveCamera.NEAR,
            PerspectiveCamera.FAR
        );
    }

    public updatePosition(car: Car): void {
        this.position.copy(car.getUpdatedPosition().sub(car.direction.multiplyScalar(this.XY_POSITION)));
        this.position.z = this.Z_POSITION;

        this.lookAt(car.getUpdatedPosition());
        this.updateProjectionMatrix();

    }

}
