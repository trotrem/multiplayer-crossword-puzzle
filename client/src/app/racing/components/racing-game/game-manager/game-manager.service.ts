import { Injectable } from "@angular/core";
import { RenderGameService } from "../render-game-service/render-game.service";
import { RacingCommunicationService } from "../../../communication.service/communicationRacing.service";
import * as THREE from "three";
import { ElementRef } from "@angular/core/src/linker/element_ref";
import { ITrack } from "../../../track";
import { INewScores } from "./../../../../../../../common/communication/types-racing";
import { RaceValidator } from "../race-validator/racevalidator";
import { Router } from "@angular/router";
import { CARS_MAX, MS_TO_SECONDS, LAP_MAX } from "../../../../constants";
import { WallsCollisionsService } from "../walls-collisions-service/walls-collisions-service";
import { Car } from "../car/car";
import { CarsCollisionService } from "../car/cars-collision/cars-collision.service";
import { AiController } from "./../ai-controller/ai-controller";
import { KeyboardEventService } from "../commands/keyboard-event.service";

const AI_PLAYERS_MAX: number = 3;
const RESULTS: string = "/gameResults/";

@Injectable()
export class GameManagerService {

    private timer: number;
    private lastDate: number;
    private _cars: Car[] = [];
    private track: ITrack;
    private _aiControllers: AiController[];
    private gameStarted: boolean = false;

    public constructor(
        private renderService: RenderGameService,
        private communicationService: RacingCommunicationService,
        private collisionService: WallsCollisionsService,
        private carsCollisionService: CarsCollisionService,
        private router: Router) {
        this.timer = 0;
        this._aiControllers = new Array<AiController>();
    }

    public async initializeGame(trackName: string, canvas: ElementRef, keyboard: KeyboardEventService): Promise<void> {
        this._cars = new Array<Car>();
        this.lastDate = Date.now();
        this.track = await this.getTrack(trackName);
        this.track.INewScores = new Array<INewScores>();
        void this.initializeCars(keyboard).then(() => {
            this.renderService.initialize(
                canvas.nativeElement, this.track.points, this.track.startingZone,
                this._cars, keyboard);
            this.update();
        });
    }

    public startRace(): void {
        this._cars[0].initCommands();
        this.initializeControllers();
        this.carsCollisionService.initializeCars(this._cars);
        this.gameStarted = true;
    }

    public onResize(): void {
        this.renderService.onResize();
    }
    private async initializeCars(keyboard: KeyboardEventService): Promise<void> {
        for (let i: number = 0; i < CARS_MAX; i++) {
            this._cars[i] = new Car(this.collisionService, keyboard);
            await this._cars[i].init().then(() => { });
        }
    }

    private initializeControllers(): void {
        for (let i: number = 1; i < AI_PLAYERS_MAX + 1; i++) {
            this._aiControllers.push(new AiController(this._cars[i], this.track.points, this.collisionService));
        }
    }

    private async getTrack(name: string): Promise<ITrack> {
        return this.communicationService.getTrackByName(name)
            .then(async (res: ITrack[]): Promise<ITrack> => {
                const track: ITrack = res[0];
                const points: THREE.Vector3[] = [];
                for (const point of track.points) {
                    points.push(new THREE.Vector3(point.x, point.y, point.z));
                }
                track.points = points;

                return track;
            });

    }

    private update(): void {
        requestAnimationFrame(() => this.update());
        this.updateCars(this.updateDeltaTime());
        if (this.gameStarted) {
            this.updateRaceProgressionStatus();
            this.updateAI();

        }
        this.carsCollisionService.checkCarsCollisions();
        this.renderService.render(this._cars[0]);

    }

    private updateDeltaTime(): number {
        const timeSinceLastFrame: number = Date.now() - this.lastDate;
        this.timer += timeSinceLastFrame;
        this.lastDate = Date.now();

        return timeSinceLastFrame;
    }
    private updateRaceProgressionStatus(): void {
        RaceValidator.validateRace(this._cars[0], this.timer, this.track.points);
        if (this._cars[0].getLapTimes().length === LAP_MAX) {
            this.updateScores();
        }
    }

    private updateCars(timeSinceLastFrame: number): void {
        for (let i: number = 0; i < CARS_MAX; i++) {
            this._cars[i].update(timeSinceLastFrame);
        }
    }

    private updateAI(): void {
        for (let i: number = 0; i < AI_PLAYERS_MAX; i++) {
            if (this._aiControllers[i].update()) {
                this.updateLapTimeAI(i + 1);
            }
        }
    }

    private updateLapTimeAI(carIndex: number): void {
        this._cars[carIndex].setLapTimes(this.timer / MS_TO_SECONDS);
        if (this._cars[carIndex].getLapTimes().length === LAP_MAX) {
            RaceValidator.addScoreToTrack(this._cars[carIndex], this.track.INewScores, carIndex);
        }
    }

    private updateScores(): void {
        this.gameStarted = false;
        RaceValidator.addScoreToTrack(this._cars[0], this.track.INewScores, 0);
        for (let i: number = 1; i < CARS_MAX; i++) {
            if (this._cars[i].getLapTimes().length < LAP_MAX) {
                RaceValidator.estimateTime(this.timer / MS_TO_SECONDS, this._cars[i], this.track.points);
                RaceValidator.addScoreToTrack(this._cars[i], this.track.INewScores, i);
            }
        }
        this.track.usesNumber++;
        this.communicationService.updateScores(this.track);
        this.navigateToGameResults();
    }

    private navigateToGameResults(): void {
        this.router.navigateByUrl(RESULTS + this.track.name);
    }
}
