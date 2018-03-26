import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import * as THREE from "three";
import { Car } from "../car/car";
import { EventHandlerRenderService } from "./event-handler-render.service";
import { CarsPositionsHandler } from "../cars-positions-handler/cars-positions-handler";
import { TrackDisplay } from "./../trackDisplay/track-display";
import { Router } from "@angular/router";
import { PerspectiveCamera } from "../camera/rearView-camera";
import { WallsCollisionsService } from "../walls-collisions-service/walls-collisions-service";
import { RaceUtils } from "./../utils/utils";
import { MS_TO_SECONDS, CARS_MAX } from "../constants";
import { CommunicationRacingService } from "../communication.service/communicationRacing.service";
import { HttpClient } from "@angular/common/http";
import { Track } from "../track";
import { RaceValidatorService } from "../race-validator/race-validator.service";
import { AxisHelper } from "three";
const EXPONENT: number = 2;

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;

const INITIAL_CAMERA_POSITION_Z: number = 70;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 2;

@Injectable()
export class RenderService {
    private AXIS_HELPER: THREE.AxisHelper = new THREE.AxisHelper(6);
    private camera: THREE.PerspectiveCamera;
    private container: HTMLDivElement;
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private stats: Stats;
    private lastDate: number;
    private evenHandeler: EventHandlerRenderService;
    private timer: number;
    private raceValidator: RaceValidatorService;

    public constructor(private router: Router, private http: HttpClient) {
        this.raceValidator = new RaceValidatorService(router, http);
        this.timer = 0;
    }
    public getScene(): THREE.Scene {
        return this.scene;
    }

    public async initialize(container: HTMLDivElement, track: Track): Promise<void> {
        if (container) {
            this.container = container;
        }
        this.raceValidator.track = track;
        this.raceValidator.track.newScores = new Array<number>();
        await this.createScene();
        CarsPositionsHandler.insertCars(this.raceValidator.track.startingZone, this.scene, this.raceValidator.cars);
        this.initStats();
        this.startRenderingLoop();
        this.scene.add(this.AXIS_HELPER);
        this.camera.up.set(0, 0, 1);
    }

    public initializeEventHandlerService(): void {
        this.evenHandeler = new EventHandlerRenderService(this.raceValidator.cars[0]);
    }

    private initStats(): void {
        this.stats = new Stats();
        this.stats.dom.style.position = "absolute";
        this.container.appendChild(this.stats.dom);
    }

    private async update(): Promise<void> {
        const timeSinceLastFrame: number = Date.now() - this.lastDate;
        this.timer += timeSinceLastFrame;
        for (let i: number = 0; i < CARS_MAX; i++) {

            this.raceValidator.cars[i].update(timeSinceLastFrame);
            this.raceValidator.validateLap(this.raceValidator.validIndex[i], i, this.timer);
        }
        this.lastDate = Date.now();

        /*this.camera.position.y =
            this.raceValidator.cars[0].getUpdatedPosition().y +
            Math.cos(this.raceValidator.cars[0].direction.y / 360 * (2 * Math.PI));
        this.camera.position.x =
            this.raceValidator.cars[0].getUpdatedPosition().x +
            Math.sin(this.raceValidator.cars[0].direction.y / 360 * (2 * Math.PI)) * 50;
        this.camera.position.z = 50;*/
        this.camera.position.x = this.raceValidator.cars[0].getUpdatedPosition().x + 50;
        this.camera.position.y = this.raceValidator.cars[0].getUpdatedPosition().y;
        this.camera.position.z = 50;
        this.camera.lookAt(this.raceValidator.cars[0].getUpdatedPosition());
        //camera.updateMatrix();
        this.camera.updateProjectionMatrix();
    }

    private async createScene(): Promise<void> {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(FIELD_OF_VIEW, this.getAspectRatio(), NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);
        const trackMeshs: THREE.Mesh[] = TrackDisplay.drawTrack(this.raceValidator.track.points);
        for (const mesh of trackMeshs) {
            this.scene.add(mesh);
        }

        const collisionService: WallsCollisionsService = new WallsCollisionsService();
        collisionService.createWalls(this.raceValidator.track.points, this.scene);

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
        this.update();
        this.renderer.render(this.scene, this.camera);
        this.stats.update();

    }

    public onResize(): void {
        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

}
