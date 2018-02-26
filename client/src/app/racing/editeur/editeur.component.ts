import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import { TrackSavor } from "../track-savor/track-savor";
import { Track } from "../track-savor/track";
import { ActivatedRoute } from "@angular/router";
import { SceneServices } from "./../scene.services/scene.service";
import { TrackServices } from "../track.services/track.service";

@Component({
    selector: "app-editeur",
    templateUrl: "./editeur.component.html",
    styleUrls: ["./editeur.component.css"]
})

export class EditeurComponent implements OnInit {

    @ViewChild("canvas")

    private canvasRef: ElementRef;

    private trackSavor: TrackSavor;

    private track: Track;

    private sceneService: SceneServices;

    private trackService: TrackServices;

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    public constructor(private http: HttpClient, private route: ActivatedRoute) {
        this.track = new Track();
        this.sceneService = new SceneServices();
        this.trackService = new TrackServices(this.http);
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
        this.trackService.getTrackService(name)
            .subscribe((res: Track[]) => {
                this.track = res[0];
                const newPoints: Array<THREE.Vector3> = this.track.points;
                this.sceneService.setIsClosed(true);
                this.sceneService.redrawTrack(newPoints);
            });
    }

}
