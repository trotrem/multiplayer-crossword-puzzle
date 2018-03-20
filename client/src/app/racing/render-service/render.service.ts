import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import * as THREE from "three";
import { Car } from "../car/car";
import { EventHandlerRenderService } from "./event-handler-render.service";
import { PrintCarsService } from "../printCar.service/print-cars.service";
import { PrintTrackService } from "../print-track.service/print-track.service";

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;

const INITIAL_CAMERA_POSITION_Z: number = 70;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;
const CARS_MAX: number = 4;
const LIGHT_RADIUS: number = 0.25;
@Injectable()
export class RenderService {
    private camera: THREE.PerspectiveCamera;
    private container: HTMLDivElement;
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private stats: Stats;
    private lastDate: number;
    private evenHandeler: EventHandlerRenderService;
    private printCarService: PrintCarsService;
    private printTrackService: PrintTrackService;

    public constructor() {
        this.evenHandeler = new EventHandlerRenderService();
        this.printCarService = new PrintCarsService();
        this.printTrackService = new PrintTrackService();
    }
    public getSene(): THREE.Scene {
        return this.scene;
    }

    public async initialize(container: HTMLDivElement, line: THREE.Line3, cars: Car[]): Promise<void>  {
        if (container) {
            this.container = container;
        }
        // let position: THREE.Vector3 = new THREE.Vector3();
        // position = line.end.sub(line.start);
        await this.createScene(cars);
        this.printCarService.insertCars(line, this.scene, cars);
        this.initStats();
        this.startRenderingLoop(cars);
        console.warn(this.scene);

    }

    private initStats(): void {
        this.stats = new Stats();
        this.stats.dom.style.position = "absolute";
        this.container.appendChild(this.stats.dom);
    }

    private update(cars: Car[]): void {
        const timeSinceLastFrame: number = Date.now() - this.lastDate;
        for (let i: number = 0 ; i < CARS_MAX ; i++) {
            cars[i].update(timeSinceLastFrame);
        }
        // this.camera.position.copy(cars[0].position);
        // this.camera.lookAt(cars[0].position);
        this.lastDate = Date.now();
    }

    private async createScene(cars: Car[]): Promise<void> {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            FIELD_OF_VIEW,
            this.getAspectRatio(),
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );
        // this.camera = new THREE.PerspectiveCamera();

        this.camera.position.set(0, 0, INITIAL_CAMERA_POSITION_Z);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        for (let i: number = 0; i < CARS_MAX; i++) {
            cars[i] = new Car();
            await cars[i].init();
            this.camera.lookAt(cars[0].position);
            this.scene.add(cars[i]);
            this.scene.add(new THREE.AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
            }
    }

    private getAspectRatio(): number {
        return this.container.clientWidth / this.container.clientHeight;
    }

    private startRenderingLoop(cars: Car[]): void {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

        this.lastDate = Date.now();
        this.container.appendChild(this.renderer.domElement);
        this.render(cars);
    }

    private render(cars: Car[]): void {
        requestAnimationFrame(() => this.render(cars));
        this.update(cars);
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
    }

    public onResize(): void {
        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    public handleKeyDown(event: KeyboardEvent, index: number, cars: Car[]): void {
       this.evenHandeler.handleKeyDown(event, cars[index]);
    }

    public handleKeyUp(event: KeyboardEvent, index: number, cars: Car[]): void {
       this.evenHandeler.handleKeyUp(event, cars[index]);
    }

    public drawTrack(points: THREE.Vector3[], car: Car): void {
/* tslint:disable:no-magic-numbers */
        for (let i: number = 1; i < points.length; i++) {
          const point1: THREE.Vector3 = points[i - 1];
          const point2: THREE.Vector3 = points[i];
          const sphere: THREE.SphereGeometry = new THREE.SphereGeometry(6, 10, 10);
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
        }
      }
}
