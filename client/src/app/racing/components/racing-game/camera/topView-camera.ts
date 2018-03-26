import * as THREE from "three";
// import { Object3D } from "three";
import { Car } from "../car/car";

export class OrthographicCamera extends THREE.OrthographicCamera {
    private static readonly WIDTH: number = window.innerWidth;
    private static readonly HEIGHT: number = window.innerHeight;
    private static readonly ORTHO_HEIGHT: number = 50;
    private static readonly ASPECT: number = OrthographicCamera.WIDTH / OrthographicCamera.HEIGHT;
    private static readonly NEAR: number = 1;
    private static readonly FAR: number = 1000;

    private target: THREE.Object3D;

    public constructor() {
        super(
            -OrthographicCamera.ORTHO_HEIGHT / 2 * OrthographicCamera.ASPECT,
            OrthographicCamera.ORTHO_HEIGHT / 2 * OrthographicCamera.ASPECT,
            OrthographicCamera.ORTHO_HEIGHT / 2,
            -OrthographicCamera.ORTHO_HEIGHT / 2,
            OrthographicCamera.NEAR,
            OrthographicCamera.FAR
        );
    }

    public setStartPosition(position: THREE.Vector3, carPosition: THREE.Vector3): void {
        this.position.x = carPosition.x;
        this.position.y = carPosition.y;
        this.position.z = position.z;
        this.lookAt(this.position);
        this.updateProjectionMatrix();
    }

    public updatePosition(position: THREE.Vector3): void {
        this.position.x = position.x;
        this.position.y = position.y;
        this.position.z = OrthographicCamera.ORTHO_HEIGHT;
        this.lookAt(this.position);
        this.updateProjectionMatrix();

    }
}
