import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import * as THREE from "three";
import { Car } from "../car/car";
import { EventHandlerRenderService } from "./event-handler-render.service";
import { CarsPositionsHandler } from "../cars-positions-handler/cars-positions-handler";
import { PositionsDefinerService } from "../PositionsDefiner.service/position-definer.service";
import { OrthographicCamera } from "../camera/topView-camera";
import { PerspectiveCamera } from "../camera/rearView-camera";
import { TrackDisplay } from "./../trackDisplay/track-display";
import { Router } from "@angular/router";
<<<<<<< HEAD
const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;
const INITIAL_CAMERA_POSITION_Z: number = 50;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;
const CARS_MAX: number = 4;
const LAP_MAX: number = 3;
=======
import { WallsCollisionsService } from "../walls-collisions-service/walls-collisions-service";
import { RaceUtils } from "./../utils/utils";
import { MS_TO_SECONDS, CARS_MAX } from "../constants";
import { CommunicationRacingService } from "../communication.service/communicationRacing.service";
import { HttpClient } from "@angular/common/http";
import { Track } from "../track";
import { RaceValidatorService } from "../race-validator/race-validator.service";
const EXPONENT: number = 2;

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;

const INITIAL_CAMERA_POSITION_Z: number = 70;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 2;

>>>>>>> master
@Injectable()
export class RenderService {
    private cameras: [THREE.PerspectiveCamera, OrthographicCamera] = [null, null];
    // private camera: THREE.PerspectiveCamera;
    private container: HTMLDivElement;
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private stats: Stats;
    private lastDate: number;
    private evenHandeler: EventHandlerRenderService;
<<<<<<< HEAD
    private cars: Car[];
    private updatedCarPosition: THREE.Vector3;
    private raceIsFinished: boolean;
    private counter: number;
    private trackMeshs: THREE.Mesh[];
    private validIndex: number;
    public constructor(private router: Router) {
        this.cars = new Array<Car>(CARS_MAX);
        this.cars[0] = new Car();
        this.updatedCarPosition = new THREE.Vector3();
        this.raceIsFinished = false;
        this.counter = 0;
        this.trackMeshs = new Array<THREE.Mesh>();
        this.validIndex = 0;
        this.cameras[0] = new PerspectiveCamera();
        this.cameras[1] = new OrthographicCamera();
=======
    private timer: number;
    private raceValidator: RaceValidatorService;

    public constructor(private router: Router, private http: HttpClient) {
        this.raceValidator = new RaceValidatorService(router, http);
        this.timer = 0;
>>>>>>> master
    }
    public getScene(): THREE.Scene {
        return this.scene;
    }
<<<<<<< HEAD
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
        this.cameras[1].setStartPosition(new THREE.Vector3(0, 0, INITIAL_CAMERA_POSITION_Z), this.updatedCarPosition);
        //this.cameras[0].setStartPosition(new THREE.Vector3(0, 0, INITIAL_CAMERA_POSITION_Z), this.updatedCarPosition);
=======

    public async initialize(container: HTMLDivElement, track: Track): Promise<void> {
        if (container) {
            this.container = container;
        }
        this.raceValidator.track = track;
        this.raceValidator.track.newScores = new Array<number>();
>>>>>>> master
        await this.createScene();
        CarsPositionsHandler.insertCars(this.raceValidator.track.startingZone, this.scene, this.raceValidator.cars);
        this.initStats();
        this.startRenderingLoop();
    }
    public initializeEventHandlerService(): void {
        this.evenHandeler = new EventHandlerRenderService(this.raceValidator.cars[0]);
    }
    private initStats(): void {
        this.stats = new Stats();
        this.stats.dom.style.position = "absolute";
        this.container.appendChild(this.stats.dom);
    }
<<<<<<< HEAD
    private async update(cars: Car[]): Promise<void> {
=======

    private async update(): Promise<void> {
>>>>>>> master
        const timeSinceLastFrame: number = Date.now() - this.lastDate;
        this.timer += timeSinceLastFrame;
        for (let i: number = 0; i < CARS_MAX; i++) {
<<<<<<< HEAD
            cars[i].update(timeSinceLastFrame);
        }
        await this.setUpdateCarPosition();
        this.validateLap(this.validIndex);
        this.lastDate = Date.now();
        /*Pour camera TOP*/
        this.cameras[1].updatePosition(this.updatedCarPosition);
        // this.cameras[0].updatePosition(this.updatedCarPosition);
=======

            this.raceValidator.cars[i].update(timeSinceLastFrame);
            this.raceValidator.validateLap(this.raceValidator.validIndex[i], i, this.timer);
        }
        this.lastDate = Date.now();
>>>>>>> master
    }
    private async createScene(): Promise<void> {
        this.scene = new THREE.Scene();
<<<<<<< HEAD
=======

        this.camera = new THREE.PerspectiveCamera(
            FIELD_OF_VIEW,
            this.getAspectRatio(),
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );

        this.camera.position.set(0, 0, INITIAL_CAMERA_POSITION_Z);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        const trackMeshs: THREE.Mesh[] = TrackDisplay.drawTrack(this.raceValidator.track.points);
        for (const mesh of trackMeshs) {
            this.scene.add(mesh);
        }

        const collisionService: WallsCollisionsService = new WallsCollisionsService();
        collisionService.createWalls(this.raceValidator.track.points, this.scene);

>>>>>>> master
        for (let i: number = 0; i < CARS_MAX; i++) {
            this.raceValidator.cars[i] = new Car(collisionService);
            await this.raceValidator.cars[i].init();
            this.scene.add(this.raceValidator.cars[i]);
        }
        this.raceValidator.track.points.splice(0, 0, trackMeshs[trackMeshs.length - 1].position);
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
<<<<<<< HEAD
        this.update(this.cars);
        this.renderer.render(this.scene, this.cameras[1]);
=======
        this.update();
        this.renderer.render(this.scene, this.camera);
>>>>>>> master
        this.stats.update();
    }
    public onResize(): void {
        /*this.cameras[0].aspect = this.getAspectRatio();
        this.cameras[0].updateProjectionMatrix();*/
        this.cameras[1].left = this.cameras[1].bottom * (this.getAspectRatio());
        this.cameras[1].right = this.cameras[1].top * (this.getAspectRatio());
        this.cameras[1].updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
<<<<<<< HEAD
    public async validateLap(index: number): Promise<boolean> {
        await this.setUpdateCarPosition();
        let isPartlyValid: Promise<boolean>;
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
            // console.log(this.raceIsFinished );
            this.router.navigateByUrl("/gameResults");
        }
        // console.log(this.counter);
        return isPartlyValid;
    }
=======

>>>>>>> master
}




