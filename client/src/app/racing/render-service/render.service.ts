import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import { PerspectiveCamera, WebGLRenderer, Scene, AmbientLight, Vector3 } from "three";
import { Car } from "../car/car";
import { EventHandlerRenderService } from "./event-handler-render.service";

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;

const INITIAL_CAMERA_POSITION_Y: number = 25;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;

@Injectable()
export class RenderService {
    private camera: PerspectiveCamera;
    private container: HTMLDivElement;
    private _car: Car;
    private renderer: WebGLRenderer;
    private scene: THREE.Scene;
    private stats: Stats;
    private lastDate: number;
    private evenHandeler: EventHandlerRenderService;

    public get car(): Car {
        return this._car;
    }

    public constructor() {
        this._car = new Car();
        this._car.rotateX(Math.PI / 2);
        this.evenHandeler = new EventHandlerRenderService(this._car);
    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        if (container) {
            this.container = container;
        }

        await this.createScene();
        this.initStats();
        this.startRenderingLoop();
    }

    private initStats(): void {
        this.stats = new Stats();
        this.stats.dom.style.position = "absolute";
        this.container.appendChild(this.stats.dom);
    }

    private update(): void {
        // const relativeCameraOffset: Vector3 = new Vector3(0, 25, 0);

        // const cameraOffset: Vector3 = relativeCameraOffset.applyMatrix4(this._car.matrixWorld);

        //this.camera.position.x = this._car.position.x;
        //this.camera.position.y = this._car.position.y;
        //this.camera.position.z = this.car.position.z;
        //this.camera.updateMatrix();
        //this.camera.updateProjectionMatrix();
        
        const timeSinceLastFrame: number = Date.now() - this.lastDate;
        this._car.update(timeSinceLastFrame);
        this.lastDate = Date.now();

        this.camera.position.copy(this._car.position);
        this.camera.lookAt(this._car.position);

    }

    private async createScene(): Promise<void> {
        this.scene = new Scene();

        this.camera = new PerspectiveCamera(
            FIELD_OF_VIEW,
            this.getAspectRatio(),
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );

        await this._car.init();
        this.camera.position.set(0, 0, INITIAL_CAMERA_POSITION_Y);
        //
        this.camera.lookAt(this.scene.position);
        this.scene.add(this._car);
        this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
    }

    private getAspectRatio(): number {
        return this.container.clientWidth / this.container.clientHeight;
    }

    private startRenderingLoop(): void {
        this.renderer = new WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

        this.lastDate = Date.now();
        this.container.appendChild(this.renderer.domElement);
        this.render();
    }

    private render(): void {
        requestAnimationFrame(() => this.render());
        this.update();
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
    }

    public onResize(): void {
        this.camera.aspect = this.getAspectRatio();
        //this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    public handleKeyDown(event: KeyboardEvent): void {
        this.evenHandeler.handleKeyDown(event, this.car);
    }

    public handleKeyUp(event: KeyboardEvent): void {
        this.evenHandeler.handleKeyUp(event, this.car);
    }
}
