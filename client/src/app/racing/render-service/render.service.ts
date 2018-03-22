import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import * as THREE from "three";
import { Car } from "../car/car";
import { EventHandlerRenderService } from "./event-handler-render.service";
import { CarsPositionsHandler } from "../cars-positions-handler/cars-positions-handler";
import { PositionsDefinerService } from "../PositionsDefiner.service/position-definer.service";

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;

const INITIAL_CAMERA_POSITION_Z: number = 100;
const WHITE: number = 0xFFFFFF;
const GRAY: number = 0x7B8284;
const RED: number = 0xFF0000;
const AMBIENT_LIGHT_OPACITY: number = 0.5;
const CARS_MAX: number = 4;
const WIDTH_SPHERE: number = 8;
const WIDTH_PLANE: number = 16;
const WIDTH_START: number = 4;
const WIDTH_POINT: number = 0.5;

@Injectable()
export class RenderService {
    private camera: THREE.PerspectiveCamera;
    private container: HTMLDivElement;
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private stats: Stats;
    private lastDate: number;
    private evenHandeler: EventHandlerRenderService;
    private cars: Car[];
    private updatedCarPosition: THREE.Vector3;

    public constructor() {
        this.cars = new Array<Car>(CARS_MAX);
        this.cars[0] = new Car();
        this.updatedCarPosition = new THREE.Vector3();
    }
    public getScene(): THREE.Scene {
        return this.scene;
    }
    public getUpdateCarPosition(): THREE.Vector3 {
        return this.updatedCarPosition;
    }

    public async initialize(container: HTMLDivElement, line: THREE.Line3): Promise<void> {
        if (container) {
            this.container = container;
        }
        await this.createScene();
        CarsPositionsHandler.insertCars(line, this.scene, this.cars);
        this.initStats();
        this.startRenderingLoop();

    }

    public initializeEventHandlerService(): void {
        this.evenHandeler = new EventHandlerRenderService(this.cars[0]);
    }

    private initStats(): void {
        this.stats = new Stats();
        this.stats.dom.style.position = "absolute";
        this.container.appendChild(this.stats.dom);
    }

    private update(cars: Car[]): void {
        const timeSinceLastFrame: number = Date.now() - this.lastDate;
        for (let i: number = 0; i < CARS_MAX; i++) {

                cars[i].update(timeSinceLastFrame);
        }
        this.lastDate = Date.now();

    }

    private async createScene(): Promise<void> {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            FIELD_OF_VIEW,
            this.getAspectRatio(),
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );

        this.camera.position.set(0, 0, INITIAL_CAMERA_POSITION_Z);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        for (let i: number = 0; i < CARS_MAX; i++) {
            this.cars[i] = new Car();
            await this.cars[i].init();
            this.scene.add(this.cars[i]);
            this.scene.add(new THREE.AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
        }
    }

    private getAspectRatio(): number {
        return this.container.clientWidth / this.container.clientHeight;
    }

    private startRenderingLoop(): void {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

        this.lastDate = Date.now();
        this.container.appendChild(this.renderer.domElement);
        this.render();
        console.warn(this.updatedCarPosition);

    }

    private render(): void {
        requestAnimationFrame(() => this.render());
        this.update(this.cars);
        this.updatedCarPosition = this.cars[0].getUpdatedPosition();
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
        console.warn(this.updatedCarPosition);
    }

    public onResize(): void {
        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    private setPointMeshPosition(point: THREE.Vector3, circle: THREE.CircleGeometry): THREE.Mesh {
        const pointMesh: THREE.Mesh = new THREE.Mesh(circle, new THREE.MeshBasicMaterial({ color: GRAY }));
        pointMesh.position.copy(point);

        return pointMesh;
    }

    private setPlaneMesh(vector: THREE.Vector3, point: THREE.Vector3, scaleX: number, color: number): THREE.Mesh {
        const floor: THREE.Mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 0), new THREE.MeshBasicMaterial({ color: color }));
        floor.position.copy(point);
        floor.scale.x = scaleX;
        floor.scale.y = WIDTH_PLANE;
        floor.rotateZ(Math.atan2(vector.y, vector.x));

        return floor;
    }

    private SetPointFromMatrix(point: THREE.Vector3): THREE.Vector3 {

        return new THREE.Vector3().applyMatrix4(new THREE.Matrix4().makeTranslation(point.x, point.y, 0));
    }

    public drawTrack(points: THREE.Vector3[]): void {
        for (let i: number = 1; i < points.length; i++) {
            this.scene.add(this.setPointMeshPosition(this.SetPointFromMatrix(points[i]), new THREE.CircleGeometry(WIDTH_SPHERE)));

            const vector: THREE.Vector3 =
                new THREE.Vector3().copy(this.SetPointFromMatrix(points[i])).sub(this.SetPointFromMatrix(points[i - 1]));
            const point: THREE.Vector3 =
                new THREE.Vector3().copy(vector).multiplyScalar(WIDTH_POINT).add(this.SetPointFromMatrix(points[i - 1]));

            this.scene.add(this.setPlaneMesh(vector, point, vector.length(), GRAY));

            if (i === 1) {
                const floor: THREE.Mesh = this.setPlaneMesh(vector, point, WIDTH_START, RED);
                floor.translateX(-WIDTH_START);
                this.scene.add(floor);
            }

        }
    }
}
