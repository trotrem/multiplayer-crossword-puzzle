import { Injectable } from "@angular/core";
import * as THREE from "three";
const MAX_SELECTION: number = 2;
const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;
const INITIAL_CAMERA_POSITION_Z: number = 100;

@Injectable()
export class RenderEditorService {
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private canvas: HTMLCanvasElement;

    public constructor() { }

    public initialize(canvas: HTMLCanvasElement, scene: THREE.Scene): void {
        if (canvas) {
            this.canvas = canvas;
        }
        this.initializaCamera();
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.animate(scene);

    }

    private initializaCamera(): void {
        this.camera = new THREE.PerspectiveCamera(
            FIELD_OF_VIEW,
            this.getAspectRatio(),
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );

        this.camera.position.set(0, 0, INITIAL_CAMERA_POSITION_Z);
    }

    private animate( scene: THREE.Scene): void {
        requestAnimationFrame(() => this.animate( scene));
        this.renderer.render(scene, this.camera);
    }

    private getAspectRatio(): number {
        return this.canvas.clientWidth / this.canvas.clientHeight;
    }

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
