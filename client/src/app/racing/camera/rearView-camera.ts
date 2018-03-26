import * as THREE from "three";
import { Car } from "../car/car";

export class PerspectiveCamera extends THREE.PerspectiveCamera {
    private static readonly WIDTH: number = window.innerWidth;
    private static readonly HEIGHT: number = window.innerHeight;
    private static readonly ASPECT: number = PerspectiveCamera.WIDTH / PerspectiveCamera.HEIGHT;
    private static readonly NEAR: number = 1;
    private static readonly FAR: number = 1000;
    private static readonly VIEW_ANGLE: number = 70;
    private DEGREE: number = 360;
    private ZPOSITION: number = 50;
    private XYPOSITION: number = 25;
    private RADIAN: number = (Math.PI * 2) * this.DEGREE;

    public constructor() {
        super(
            PerspectiveCamera.VIEW_ANGLE,
            PerspectiveCamera.ASPECT,
            PerspectiveCamera.NEAR,
            PerspectiveCamera.FAR
        );
    }

    public updatePosition(car: Car): void {
        this.position.y =
            car.getUpdatedPosition().y +
            Math.cos(car.angle / this.RADIAN) * this.XYPOSITION;
        this.position.x =
            car.getUpdatedPosition().x +
            Math.sin(car.angle / this.RADIAN) * this.XYPOSITION;
        this.position.z = this.ZPOSITION;
        this.lookAt(car.getUpdatedPosition());
        this.updateProjectionMatrix();

    }

}
