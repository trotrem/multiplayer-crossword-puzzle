import { Injectable } from "@angular/core";
import * as THREE from "three";
import { RenderService } from "../../render.service/render.service";
const MAX_SELECTION: number = 2;
const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;
const INITIAL_CAMERA_POSITION_Z: number = 100;

@Injectable()
export class RenderEditorService extends RenderService {
    private camera: THREE.PerspectiveCamera;

    public constructor() {
        super();
    }

    public initialize(canvas: HTMLCanvasElement, scene: THREE.Scene): void {
        super.initializeSuper(canvas);
        this.initializeCamera();
        this.animate(scene);

    }

    private initializeCamera(): void {
        this.camera = new THREE.PerspectiveCamera(
            FIELD_OF_VIEW,
            this.getAspectRatio(),
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );

        this.camera.position.set(0, 0, INITIAL_CAMERA_POSITION_Z);
    }

    private animate(scene: THREE.Scene): void {
        requestAnimationFrame(() => this.animate(scene));
        this.renderer.render(scene, this.camera);
    }
//TODO: montrer à Jinghui
    public convertToWorldPosition(positionEvent: THREE.Vector3): THREE.Vector3 {
        const canvasRectangle: ClientRect = this.canvas.getBoundingClientRect();
        const canvasPosition: THREE.Vector3 =
            new THREE.Vector3(positionEvent.x - canvasRectangle.left, positionEvent.y - canvasRectangle.top);
        const canvasVector: THREE.Vector3 = new THREE.Vector3(
            (canvasPosition.x / this.canvas.width) * MAX_SELECTION - 1,
            -(canvasPosition.y / this.canvas.height) * MAX_SELECTION + 1,
            0);
        canvasVector.unproject(this.camera);
        const direction: THREE.Vector3 = canvasVector.sub(this.camera.position);

        return this.camera.position.clone().add(direction.multiplyScalar(- this.camera.position.z / direction.z));
    }

}
