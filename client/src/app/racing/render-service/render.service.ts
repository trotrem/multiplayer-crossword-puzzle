import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import * as THREE from "three";
import { Car } from "../car/car";
import { EventHandlerRenderService } from "./event-handler-render.service";
import { CarsPositionsHandler } from "../cars-positions-handler/cars-positions-handler";
import { TrackDisplay } from "./../trackDisplay/track-display";
import { LapPositionsVerfiers } from "./../LapPositionsVerfiers/lap-positions-verifiers";
import { Router } from "@angular/router";
import { WallsCollisionsService } from "../walls-collisions-service/walls-collisions-service";

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;

const INITIAL_CAMERA_POSITION_Z: number = 70;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 2;
const CARS_MAX: number = 4;
const LAP_MAX: number = 3;

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
    private updatedCarsPositions: THREE.Vector3[];
    private raceIsFinished: boolean;
    private counter: number;
    private trackMeshs: THREE.Mesh[];
    private validIndex: number;
    private timer: number;

    public constructor(private router: Router) {
        this.cars = new Array<Car>(CARS_MAX);
        this.updatedCarsPositions = new Array<THREE.Vector3>();
        this.raceIsFinished = false;
        this.counter = 0;
        this.trackMeshs = new Array<THREE.Mesh>();
        this.validIndex = 0;
        this.timer = 0;
    }
    public getRaceIsFinished(): boolean {
        return this.raceIsFinished;
    }
    public setRaceIsFinished(bool: boolean): void {
        this.raceIsFinished = bool;
    }
    public getCounter(): number {
        return this.counter;
    }
    public setCounter(nbre: number): void {
        this.counter = nbre;
    }

    public getCars(): Car[] {
        return this.cars;
    }
    public getScene(): THREE.Scene {
        return this.scene;
    }
    public getUpdateCarPosition(): THREE.Vector3[] {
        return this.updatedCarsPositions;
    }
    public setUpdateCarPosition(index: number): void {
        this.updatedCarsPositions[index] = this.cars[index].getUpdatedPosition();
    }

    public async initialize(container: HTMLDivElement, line: THREE.Line3, points: THREE.Vector3[]): Promise<void> {
        if (container) {
            this.container = container;
        }
        await this.createScene(points);
        CarsPositionsHandler.insertCars(line, this.scene, this.cars);
        this.initStats();
        this.startRenderingLoop();

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
            // this.setUpdateCarPosition(i);
            this.validateLap(this.validIndex, i);
        }
        this.lastDate = Date.now();
        this.timer += timeSinceLastFrame;

       /* var geo = new THREE.Geometry();
        geo.vertices.push(this.cars[0].getUpdatedPosition());

        var wallMaterial = new THREE.PointsMaterial({ color: 0xff0000 });
        var wall = new THREE.Points(geo, wallMaterial);

        this.scene.add(wall);*/

    }

    private async createScene(points: THREE.Vector3[]): Promise<void> {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            FIELD_OF_VIEW,
            this.getAspectRatio(),
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );

        this.camera.position.set(0, 0, INITIAL_CAMERA_POSITION_Z);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.trackMeshs = TrackDisplay.drawTrack(points);

        const collisionService: WallsCollisionsService = new WallsCollisionsService(this.scene);
        collisionService.createWalls(points, this.scene);

        for (let i: number = 0; i < CARS_MAX; i++) {
            this.cars[i] = new Car(collisionService);
            await this.cars[i].init();
            this.scene.add(this.cars[i]);
        }

        this.scene.add(new THREE.AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
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
    public async validateLap(index: number, carIndex: number): Promise<boolean> {
        console.log(this.getUpdateCarPosition()[0]);
        await this.setUpdateCarPosition(carIndex);
        let isPartlyValid: Promise<boolean>;
        const positions: THREE.Vector3[] = LapPositionsVerfiers.getLapPositionVerifiers(this.trackMeshs);
        const isvalidated: boolean = LapPositionsVerfiers.getLapSectionvalidator(this.updatedCarsPositions[carIndex], positions[index]);
        if (isvalidated) {
            this.validIndex += 1;
            console.log(this.validIndex);
            if (this.validIndex === positions.length) {
                console.log("here");
                // console.warn(this.timer);
                this.cars[carIndex].setLabTimes(this.timer);
                // console.warn(this.cars[carIndex].getLabTimes());
                this.validIndex = 0;
                this.counter += 1;
                if (this.counter === LAP_MAX) {
                    this.raceIsFinished = true;
                    this.router.navigateByUrl("/gameResults");
                }
            }
            isPartlyValid = this.validateLap(this.validIndex, carIndex);
        }
        /* if (this.raceIsFinished) {
             // console.log(this.raceIsFinished );
             this.router.navigateByUrl("/gameResults");
         }*/
        // console.log(this.counter);

        return isPartlyValid;
    }

}
