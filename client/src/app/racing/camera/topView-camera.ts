import * as THREE from "three";
// import { Object3D } from "three";
import { Car } from "../car/car";

export class OrthographicCamera extends THREE.OrthographicCamera {
    private static DISTANCE_TO_TARGET: number = 50;
    private static readonly WIDTH: number = window.innerWidth;
    private static readonly HEIGHT: number = window.innerHeight;
    private static readonly ORTHO_HEIGHT: number = 100;
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
        this.updateProjectionMatrix();
        // this.setupOrthographicView();
    }

    public setStartPosition(position: THREE.Vector3, carPosition: THREE.Vector3): void {
        this.position.x = carPosition.x;
        this.position.y = carPosition.y;
        this.position.z = position.z;
        this.lookAt(this.position);
        this.updateProjectionMatrix();
    }

    public updatePosition(position: THREE.Vector3): void {
        // this.position.copy(position).add(new THREE.Vector3(0, 0, OrthographicCamera.DISTANCE_TO_TARGET));
        //console.log("Position X : " + position.x);
        //console.log("Position Z : " + position.z);
        this.position.x = position.x;
        this.position.y = position.y;
        this.position.z = 100;
        this.lookAt(this.position);
        this.updateProjectionMatrix();

    }


    private setupOrthographicView(): void {
        this.rotation.order = "YXZ";
        this.rotateZ(Math.PI / 2);
        this.updateProjectionMatrix();
    }

}
