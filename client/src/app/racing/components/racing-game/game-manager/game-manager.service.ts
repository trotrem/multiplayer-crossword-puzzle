import { Injectable } from "@angular/core";
import { RenderService } from "../render-service/render.service";
import { RacingCommunicationService } from "../../../communication.service/communicationRacing.service";
import { Track } from "../../../track";
import * as THREE from "three";
import { ElementRef } from "@angular/core/src/linker/element_ref";
import { RaceValidatorService } from "../race-validator/race-validator.service";
import { CARS_MAX } from "../constants";
import { WallsCollisionsService } from "../walls-collisions-service/walls-collisions-service";
import { Car } from "../car/car";
import { KeyboardService } from "../commands/keyboard.service";

@Injectable()
export class GameManagerService {

    private timer: number;
    private lastDate: number;
    private _cars: Car[] = [];

    public constructor(private renderService: RenderService,
                       private communicationService: RacingCommunicationService,
                       private raceValidator: RaceValidatorService,
                       private collisionService: WallsCollisionsService,
                       private keyboard: KeyboardService ) {
                        this.timer = 0;
                    }

    public async initializeGame(trackName: string, container: ElementRef): Promise<void> {
        this.lastDate = Date.now();
        const track: Track = await this.getTrack(trackName, container);

        for (let i: number = 0; i < CARS_MAX; i++) {
            this._cars[i] = new Car(this.collisionService, this.keyboard);
            await this._cars[i].init();
        }
        this.raceValidator.initialize(track, this.collisionService, this._cars);
        this.renderService.initialize(container.nativeElement,
                                      track,
                                      this.raceValidator.cars,
                                      this.collisionService.createWalls(track.points));
        await this.update();
    }

    public startRace(): void {
        this._cars[0].initCommands();
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
        requestAnimationFrame(async() => this.update());
        const timeSinceLastFrame: number = Date.now() - this.lastDate;
        this.timer += timeSinceLastFrame;
        for (let i: number = 0; i < CARS_MAX; i++) {
            this.raceValidator.cars[i].update(timeSinceLastFrame);
            await this.raceValidator.validateRace(this.raceValidator.validIndex[i], i, this.timer).then(() => {});
        }
        this.lastDate = Date.now();
        this.renderService.render(this.raceValidator.cars[0]);
    }
}
