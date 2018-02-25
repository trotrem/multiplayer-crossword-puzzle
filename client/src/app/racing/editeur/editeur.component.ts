import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import { TrackSavor } from "./track-savor";
import { Track } from "./track";
import { ActivatedRoute } from "@angular/router";
import { SceneServices } from "./../scene.services/scene.service";
import { TrackCreator } from "../trackcreator/track-creator";
import { TrackServices } from "../track.services/track.service";

@Component({
    selector: "app-editeur",
    templateUrl: "./editeur.component.html",
    styleUrls: ["./editeur.component.css"]
})

export class EditeurComponent implements AfterViewInit {

    @ViewChild("canvas")

    private canvasRef: ElementRef;

    private trackSavor: TrackSavor;

    private track: Track;

    private sceneService: SceneServices;

    private trackCreator: TrackCreator;

    private trackService: TrackServices;

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    public constructor(private http: HttpClient, private route: ActivatedRoute) {
        this.track = new Track();
        this.trackCreator = new TrackCreator();
        this.trackSavor = new TrackSavor(this.http, this.trackCreator.points);
        this.sceneService = new SceneServices(this.route);
        this.trackService = new TrackServices(this.http);
    }

    public ngAfterViewInit(): void {
        this.sceneService.initialize(this.canvas);
        const name: string = this.route.snapshot.paramMap.get("name");
        if (name !== null) {
            this.getTrack(name);
        }

    }
    public updateScene(eventNumber: number, event: MouseEvent): void {
        this.sceneService.updateScene(event, eventNumber);
    }

    public notReadyToSubmit(): boolean {
        return !this.trackCreator.isClosed || !this.trackCreator.trackValid;
    }
    public notReadyToSave(): boolean {
        return this.notReadyToSubmit() || !this.trackSavor.getSubmitvalue();
    }
    public savetrack(): void {
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
                // this.redraw(newPoints);
            });
    }

}
