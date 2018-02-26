import { Injectable } from "@angular/core";
import * as THREE from "three";
import { TrackCreator } from "./../trackcreator/track-creator";

const MAX_SELECTION: number = 2;
const CLICK: number = 0;
const CONTEXTMENU: number = 1;
const DRAGSTART: number = 2;
const DRAG: number = 3;
const DRAGEND: number = 4;

@Injectable()
export class SceneServices {
  public camera: THREE.PerspectiveCamera;

  public scene: THREE.Scene;
  private lines: Array<THREE.Line>;

  private renderer: THREE.Renderer;
  private dragIndex: number;

  public canvas: HTMLCanvasElement;
  private trackCreator: TrackCreator;

  public constructor() {

  }
  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  public initialize(canvas: HTMLCanvasElement): void {
    if (canvas) {
      this.canvas = canvas;
    }
    this.dragIndex = -1;
    this.trackCreator = new TrackCreator();
    this.lines = new Array<THREE.Line>();
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
  public onLeftClick(event: MouseEvent): void {
    if (this.trackCreator.isClosed) {
      return null;
    }
    const position: THREE.Vector3 = this.trackCreator.getPlacementPosition(event, this.canvas, this.camera);
    if (this.trackCreator.points.length === 0) {
      this.scene.add(this.trackCreator.createFirstPointContour(position));
    }
    this.scene.add(this.trackCreator.createPoint(position));

    if (this.trackCreator.points.length > 0) {
      this.lines = this.trackCreator.createLine(this.trackCreator.points[this.trackCreator.points.length - 1], position);
      this.addLinesToScene();
    }

    this.trackCreator.points.push(position);
  }

  private addLinesToScene(): void {
    for (const i of this.lines) {
      this.scene.add(i);
    }
  }

  public onRightClick(event: MouseEvent): void {
    event.preventDefault();
    this.trackCreator.isClosed = false;
    const newPoints: THREE.Vector3[] = this.trackCreator.points;
    this.trackCreator.points = [];
    newPoints.pop();
    if (newPoints.length > 0) {
      this.redrawTrack(newPoints);
    } else {
      this.removeTrack();
    }
  }

  public onDrag(event: MouseEvent, end: boolean): void {
    const newPoints: THREE.Vector3[] = this.trackCreator.points;
    this.trackCreator.points = [];

    const position: THREE.Vector3 = this.trackCreator.convertToWorldPosition(event, this.canvas, this.camera);
    newPoints[this.dragIndex] = position;
    if (this.dragIndex === newPoints.length - 1 && this.trackCreator.isClosed) {
      newPoints[0] = position;
    }

    this.redrawTrack(newPoints);
    if (end) {
      this.dragIndex = -1;
    }
  }

  public getDraggedPointIndex(event: MouseEvent): void {
    const position: THREE.Vector3 = this.trackCreator.convertToWorldPosition(event, this.canvas, this.camera);
    let index: number = -1;
    this.trackCreator.points.forEach((point, i) => {
      if (position.distanceTo(point) < MAX_SELECTION) {
        index = i;
      }
    });

    this.dragIndex = index;
  }

  public redrawTrack(newPoints: THREE.Vector3[]): void {
    this.trackCreator.trackValid = true;
    if (!newPoints) {
      return;
    }
    if (this.trackCreator.isClosed) {
      newPoints[newPoints.length - 1] = newPoints[0];
    }
    this.removeTrack();
    this.scene.add(this.trackCreator.createFirstPointContour(newPoints[0]));
    this.scene.add(this.trackCreator.createPoint(newPoints[0]));
    this.trackCreator.points.push(newPoints[0]);

    for (const position of newPoints.slice(1)) {
      this.lines = this.trackCreator.createLine(this.trackCreator.points[this.trackCreator.points.length - 1], position);
      this.scene.add(this.trackCreator.createPoint(position));
      this.trackCreator.points.push(position);
      this.addLinesToScene();
    }

  }

  public removeTrack(): void {
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
  }
  public getPoints(): Array<THREE.Vector3> {
    return this.trackCreator.points;
  }

  public getTrackValid(): boolean {
    return this.trackCreator.trackValid;
  }

  public getIsClosed(): boolean {
    return this.trackCreator.isClosed;
  }

  public setIsClosed(isClosed: boolean): void {
    this.trackCreator.isClosed = isClosed;
  }
}
