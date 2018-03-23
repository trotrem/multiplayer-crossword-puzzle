import * as THREE from "three";
// import { Object3D } from "three";
import { Car } from "../car/car";

export class OrthographicCamera extends THREE.OrthographicCamera {
    private static DISTANCE_TO_TARGET: number = 50;
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
        // this.setupOrthographicView();
    }

    public setTarget(object: THREE.Object3D): void {
        this.target = object;
    }

    public setStartPosition(position: THREE.Vector3, car: Car): void {
        this.position.copy(car.position).add(position);
        this.lookAt(car.position);
    }

    public updatePosition(car: Car): void {
        this.position.copy(car.updatePosition).add(new THREE.Vector3(0, 0, OrthographicCamera.DISTANCE_TO_TARGET));
        this.lookAt(car.updatePosition);
        this.updateProjectionMatrix();

    }

    private setupOrthographicView(): void {
        this.rotation.order = "YXZ";
        this.rotateX(Math.PI / 2);
        this.updateProjectionMatrix();
    }

}
