import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import * as THREE from "three";
import { Contraints } from "./contraints";

const MAX_SELECTION_DISTANCE: number = 2;

@Component({
  selector: "app-editeur",
  templateUrl: "./editeur.component.html",
  styleUrls: ["./editeur.component.css"]
})

export class EditeurComponent implements AfterViewInit {

  @ViewChild("canvas")
  private canvasRef: ElementRef;

  private camera: THREE.PerspectiveCamera;

  private scene: THREE.Scene;

  private renderer: THREE.Renderer;

  public arrayPoints: THREE.Vector3[];

  private isClosed: boolean;

  private dragIndex: number;

  private contraintes: Contraints;

  private departZone: THREE.Line3;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  public constructor() {
    this.dragIndex = -1;
    this.arrayPoints = new Array<THREE.Vector3>();
    this.contraintes = new Contraints();
    this.departZone = new THREE.Line3();
  }

  public ngAfterViewInit(): void {
    this.createScene();
    this.animate();
    this.subscribeEvents();
  }

  private subscribeEvents(): void {
    this.canvas.addEventListener("click", (event: MouseEvent) => this.onLeftClick(event));
    this.canvas.addEventListener("contextmenu", (event: MouseEvent) => {
      event.preventDefault();
      this.onRightClick();
    });
    this.canvas.addEventListener("dragstart", (event: MouseEvent) => {
      this.dragIndex = this.getDraggedPointIndex(event);
    });
    this.canvas.addEventListener("dragend", (event: MouseEvent) => {
      this.onDragEnd(event);
    });
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

  public getScene(): THREE.Scene {
    return this.scene;
  }

  public animate(): void {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  public onLeftClick(event: MouseEvent): void {
    if (this.isClosed) {
      return null;
    }

    const position: THREE.Vector3 = this.getPlacementPosition(event);

    if (this.arrayPoints.length === 0) {
      this.createFirstPointContour(position);
    }
    this.createPoint(position);

    if (this.arrayPoints.length > 0) {
      this.createLine(this.arrayPoints[this.arrayPoints.length - 1], position);
    }

    this.arrayPoints.push(position);

  }

  public onRightClick(): void {
    this.isClosed = false;
    this.departZone = new THREE.Line3();
    // disabled tslint in the following lines so it wouldn't trigger on the 2s and the disable tslint comments
    const nbChildren = this.scene.children.length;// tslint:disable-line
    const tempArray = this.arrayPoints;// tslint:disable-line
    this.arrayPoints = [];
    tempArray.pop();
    if (tempArray.length > 0) {
      this.redraw(tempArray);
    }
    else {
      this.scene.remove(this.scene.children[nbChildren - 1]);
      this.scene.remove(this.scene.children[nbChildren - 2]);// tslint:disable-line 
    }

  }

  private onDragEnd(event: MouseEvent): void {
    // disabled tslint in the following lines so it wouldn't trigger on the 2s and the disable tslint comments
    event.preventDefault();
    const tempArray = this.arrayPoints; // tslint:disable-line
    this.arrayPoints = [];
    this.departZone = new THREE.Line3();
    const position = this.convertToWorldPosition(event); // tslint:disable-line
    tempArray[this.dragIndex] = position;
    if (this.dragIndex === tempArray.length - 1 && this.isClosed) {
      tempArray[0] = position;
    }
    this.dragIndex = -1;
    this.redraw(tempArray);
  }

  private getDraggedPointIndex(event: MouseEvent): number {
    // disabled tslint in the following lines so it wouldn't trigger on the 2s and the disable tslint comments
    const position = this.convertToWorldPosition(event); // tslint:disable-line
    let index = -1;  // tslint:disable-line
    this.arrayPoints.forEach((point, i) => {
      if (position.distanceTo(point) < MAX_SELECTION_DISTANCE) {
        index = i;
      }
    });

    return index;
  }

  private convertToWorldPosition(event: MouseEvent): THREE.Vector3 {
     // disabled tslint in the following lines so it wouldn't trigger on the 2s and the disable tslint comments
    const rect = this.canvas.getBoundingClientRect(); // tslint:disable-line
    const canvasPos = new THREE.Vector3(event.x - rect.left, event.y - rect.top); // tslint:disable-line
    const vector = new THREE.Vector3((canvasPos.x / this.canvas.width) * 2 - 1, -(canvasPos.y / this.canvas.height) * 2 + 1, 0); // tslint:disable-line
    vector.unproject(this.camera);
    const dir = vector.sub(this.camera.position);// tslint:disable-line
    const distance = - this.camera.position.z / dir.z;// tslint:disable-line

    return this.camera.position.clone().add(dir.multiplyScalar(distance));
  }

  private getPlacementPosition(event: MouseEvent): THREE.Vector3 {
      // disabled tslint in the following lines so it wouldn't trigger on the 2s and the disable tslint comments
    let position = this.convertToWorldPosition(event);// tslint:disable-line
    if (this.arrayPoints.length > 2 && position.distanceTo(this.arrayPoints[0]) < MAX_SELECTION_DISTANCE) { // tslint:disable-line
      position = this.arrayPoints[0];
      this.isClosed = true;
      this.departZone = new THREE.Line3(this.arrayPoints[0], this.arrayPoints[1]);
    }

    return position;
  }

  private createFirstPointContour(position: THREE.Vector3): void {
      // disabled tslint in the following lines so it wouldn't trigger on the 2s and the disable tslint comments
    const geometryPoint = new THREE.Geometry();// tslint:disable-line
    geometryPoint.vertices.push(position);
    const material = new THREE.PointsMaterial({ size: 5, color: 0xFAA61A });// tslint:disable-line
    const dot = new THREE.Points(geometryPoint, material);// tslint:disable-line
    this.scene.add(dot);
  }

  public createPoint(position: THREE.Vector3): void {
     // disabled tslint in the following lines so it wouldn't trigger on the 2s and the disable tslint comments
    const geometryPoint = new THREE.Geometry();// tslint:disable-line
    geometryPoint.vertices.push(position);
    const material: THREE.PointsMaterial = new THREE.PointsMaterial({ size: 3, color: 0xFF00A7 });
    const dot: THREE.Points = new THREE.Points(geometryPoint, material);
    this.scene.add(dot);

  }

  public createLine(lastPos: THREE.Vector3, newPos: THREE.Vector3): void {
     // disabled tslint in the following lines so it wouldn't trigger on the 2s and the disable tslint comments
    let arrayTmp = new Array<THREE.Vector3>();// tslint:disable-line
    let color;// tslint:disable-line
    arrayTmp = this.contraintes.isValid(this.arrayPoints, lastPos, newPos);

    if (arrayTmp.length === 0) {
      color = 0x88D8B0; // tslint:disable-line
    }
    else {
      color = 0xFF0000; // tslint:disable-line 
      if (arrayTmp.length > 1)  {
        this.redrawConflictingLines(arrayTmp, color);
      }
    }

    const geometryLine = new THREE.Geometry;// tslint:disable-line
    geometryLine.vertices.push(lastPos);
    geometryLine.vertices.push(newPos);
    const line = new THREE.Line(geometryLine, new THREE.LineBasicMaterial({ "linewidth": 6, color }));// tslint:disable-line
    this.scene.add(line);

  }

  private redrawConflictingLines(arrayTmp: THREE.Vector3[], color: number): void {
     // disabled tslint in the following lines so it wouldn't trigger on the 2s and the disable tslint comments
    for (let i = 0; i < arrayTmp.length; i += 2) {// tslint:disable-line
      const geoLine = new THREE.Geometry;// tslint:disable-line
      geoLine.vertices.push(arrayTmp[i]);
      geoLine.vertices.push(arrayTmp[i + 1]);
      const line = new THREE.Line(geoLine, new THREE.LineBasicMaterial({ "linewidth": 6, "color": color }));// tslint:disable-line
      this.scene.add(line);
    }
  }

  private redraw(newArray: THREE.Vector3[]): void {
    if (!newArray) {
      return;
    }

    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }

    this.createFirstPointContour(newArray[0]);
    this.createPoint(newArray[0]);
    this.arrayPoints.push(newArray[0]);

    for (const position of newArray.slice(1)) {
      this.createLine(this.arrayPoints[this.arrayPoints.length - 1], position);
      this.createPoint(position);
      this.arrayPoints.push(position);
    }
    this.departZone = new THREE.Line3(this.arrayPoints[0], this.arrayPoints[1]);

  }
}
