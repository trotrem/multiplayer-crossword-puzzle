import * as THREE from "three";
import { Car } from "../car/car";

export class PerspectiveCamera extends THREE.PerspectiveCamera {
    /*private static readonly WIDTH: number = window.innerWidth;
    private static readonly HEIGHT: number = window.innerHeight;
    private static readonly ASPECT: number = PerspectiveCamera.WIDTH / PerspectiveCamera.HEIGHT;
    private static readonly NEAR: number = 0.05;
    private static readonly FAR: number = 400;
    private static readonly VIEW_ANGLE: number = 45 * 1.025 ** 20;*/
    public static readonly DRIVER_POSITION: THREE.Vector3 = new THREE.Vector3(-0.25, 1.15, -0.1);
    public static readonly DEFAULT_POSITION: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    public static readonly LOOK_AT_POSITION: THREE.Vector3 = new THREE.Vector3(0, 1.0, -3);


    private static readonly WIDTH: number = window.innerWidth;
    private static readonly HEIGHT: number = window.innerHeight;
    private static readonly ASPECT: number = PerspectiveCamera.WIDTH / PerspectiveCamera.HEIGHT;
    private static readonly NEAR: number = 1;
    private static readonly FAR: number = 1000;
    private static readonly VIEW_ANGLE: number = 70;


    public constructor() {
        super(
            PerspectiveCamera.VIEW_ANGLE,
            PerspectiveCamera.ASPECT,
            PerspectiveCamera.NEAR,
            PerspectiveCamera.FAR
        );
        //this.setupPerspectiveView();
    }

    private setupPerspectiveView(): void {
        this.rotation.order = 'YXZ';
        this.position.copy(PerspectiveCamera.DEFAULT_POSITION);
        this.rotation.set(0, 0, 0);
        this.lookAt(PerspectiveCamera.LOOK_AT_POSITION);
    }

    public setStartPosition(INITIAL_CAMERA_POSITION_Z: number): void {
        this.position.set(0, 0, INITIAL_CAMERA_POSITION_Z);
        this.lookAt(new THREE.Vector3(0, 0, 0));
    }

    public updatePosition(car: Car): void {
        this.position.y =
            car.getUpdatedPosition().y +
            Math.cos(car.angle / 360 * (2 * Math.PI)) * 25;
        this.position.x =
            car.getUpdatedPosition().x +
            Math.sin(car.angle / 360 * (2 * Math.PI)) * 25;
        this.position.z = 50;
        /*this.camera.position.x = this.raceValidator.cars[0].getUpdatedPosition().x + 50;
        this.camera.position.y = this.raceValidator.cars[0].getUpdatedPosition().y;
        this.camera.position.z = 50;*/
        this.lookAt(car.getUpdatedPosition());
        //camera.updateMatrix();
        this.updateProjectionMatrix();

    }

}
