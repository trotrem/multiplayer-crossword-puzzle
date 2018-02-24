import { Injectable } from "@angular/core";
import { Track } from "./../editeur/track";
import * as THREE from "three";
import { ActivatedRoute } from "@angular/router";

@Injectable()
export class SceneServices {
    private camera: THREE.PerspectiveCamera;

    public scene: THREE.Scene;

    private renderer: THREE.Renderer;

    private canvas: HTMLCanvasElement;

    public constructor( private route: ActivatedRoute) {
    }
    public getCamera(): THREE.PerspectiveCamera {
        return this.camera;
    }

    public async initialize(canvas: HTMLCanvasElement): Promise<void> {
        if (canvas) {
            this.canvas = canvas;
        }

        await this.createScene();
        this.animate();
        const name: string = this.route.snapshot.paramMap.get("name");
        if (name !== null) {
           // this.getTrack(name);
        }
    }

    public createScene(): void {
        this.camera = new THREE.PerspectiveCamera();
        const CAMERA_DISTANCE: number = 100;
        this.camera.position.set(0, 0, CAMERA_DISTANCE);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }

   /* private getTrack(name: string): void {
        this.getTrackService(name)
            .subscribe((res: Track[]) => {
                this.track = res[0];
                const newPoints: Array<THREE.Vector3> = this.track.points;
                this.redraw(newPoints);
            });
    }*/

}
