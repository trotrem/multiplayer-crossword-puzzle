import { Injectable } from "@angular/core";
import * as THREE from "three";
const LINE_MATERIAL: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({
  color: 0xFFFFFF,
  linewidth: 7,
  linejoin: "round"
});
const FIRST_LINE_MATERIAL: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({
  color: 0x00FF00,
  linewidth: 7,
  linejoin: "round"
});

@Injectable()
export class PrintTrackService {

  private camera: THREE.PerspectiveCamera;

  private scene: THREE.Scene;

  private renderer: THREE.Renderer;

  private canvas: HTMLCanvasElement;

  public constructor() { }

  public initialize(canvas: HTMLCanvasElement): void {
    if (canvas) {
      this.canvas = canvas;
    }
    this.createScene();
    this.animate();
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

  public drawTrack(points: THREE.Vector3[]): void {
    for (let i: number = 1; i < points.length; i++) {
      const lineGeometry: THREE.Geometry = new THREE.Geometry;
      let line: THREE.Line;
      lineGeometry.vertices.push(points[i - 1]);
      lineGeometry.vertices.push(points[i]);
      if (i === 1) {
        line = new THREE.Line(lineGeometry, FIRST_LINE_MATERIAL);
      } else {
        line = new THREE.Line(lineGeometry, LINE_MATERIAL);
      }
      this.scene.add(line);
      /*for (let i: number = 0; i < points.length; i += 4) {
        const curve: THREE.CubicBezierCurve3 = new THREE.CubicBezierCurve3(points[i], points[i + 1], points[i + 2], points[i + 3]);
        const curvedPoints: THREE.Vector3[] = curve.getPoints(50);
        const lineGeometry: THREE.Geometry = new THREE.Geometry;
        for (let i: number = 0; i < curvedPoints.length; i++) {
          lineGeometry.vertices.push(curvedPoints[i]);
        }
        const line: THREE.Line = new THREE.Line(lineGeometry, LINE_MATERIAL);
        this.scene.add(line);
      }*/
    }
  }
  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }
  public setCamera(camera: THREE.PerspectiveCamera): void {
    this.camera = camera;
  }
  public getScene(): THREE.Scene {
    return this.scene;
  }
  public setScene(scene: THREE.Scene): void {
    this.scene = scene;
  }

  public getRenderer(): THREE.Renderer {
    return this.renderer;
  }

  public setRenderer(renderer: THREE.Renderer): void {
    this.renderer = renderer;
  }
  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }
  public setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
  }

}
