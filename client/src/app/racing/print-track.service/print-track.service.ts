import { Injectable } from "@angular/core";
import * as THREE from "three";
import { ThrowStmt } from "@angular/compiler";
import { Car } from "../car/car";
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
const CAMERA_DISTANCE: number = 100;

@Injectable()
export class PrintTrackService {

  private camera: THREE.PerspectiveCamera;

  private scene: THREE.Scene;

  private renderer: THREE.Renderer;

  private canvas: HTMLCanvasElement;

  private cars: Car[];

  private printCarService: PrintCarsService;

  public constructor() {
    this.cars = new Array<Car>(MAX_CARS_PAIRS);
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
    this.camera.position.set(0, CAMERA_DISTANCE, 0); // pour changer à la vue initiale on la remet à
                                                     //  this.camera.position.set(0, 0, CAMERA_DISTANCE);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    for (let i: number = 0; i < MAX_CARS_PAIRS; i++) {
    this.cars = this.printCarService.initiateCars(this.camera, this.scene);
    }
  }

  public animate(): void {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  public drawTrack(points: THREE.Vector3[]): void {
    for (let i: number = 1; i < points.length; i++) {
      const lineGeometry: THREE.Geometry = new THREE.Geometry;
      let material: THREE.LineBasicMaterial = LINE_MATERIAL ;
      lineGeometry.vertices.push(points[i - 1]);
      lineGeometry.vertices.push(points[i]);
      if (i === 1) {
        material = FIRST_LINE_MATERIAL;
      }
      this.scene.add(new THREE.Line(lineGeometry, material));
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
  public insertCars(line: THREE.Line3): void {

    this.cars = this.printCarService.insertCars(line, this.scene);

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

  public setCars(cars: Car[]): void {
      this.cars = cars;
  }
  public getCars(): Car[] {
    return this.cars;
}
}
