import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import * as THREE from "three";
import { Car } from "../car/car";
import { EventHandlerRenderService } from "./event-handler-render.service";
import { CarsPositionsHandler } from "../cars-positions-handler/cars-positions-handler";
import { TrackDisplay } from "./../trackDisplay/track-display";
import {RaceValidator} from "./../raceValidator/race-validator";

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;

const INITIAL_CAMERA_POSITION_Z: number = 100;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;
const CARS_MAX: number = 4;
const LAP_MAX: number = 1;

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
    private raceIsFinished: boolean;
    private counter: number;
    private trackMeshs: THREE.Mesh[];
    private validIndex: number;

    public constructor() {
        this.cars = new Array<Car>(CARS_MAX);
        this.cars[0] = new Car();
        this.updatedCarPosition = new THREE.Vector3();
        this.raceIsFinished = false;
        this.counter = 0;
        this.trackMeshs = new Array<THREE.Mesh>();
        this.validIndex = 0;
    }
    public getScene(): THREE.Scene {
        return this.scene;
    }
    public getUpdateCarPosition(): THREE.Vector3 {
        return this.updatedCarPosition;
    }
    public setUpdateCarPosition(): void {
        this.updatedCarPosition = this.cars[0].getUpdatedPosition();
    }

    public async initialize(container: HTMLDivElement, line: THREE.Line3, points: THREE.Vector3[]): Promise<void> {
        if (container) {
            this.container = container;
        }
        await this.createScene();
        CarsPositionsHandler.insertCars(line, this.scene, this.cars);
        this.initStats();
        this.startRenderingLoop();
        this.trackMeshs = TrackDisplay.drawTrack(points);
        for (const mesh of this.trackMeshs) {
            this.scene.add(mesh);
        }
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

        this.setUpdateCarPosition();
        this.validateLap(this.validIndex);
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

    }

    private render(): void {
        requestAnimationFrame(() => this.render());
        this.update(this.cars);
        this.renderer.render(this.scene, this.camera);
        this.stats.update();

    }

    public onResize(): void {
        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    public async validateLap(index: number): Promise<boolean > {
        await this.setUpdateCarPosition();
        let isPartlyValid: Promise<boolean> ;
        const positions: THREE.Vector3[] = RaceValidator.getLapPositionVerifiers(this.trackMeshs);
        const isvalidated: boolean = RaceValidator.validateLapSection(this.updatedCarPosition, positions[index]);
        if (isvalidated) {
           this.validIndex += 1;
           if (this.validIndex === positions.length) {
               this.validIndex = 0;
               this.counter += 1;
               if (this.counter === LAP_MAX) {
                   this.raceIsFinished = true;
               }
           }
           isPartlyValid = this.validateLap(this.validIndex);
           }
        if (this.raceIsFinished) {
            console.log(this.raceIsFinished );
        }
        // console.log(this.counter);

        return isPartlyValid;
    }

}
