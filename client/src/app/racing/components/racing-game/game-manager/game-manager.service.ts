import { injectable, inject } from "inversify";
import { RenderService } from "../render-service/render.service";
import { RacingCommunicationService } from "../../../communication.service/communicationRacing.service";
import { Track } from "../../../track";
import * as THREE from "three";
import { ElementRef } from "@angular/core/src/linker/element_ref";

@injectable()
export class GameManagerService {

    public constructor(@inject(RenderService) private renderService: RenderService,
                       @inject(RacingCommunicationService) private communicationService: RacingCommunicationService) { }

    public initializeGame(trackName: string, container: ElementRef): void {
        this.getTrack(trackName, container);
    }

    public startRace(): void {
        this.renderService.initializeEventHandlerService();
    }

    public onResize(): void {
        this.renderService.onResize();
    }

    private getTrack(name: string, container: ElementRef): void {
        this.communicationService.getTrackByName(name)
            .subscribe((res: Track[]) => {
                const track: Track = res[0];
                const points: THREE.Vector3[] = [];
                for (const point of track.points) {
                    points.push(new THREE.Vector3(point.x, point.y, point.z));
                }
                track.points = points;
                this.renderService.initialize(container.nativeElement, track);

            });

    }
}
