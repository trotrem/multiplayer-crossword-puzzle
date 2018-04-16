import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { NgForm } from "@angular/forms";
import { INewScores, IBestScores } from "../../../../../../common/communication/interfaces";
import { ActivatedRoute } from "@angular/router";
import { SceneEditorService } from "./scene-editor.service/scene-editor.service";
import { RacingCommunicationService } from "../../communication.service/communicationRacing.service";
import * as THREE from "three";
import { ITrack } from "../../track";
import { RenderEditorService } from "./render-editor.service/render-editor.service";
const TRACK_NAME: string = "name";
const CANVAS: string = "canvas";
@Component({
    selector: "app-editor",
    templateUrl: "./editor.component.html",
    styleUrls: ["./editor.component.css"],
    providers: [RenderEditorService, SceneEditorService]
})

export class EditorComponent implements OnInit {

    @ViewChild(CANVAS)

    private canvasRef: ElementRef;
    private submitValid: boolean;
    public track: ITrack;

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    public constructor(
        private communicationService: RacingCommunicationService, private renderService: RenderEditorService,
        private route: ActivatedRoute, private sceneService: SceneEditorService) {
        this.track = {
            name: "", description: "", startingZone: new THREE.Line3, points: new Array<THREE.Vector3>(), usesNumber: 0,
            INewScores: new Array<INewScores>(), IBestScores: new Array<IBestScores>()
        };
        this.submitValid = false;
    }
    public async ngOnInit(): Promise<void> {
        this.renderService.initialize(this.canvas, this.sceneService.scene);
        const name: string = this.route.snapshot.paramMap.get(TRACK_NAME);
        if (name !== null) {
            await this.getTrack(name);
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
    public async savetrack(): Promise<void> {
        this.track.points = this.sceneService.getPoints();
        this.track.startingZone = new THREE.Line3(this.track.points[0], this.track.points[1]);
        this.communicationService.deleteTrack(this.track).then(() => {
            this.communicationService.saveTrack(this.track);
        });

    }
    public onSubmit(form: NgForm): void {
        this.track.description = form.value.description;
        this.track.name = form.value.name;
        this.submitValid = true;
    }

    public async getTrack(name: string): Promise<void> {
        await this.communicationService.getTrackByName(name)
            .then((res: ITrack[]) => {
                this.track = res[0];
                const newPoints: Array<THREE.Vector3> = this.track.points;
                this.sceneService.setIsClosed(true);
                this.sceneService.redrawTrack(newPoints);
            });
    }

}
