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

    public updatePosition(carPosition: THREE.Vector3): void {
        // let relativeCameraOffset = new THREE.Vector3(0, 50, 200);

        // let cameraOffset = relativeCameraOffset.applyMatrix4(car.matrixWorld);

        this.position.x = carPosition.x;
        this.position.y = carPosition.z;
        this.position.z = carPosition.y + 1000;
        this.lookAt(carPosition);

        //camera.updateMatrix();
        this.updateProjectionMatrix();

    }

}
