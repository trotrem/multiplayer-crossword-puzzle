import { Injectable } from "@angular/core";
import { RenderService } from "../render-service/render.service";
import { RacingCommunicationService } from "../../../communication.service/communicationRacing.service";
import * as THREE from "three";
import { ElementRef } from "@angular/core/src/linker/element_ref";
import { KeyboardService } from "../commands/keyboard.service";
import { Track } from "../../../track";
import { INewScores } from "./../../../../../../../common/communication/interfaces";
import { RaceValidator } from "../race-validator/racevalidator";
import { Router } from "@angular/router";
import { CARS_MAX, MS_TO_SECONDS, LAP_MAX } from "../../../../constants";
import { WallsCollisionsService } from "../walls-collisions-service/walls-collisions-service";
import { Car } from "../car/car";
import { CarsCollisionService } from "../car/cars-collision/cars-collision.service"
import { AiController } from "./../ai-controller/ai-controller";

const AI_PLAYERS_MAX: number = 3;

@Injectable()
export class GameManagerService {

    private timer: number;
    private lastDate: number;
    private _cars: Car[] = [];
    private track: Track;
    private _aiControllers: AiController[];
    private gameStarted: boolean = false;

    public constructor(
        private renderService: RenderService,
        private communicationService: RacingCommunicationService,
        private collisionService: WallsCollisionsService,
        private keyboard: KeyboardService,
        private carsCollisionService: CarsCollisionService,
        private router: Router) {
        this.timer = 0;
        this._aiControllers = new Array<AiController>();
    }

    public async initializeGame(trackName: string, container: ElementRef): Promise<void> {
        this._cars = new Array<Car>();
        this.lastDate = Date.now();
        this.track = await this.getTrack(trackName, container);
        this.track.INewScores = new Array<INewScores>();
        await this.initializeCars();
        this.renderService.initialize(
            container.nativeElement, this.track, this._cars, this.collisionService.createWalls(this.track.points));
        this.update();

    }

    private async initializeCars(): Promise<void> {
        for (let i: number = 0; i < CARS_MAX; i++) {
            this._cars[i] = new Car(this.collisionService, this.keyboard);
            await this._cars[i].init().then(() => { });
        }
    }

    public startRace(): void {
        this._cars[0].initCommands();
        this.initializeControllers();
        this.gameStarted = true;
    }

    public onResize(): void {
        this.renderService.onResize();
    }

    private async getTrack(name: string, container: ElementRef): Promise<Track> {
        return this.communicationService.getTrackByName(name)
            .then(async (res: Track[]): Promise<Track> => {
                const track: Track = res[0];
                const points: THREE.Vector3[] = [];
                for (const point of track.points) {
                    points.push(new THREE.Vector3(point.x, point.y, point.z));
                }
                track.points = points;

                return track;
            });

    }

    private async update(): Promise<void> {
        requestAnimationFrame(async () => this.update());
        const timeSinceLastFrame: number = Date.now() - this.lastDate;
        this.timer += timeSinceLastFrame;
        if (this.gameStarted) {
            for (let i: number = 0; i < CARS_MAX; i++) {
                this._cars[i].update(timeSinceLastFrame);
            }
            if (RaceValidator.validateRace(this._cars[0], this.timer, this.track).length === LAP_MAX) {
                this.updateScores();
            }
            for (let i: number = 0; i < AI_PLAYERS_MAX; i++) {
                if (this._aiControllers[i].update()) {
                    this.updateLapTimeAI(i + 1);
                }
            }
        } else {
            this._cars[0].update(timeSinceLastFrame);
        }
        this.carsCollisionService.checkCarsCollisions();
        this.renderService.render(this._cars[0]);
        this.lastDate = Date.now();
    }

    private updateLapTimeAI(carIndex: number): void {
        this._cars[carIndex].setLapTimes(this.timer / MS_TO_SECONDS);
        if (this._cars[carIndex].getLabTimes().length === LAP_MAX) {
            RaceValidator.addScoreToTrack(this._cars[carIndex], this.track, carIndex);
        }
    }

    private updateScores(): void {
        RaceValidator.addScoreToTrack(this._cars[0], this.track, 0);
        for (let i: number = 1; i < CARS_MAX; i++) {
            if (this._cars[i].getLabTimes().length < LAP_MAX) {
                RaceValidator.estimateTime(this.timer / MS_TO_SECONDS, this._cars[i], this.track.points);
                RaceValidator.addScoreToTrack(this._cars[i], this.track, i);
            }
        }
        this.track.usesNumber++;
        this.communicationService.updateNewScore(this.track);
        this.navigateToGameResults();
    }

    private navigateToGameResults(): void {
        this.router.navigateByUrl("/gameResults/" + this.track.name);
    }

    private initializeControllers(): void {
        for (let i: number = 1; i < AI_PLAYERS_MAX + 1; i++) {
            this._aiControllers.push(new AiController(this._cars[i], this.track.points, this.collisionService));
        }
    }
}
