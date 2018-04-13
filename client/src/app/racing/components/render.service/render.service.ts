import { Injectable } from "@angular/core";
import * as THREE from "three";

@Injectable()
export class RenderService {

  protected canvas: HTMLCanvasElement;
  protected renderer: THREE.WebGLRenderer;

  public constructor() { }

  public initializeSuper(canvas: HTMLCanvasElement): void {
    if (canvas) {
      this.canvas = canvas;
    }

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  protected getAspectRatio(): number {
    return this.canvas.clientWidth / this.canvas.clientHeight;
}

}
