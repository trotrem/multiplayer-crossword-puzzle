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
import { RaceUtils } from "./../utils/utils";
import { MS_TO_SECONDS } from "../constants";
import { CommunicationRacingService } from "../communication.service/communicationRacing.service";
import { HttpClient } from "@angular/common/http";
import { Track } from "../track";
const EXPONENT: number = 2;

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;

const INITIAL_CAMERA_POSITION_Z: number = 70;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 2;
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
    private updatedCarsPositions: THREE.Vector3[];
    private raceIsFinished: boolean;
    private counter: number[];
    private validIndex: number[];
    private timer: number;
    private communicationService: CommunicationRacingService;
    private track: Track;

    public constructor(private router: Router, private http: HttpClient) {
        this.cars = new Array<Car>(CARS_MAX);
        this.communicationService = new CommunicationRacingService(http);
        this.updatedCarsPositions = new Array<THREE.Vector3>();
        this.raceIsFinished = false;
        this.counter = new Array<number>();
        this.validIndex = new Array<number>();
        this.timer = 0;

        for (let i: number = 0; i < CARS_MAX; i++) {
            this.validIndex.push(0);
            this.counter.push(0);
        }
    }
    public getRaceIsFinished(): boolean {
        return this.raceIsFinished;
    }
    public setRaceIsFinished(bool: boolean): void {
        this.raceIsFinished = bool;
    }
    public getCounter(): number[] {
        return this.counter;
    }
    public setCounter(nbre: number[]): void {
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

    public async initialize(container: HTMLDivElement, track: Track): Promise<void> {
        if (container) {
            this.container = container;
        }
        this.track = track;
        this.track.newScores = new Array<number>();
        await this.createScene();
        CarsPositionsHandler.insertCars(this.track.startingZone, this.scene, this.cars);
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
            // this.setUpdateCarPosition(i);
            this.validateLap(this.validIndex[i], i);
        }
        this.lastDate = Date.now();
        this.timer += timeSinceLastFrame;

        /* var geo = new THREE.Geometry();
         geo.vertices.push(this.cars[0].getUpdatedPosition());
         var wallMaterial = new THREE.PointsMaterial({ color: 0xff0000 });
         var wall = new THREE.Points(geo, wallMaterial);
         this.scene.add(wall);*/

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

        const trackMeshs: THREE.Mesh[] = TrackDisplay.drawTrack(this.track.points);
        for (const mesh of trackMeshs) {
            this.scene.add(mesh);
        }

        const collisionService: WallsCollisionsService = new WallsCollisionsService(this.scene);
        collisionService.createWalls(this.track.points, this.scene);

        for (let i: number = 0; i < CARS_MAX; i++) {
            this.cars[i] = new Car(collisionService);
            await this.cars[i].init();
            this.scene.add(this.cars[i]);
        }
        this.track.points.splice(0, 0, trackMeshs[trackMeshs.length - 1].position);
        console.log(trackMeshs[trackMeshs.length - 1].position);
        // this.track.points.push(trackMeshs[trackMeshs.length - 1].position);
        console.log(this.track.points);
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
        await this.setUpdateCarPosition(carIndex);
        let isPartlyValid: Promise<boolean>;
        // const positions: THREE.Vector3[] = LapPositionsVerfiers.getLapPositionVerifiers(this.track.points);
        const isvalidated: boolean =
            LapPositionsVerfiers.getLapSectionvalidator(
                this.updatedCarsPositions[carIndex], this.track.points[this.track.points.length - index - 1]);
        if (isvalidated) {
            this.validIndex[carIndex] += 1;
            console.log(this.cars[carIndex].speed.length());
            if (this.validIndex[carIndex] === this.track.points.length) {
                this.cars[carIndex].setLabTimes(this.timer / MS_TO_SECONDS);
                this.validIndex[carIndex] = 0;
                this.counter[carIndex] += 1;
                if (this.counter[carIndex] === LAP_MAX) {
                    this.addScoreToTrack(carIndex);
                    if (carIndex === 0) {
                        this.raceIsFinished = true;
                        this.estimateTime(this.timer / MS_TO_SECONDS);
                        await this.communicationService.updateNewScore(this.track);
                        this.navigateToGameResults();
                    }
                }
            }
            isPartlyValid = this.validateLap(this.validIndex[carIndex], carIndex);
        }
        /*if (this.raceIsFinished) {
            console.log(this.raceIsFinished);
            // this.router.navigateByUrl("/gameResults");
        }
        // console.log(this.counter);*/

        return isPartlyValid;
    }

    private navigateToGameResults(): void {
        this.router.navigateByUrl("/gameResults/" + this.track.name);
    }

    private addScoreToTrack(carIndex: number): void {
        this.track.newScores.push(carIndex);
        for (const time of this.cars[carIndex].getLabTimes()) {
            this.track.newScores.push(time);
        }
    }

    private estimateTime(time: number): void {
        for (let i: number = 0; i < this.cars.length; i++) {
            if (i > 0) {
                this.cars[i].speed = new THREE.Vector3(12, 6, 0);
            }
            if (this.counter[i] < LAP_MAX) {
                let distance: number =
                    RaceUtils.calculateDistance(this.getUpdateCarPosition()[i], this.track.points[this.validIndex[i] + 1]);
                for (let j: number = this.validIndex[i] + 1; j > 0; j--) {
                    distance += RaceUtils.calculateDistance(this.track.points[j], this.track.points[j + 1]);
                }
                while (this.cars[i].getLabTimes().length !== LAP_MAX) {
                    this.cars[i].getLabTimes().push((distance / this.cars[i].speed.length()) + time);
                }
                this.addScoreToTrack(i);
            }

        }
    }

}
