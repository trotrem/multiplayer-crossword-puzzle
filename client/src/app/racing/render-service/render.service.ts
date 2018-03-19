import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import { PerspectiveCamera, WebGLRenderer, Scene, AmbientLight, Line, Vector3 } from "three";
import { Car } from "../car/car";
import { EventHandlerRenderService } from "./event-handler-render.service";
import { PrintCarsService } from "../printCar.service/print-cars.service";

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;

const INITIAL_CAMERA_POSITION_Y: number = 100;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;
const CARS_MAX: number = 4;

@Injectable()
export class RenderService {
    private camera: PerspectiveCamera;
    private container: HTMLDivElement;
    private renderer: WebGLRenderer;
    private scene: THREE.Scene;
    private stats: Stats;
    private lastDate: number;
    private evenHandeler: EventHandlerRenderService;
    private printCarService: PrintCarsService;

    public constructor() {
        this.evenHandeler = new EventHandlerRenderService();
        this.printCarService = new PrintCarsService();
    }
    public getSene(): THREE.Scene {
        return this.scene;
    }

    public async initialize(container: HTMLDivElement, line: THREE.Line3, cars: Car[]): Promise<void>  {
        if (container) {
            this.container = container;
        }

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
        this.lastDate = Date.now();
    }

    private async createScene(cars: Car[]): Promise<void> {
        this.scene = new Scene();

        // this.camera = new PerspectiveCamera(
        //     FIELD_OF_VIEW,
        //     this.getAspectRatio(),
        //     NEAR_CLIPPING_PLANE,
        //     FAR_CLIPPING_PLANE
        // );
        this.camera = new PerspectiveCamera();

        this.camera.position.set(0, INITIAL_CAMERA_POSITION_Y, 0);
        this.camera.lookAt(new Vector3(0, 0, 0));

        for (let i: number = 0; i < CARS_MAX; i++) {
            cars[i] = new Car();
            await cars[i].init();
            // this.camera.lookAt(cars[i].position);
            this.scene.add(cars[i]);
            this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
            }
    }

    private getAspectRatio(): number {
        return this.container.clientWidth / this.container.clientHeight;
    }

    private startRenderingLoop(cars: Car[]): void {
        this.renderer = new WebGLRenderer();
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
}
