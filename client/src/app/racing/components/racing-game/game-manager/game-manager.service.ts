import { injectable, inject } from "inversify";
import { RenderService } from "../render-service/render.service";
import { RacingCommunicationService } from "../../../communication.service/communicationRacing.service";
import { Track } from "../../../track";
import * as THREE from "three";
import { ElementRef } from "@angular/core/src/linker/element_ref";
import { RaceValidatorService } from "../race-validator/race-validator.service";
import { CARS_MAX } from "../../../../constants";
import { EventHandlerRenderService } from "../render-service/event-handler-render.service";
import { WallsCollisionsService } from "../walls-collisions-service/walls-collisions-service";
import { Car } from "../car/car";
import { AiController } from "./../ai-controller/ai-controller";

const AI_PLAYERS_MAX: number = 3;

@injectable()
export class GameManagerService {

    private timer: number;
    private lastDate: number;
    private eventHandler: EventHandlerRenderService;
    private _cars: Car[] = [];
    private _aiControllers: AiController[];
    private gameStarted: boolean = false;

    public constructor(
        @inject(RenderService) private renderService: RenderService,
        @inject(RacingCommunicationService) private communicationService: RacingCommunicationService,
        @inject(RaceValidatorService) private raceValidator: RaceValidatorService,
        @inject(WallsCollisionsService) private collisionService: WallsCollisionsService) {
        this.timer = 0;
        this._aiControllers = new Array<AiController>();
    }

    public async initializeGame(trackName: string, container: ElementRef): Promise<void> {
        this.lastDate = Date.now();
        const track: Track = await this.getTrack(trackName, container);

        for (let i: number = 0; i < CARS_MAX; i++) {
            this._cars[i] = new Car(this.collisionService);
            await this._cars[i].init();
        }
        this.raceValidator.initialize(track, this.collisionService, this._cars);
        this.renderService.initialize(
            container.nativeElement, track, this.raceValidator.cars, this.collisionService.createWalls(track.points));
        await this.update();
    }

    public startRace(): void {
        this.initializeControllers();
        this.gameStarted = true;
        for (let i: number = 0; i < AI_PLAYERS_MAX; i++) {
            this._aiControllers[i].isStarted = true;
        }
        this.eventHandler = new EventHandlerRenderService(this.raceValidator.cars[0], this.renderService);
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
                this.raceValidator.cars[i].update(timeSinceLastFrame);
                await this.raceValidator.validateRace(this.raceValidator.validIndex[i], i, this.timer).then(() => { });
            }

            for (let i: number = 0; i < AI_PLAYERS_MAX; i++) {
                this._aiControllers[i].update();
            }
        }
        this.lastDate = Date.now();
        this.renderService.render(this.raceValidator.cars[0]);
    }

    private initializeControllers(): void {
        for (let i: number = 1; i < AI_PLAYERS_MAX + 1; i++) {
            this._aiControllers.push(new AiController(this.raceValidator.cars[i], this.raceValidator.track.points, this.collisionService));
        }
    }
}
