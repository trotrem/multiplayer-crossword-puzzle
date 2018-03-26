import { Injectable, HostListener } from "@angular/core";
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
import { WallsCollisionsService, ILine } from "../walls-collisions-service/walls-collisions-service";
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

@Injectable()
export class RenderService {
    private Axis_Helper = new THREE.AxisHelper(6);
    private cameras: [PerspectiveCamera, OrthographicCamera] = [null, null];
    private container: HTMLDivElement;
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private stats: Stats;
    private lastDate: number;
    private evenHandeler: EventHandlerRenderService;
    private timer: number;
    private raceValidator: RaceValidatorService;
    private cameraID: number;

    public constructor(private router: Router, private http: HttpClient) {
        this.raceValidator = new RaceValidatorService(router, http);
        this.timer = 0;
        this.cameraID = 0;
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
        this.scene.add(this.Axis_Helper);
        // this.cameras[1].setStartPosition(new THREE.Vector3(0, 0, INITIAL_CAMERA_POSITION_Z), this.raceValidator.cars[0].position);
        this.cameras[0].up.set(0, 0, 1);
    }
    public initializeEventHandlerService(): void {
        this.evenHandeler = new EventHandlerRenderService(this.raceValidator.cars[0], this);
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
            this.raceValidator.validateRace(this.raceValidator.validIndex[i], i, this.timer);
        }
        this.lastDate = Date.now();
        if (this.cameraID === 0) {
            this.cameras[0].updatePosition(this.raceValidator.cars[0]);
        } else {
            this.cameras[1].updatePosition(this.raceValidator.cars[0].getUpdatedPosition());
        }
    }
    private async createScene(): Promise<void> {
        this.scene = new THREE.Scene();
        this.cameras[0] = new PerspectiveCamera();
        this.cameras[1] = new OrthographicCamera();
        const trackMeshs: THREE.Mesh[] = TrackDisplay.drawTrack(this.raceValidator.track.points);
        for (const mesh of trackMeshs) {
            this.scene.add(mesh);
        }
        const collisionService: WallsCollisionsService = new WallsCollisionsService();
        this.showWalls(collisionService.createWalls(this.raceValidator.track.points));

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
        this.renderer.render(this.scene, this.cameras[this.cameraID]);
        this.stats.update();
    }
    public onResize(): void {
        if (this.cameraID === 0) {
            this.cameras[0].aspect = this.getAspectRatio();
            this.cameras[0].updateProjectionMatrix();
        } else {
            this.cameras[1].left = this.cameras[1].bottom * (this.getAspectRatio());
            this.cameras[1].right = this.cameras[1].top * (this.getAspectRatio());
            this.cameras[1].updateProjectionMatrix();
        }
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    }

    public toggleCamera(): void {
        if (this.cameraID === 1) {
            this.cameraID = 0;
        } else {
            this.cameraID = 1;
        }
    }

    private showWalls(walls: ILine[]): void {
        for (const line of walls) {
            const geo: THREE.Geometry = new THREE.Geometry();
            geo.vertices.push(line.pos1);
            geo.vertices.push(line.pos2);
            this.scene.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ visible: false })));
        }
    }
}
