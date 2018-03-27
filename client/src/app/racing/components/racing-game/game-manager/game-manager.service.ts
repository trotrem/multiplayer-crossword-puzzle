import { injectable, inject } from "inversify";
import { RenderService } from "../render-service/render.service";
import { RacingCommunicationService } from "../../../communication.service/communicationRacing.service";
import { Track } from "../../../track";
import * as THREE from "three";
import { ElementRef } from "@angular/core/src/linker/element_ref";
import { RaceValidatorService } from "../race-validator/race-validator.service";
import { CARS_MAX } from "../constants";
import { EventHandlerRenderService } from "../render-service/event-handler-render.service";
import { WallsCollisionsService } from "../walls-collisions-service/walls-collisions-service";
import { Car } from "../car/car";

@injectable()
export class GameManagerService {

    private timer: number;
    private lastDate: number;
    private eventHandler: EventHandlerRenderService;
    private _cars: Car[] = [];

    public constructor(@inject(RenderService) private renderService: RenderService,
                       @inject(RacingCommunicationService) private communicationService: RacingCommunicationService,
                       @inject(RaceValidatorService) private raceValidator: RaceValidatorService) {
                        this.timer = 0;
                    }

    public async initializeGame(trackName: string, container: ElementRef): Promise<void> {
        this.lastDate = Date.now();
        const track: Track = await this.getTrack(trackName, container);

        const collisionService: WallsCollisionsService = new WallsCollisionsService();

        for (let i: number = 0; i < CARS_MAX; i++) {
            this._cars[i] = new Car(collisionService);
            await this._cars[i].init();
        }
        this.raceValidator.initialize(track, collisionService, this._cars);
        this.renderService.initialize(container.nativeElement,
                                      track,
                                      this.raceValidator.cars,
                                      collisionService.createWalls(track.points));
        this.update();
    }

    public startRace(): void {
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

    private update(): void {
        requestAnimationFrame(() => this.update());
        const timeSinceLastFrame: number = Date.now() - this.lastDate;
        this.timer += timeSinceLastFrame;
        for (let i: number = 0; i < CARS_MAX; i++) {
            this.raceValidator.cars[i].update(timeSinceLastFrame);
            this.raceValidator.validateRace(this.raceValidator.validIndex[i], i, this.timer);
        }
        this.lastDate = Date.now();
        this.renderService.render(this.raceValidator.cars[0]);
    }
}
