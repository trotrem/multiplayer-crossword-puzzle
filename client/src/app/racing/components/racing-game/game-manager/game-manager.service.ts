import { injectable, inject } from "inversify";
import { RenderService } from "../render-service/render.service";
import { RacingCommunicationService } from "../../../communication.service/communicationRacing.service";

@injectable()
export class GameManagerService {

  /* public constructor(@inject(RenderService) private renderService: RenderService, @inject(RacingCommunicationService) private renderService: RacingCommunicationService) { }
  
  private getTrack(name: string): void {
    this.communicationService.getTrackByName(name)
        .subscribe((res: Track[]) => {
            const track: Track = res[0];
            const points: THREE.Vector3[] = [];
            for (const point of track.points) {
                points.push(new THREE.Vector3(point.x, point.y, point.z));
            }
            track.points = points;
            this.renderService.initialize(this.containerRef.nativeElement, track);

        });

} */
}
