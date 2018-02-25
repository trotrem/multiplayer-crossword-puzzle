import { Injectable } from "@angular/core";
import * as THREE from "three";
import { TrackCreator } from "./../trackcreator/track-creator";
const MAX_SELECTION: number = 2;

@Injectable()
export class EventHandlerService {

  private trackCreator: TrackCreator;
  private scene: THREE.Scene;
  private dragIndex: number;
  private canvas: HTMLCanvasElement;
  private camera: THREE.PerspectiveCamera;
  private lines: Array<THREE.Line>;

  public constructor(scene: THREE.Scene, canvas: HTMLCanvasElement, camera: THREE.PerspectiveCamera) {
    if (scene) {
      this.scene = scene;
      this.canvas = canvas;
      this.camera = camera;
    }
    this.dragIndex = -1;
    this.trackCreator = new TrackCreator();
    this.lines = new Array<THREE.Line>();
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

    const nbChildren: number = this.scene.children.length;
    const newPoints: THREE.Vector3[] = this.trackCreator.points;
    this.trackCreator.points = [];
    newPoints.pop();
    if (newPoints.length > 0) {
      this.redrawTrack(newPoints);
    } else {
      this.scene.remove(this.scene.children[nbChildren - 1]);
      this.scene.remove(this.scene.children[nbChildren - MAX_SELECTION]);
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

    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
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

  public getPoints(): Array<THREE.Vector3> {
    return this.trackCreator.points;
  }

  public getTrackValid(): boolean {
    return this.trackCreator.trackValid;
  }

  public getIsClosed(): boolean {
    return this.trackCreator.isClosed;
  }
}
