import { Injectable } from "@angular/core";
import * as THREE from "three";
import { EventHandlerService } from "../eventHandler.services/event-handler.service";

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

  private renderer: THREE.Renderer;

  public canvas: HTMLCanvasElement;

  private eventHandlerService: EventHandlerService;

  public constructor() {

  }
  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
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
    const CAMERA_DISTANCE: number = 100;
    this.camera.position.set(0, 0, CAMERA_DISTANCE);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.eventHandlerService = new EventHandlerService(this.scene, this.canvas, this.camera);
  }

  public animate(): void {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  public updateScene(event: MouseEvent, eventNumber: number): void {
    switch (eventNumber) {
      case CLICK:
        this.eventHandlerService.onLeftClick(event);
        break;
      case CONTEXTMENU:
        this.eventHandlerService.onRightClick(event);
        break;
      case DRAGSTART:
        this.eventHandlerService.getDraggedPointIndex(event);
        break;
      case DRAG:
        this.eventHandlerService.onDrag(event, false);
        break;
      case DRAGEND:
        this.eventHandlerService.onDrag(event, true);
        break;
      default:
        break;
    }
  }

  public redraw(newPoints: Array<THREE.Vector3>): void {
    this.eventHandlerService.redrawTrack(newPoints);
  }

  public getPoints(): Array<THREE.Vector3> {
    return this.eventHandlerService.getPoints();
  }

  public getTrackValid(): boolean {
    return this.eventHandlerService.getTrackValid();
  }

  public getIsClosed(): boolean {
    return this.eventHandlerService.getIsClosed();
  }
  public setIsClosed(isClosed: boolean): void {
    this.eventHandlerService.setIsClosed(isClosed);
  }
}
