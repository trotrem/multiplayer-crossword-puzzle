import { Injectable } from "@angular/core";
import * as THREE from "three";
// import * as extrudePolyline from "extrude-polyline";
import { ThrowStmt } from "@angular/compiler";
import { PrintCarsService } from "../printCar.service/print-cars.service";
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
const MAX_CARS_PAIRS: number = 2;
const CAMERA_DISTANCE: number = 150;

@Injectable()
export class PrintTrackService {

  private camera: THREE.PerspectiveCamera;

  private scene: THREE.Scene;

  private renderer: THREE.Renderer;

  private canvas: HTMLCanvasElement;

  private printCarService: PrintCarsService;

  public constructor() {
    this.printCarService = new PrintCarsService();

  }

  public initialize(canvas: HTMLCanvasElement): void {
    if (canvas) {
      this.canvas = canvas;
    }
    this.createScene();
    this.animate();
  }
  public createScene(): void {
    this.camera = new THREE.PerspectiveCamera();
    this.camera.position.set(0, 0, CAMERA_DISTANCE); // pour changer à la vue initiale on la remet à
    //  this.camera.position.set(0, 0, CAMERA_DISTANCE);
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
      /*const lineGeometry: THREE.Geometry = new THREE.Geometry;
      let material: THREE.LineBasicMaterial = LINE_MATERIAL;
      lineGeometry.vertices.push(points[i - 1]);
      lineGeometry.vertices.push(points[i]);
      if (i === 1) {
        material = FIRST_LINE_MATERIAL;
      }*/
      // this.scene.add(new THREE.Line(lineGeometry, material));
      const point1: THREE.Vector3 = points[i - 1];
      const point2: THREE.Vector3 = points[i];

      const sphere: THREE.SphereGeometry = new THREE.SphereGeometry(6,10,10);

      const point1mesh: THREE.Mesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0x7B8284 }));
      point1mesh.position.copy(point1);
      this.scene.add(point1mesh);

      const point2mesh: THREE.Mesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0x7B8284 }));
      point2mesh.position.copy(point2);
      this.scene.add(point2mesh);

      const vector12: THREE.Vector3 = new THREE.Vector3().copy(point2).sub(point1);
      const point3: THREE.Vector3 = new THREE.Vector3().copy(vector12).multiplyScalar(0.5).add(point1);

      const plane: THREE.PlaneGeometry = new THREE.PlaneGeometry(1, 1, 1);

      const floor: THREE.Mesh = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ color: 0x7B8284 }));
      floor.position.copy(point3);
      // floor.position. = 31;
      floor.scale.x = vector12.length();
      floor.scale.y = 16;
      // floor.translateZ(-7);
      floor.rotateZ(Math.atan2(vector12.y, vector12.x));
      this.scene.add(floor);
      /*for (let i: number = 0; i < points.length; i += 4) {
        const curve: THREE.CubicBezierCurve3 = new THREE.CubicBezierCurve3(points[i], points[i + 1], points[i + 2], points[i + 3]);
        const curvedPoints: THREE.Vector3[] = curve.getPoints(50);
        const lineGeometry: THREE.Geometry = new THREE.Geometry;
        for (let i: number = 0; i < curvedPoints.length; i++) {
         s lineGeometry.vertices.push(curvedPoints[i]);
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
