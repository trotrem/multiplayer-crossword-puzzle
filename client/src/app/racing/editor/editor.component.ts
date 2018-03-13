import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import { TrackSavor } from "../track-savor/track-savor";
import { Track } from "../track-savor/track";
import { ActivatedRoute } from "@angular/router";
import { SceneServices } from "./../scene.services/scene.service";
import { CommunicationRacingService } from "../communication.service/communicationRacing.service";

@Component({
    selector: "app-editor",
    templateUrl: "./editor.component.html",
    styleUrls: ["./editor.component.css"]
})

export class EditorComponent implements OnInit {

    @ViewChild("canvas")

    private canvasRef: ElementRef;

    private trackSavor: TrackSavor;

    private track: Track;

    private sceneService: SceneServices;

    private communicationService: CommunicationRacingService;

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    public constructor(private http: HttpClient, private route: ActivatedRoute) {
        this.track = new Track();
        this.sceneService = new SceneServices();
        this.communicationService = new CommunicationRacingService(this.http);
        this.trackSavor = new TrackSavor(this.http);
    }
    public setTrack(track: Track): void {
        this.track = track;
      }

    public ngOnInit(): void {
        this.sceneService.initialize(this.canvas);
        const name: string = this.route.snapshot.paramMap.get("name");
        if (name !== null) {
            this.getTrack(name);
        }

    }
    public onLeftClick(event: MouseEvent): void {
        this.sceneService.onLeftClick(event);
    }
    public onRightClick(event: MouseEvent): void {
        this.sceneService.onRightClick(event);
    }
    public onDrag(event: MouseEvent, end: boolean): void {
        this.sceneService.onDrag(event, end);
    }
    public getDraggedPointIndex(event: MouseEvent, end: boolean): void {
        this.sceneService.getDraggedPointIndex(event);
    }
    public notReadyToSubmit(): boolean {
        return !this.sceneService.getIsClosed() || !this.sceneService.getTrackValid();
    }
    public notReadyToSave(): boolean {
        return this.notReadyToSubmit() || !this.trackSavor.getSubmitvalue();
    }
    public savetrack(): void {
        this.trackSavor.setPoints(this.sceneService.getPoints());
        this.trackSavor.savetrack();
    }
    public onSubmit(f: NgForm): void {
        this.trackSavor.onSubmit(f);
    }

    private getTrack(name: string): void {
        this.communicationService.getTrackByName(name)
            .subscribe((res: Track[]) => {
                this.track = res[0];
                const newPoints: Array<THREE.Vector3> = this.track.points;
                this.sceneService.setIsClosed(true);
                this.sceneService.redrawTrack(newPoints);
            });
    }

}
