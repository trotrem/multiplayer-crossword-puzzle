import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import { Track } from "../../track";
import { ActivatedRoute } from "@angular/router";
import { SceneServices } from "./scene.services/scene.service";
import { RacingCommunicationService } from "../../communication.service/communicationRacing.service";
import * as THREE from "three";

@Component({
    selector: "app-editor",
    templateUrl: "./editor.component.html",
    styleUrls: ["./editor.component.css"]
})

export class EditorComponent implements OnInit {

    @ViewChild("canvas")

    private canvasRef: ElementRef;
    private submitValid: boolean;
    private track: Track;
    private sceneService: SceneServices;
    private communicationService: RacingCommunicationService;

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    public constructor(private http: HttpClient, private route: ActivatedRoute) {
        this.track = {
            name: "", description: "", startingZone: new THREE.Line3, points: new Array<THREE.Vector3>(), usesNumber: 0,
            newScores: new Array<number>()
        };
        this.submitValid = false;
        this.sceneService = new SceneServices();
        this.communicationService = new RacingCommunicationService(this.http);
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
        return this.notReadyToSubmit() || !this.submitValid;
    }
    public savetrack(): void {
        this.track.points = this.sceneService.getPoints();
        this.track.startingZone = new THREE.Line3(this.track.points[0], this.track.points[1]);
        this.communicationService.deleteTrack(this.track);
        this.communicationService.saveTrack(this.track);
    }
    public onSubmit(f: NgForm): void {
        this.track.description = f.value.description;
        this.track.name = f.value.name;
        this.submitValid = true;
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
