import { Injectable } from "@angular/core";
import * as THREE from "three";
import { TrackCreator } from "./../trackcreator/track-creator";
import { RenderEditorService } from "../render-editor.service/render-editor.service";

const MAX_SELECTION: number = 2;
const FIRST_POINT_MATERIAL: THREE.PointsMaterial = new THREE.PointsMaterial({ size: 5, color: 0xFAA61A });
const POINT_MATERIAL: THREE.PointsMaterial = new THREE.PointsMaterial({ size: 3, color: 0xFF00A7 });

@Injectable()
export class SceneEditorService {

    private _scene: THREE.Scene;
    private lines: Array<THREE.Line>;
    private dragIndex: number;
    private trackCreator: TrackCreator;

    public constructor(private renderService: RenderEditorService) {
        this.dragIndex = -1;
        this.trackCreator = new TrackCreator(this.renderService);
        this.lines = new Array<THREE.Line>();
        this._scene = new THREE.Scene();
    }

    public onLeftClick(event: MouseEvent): void {
        if (this.trackCreator.isClosed) {
            return null;
        }
        const position: THREE.Vector3 =
            this.trackCreator.getPlacementPosition(new THREE.Vector3(event.x, event.y));
        this.drawPoints(position);
        this.drawLines(position);
        this.trackCreator.points.push(position);
    }

    private drawPoints(position: THREE.Vector3): void {
        if (this.trackCreator.points.length === 0) {
            this.scene.add(this.trackCreator.createPoint(position, FIRST_POINT_MATERIAL));
        }
        this.scene.add(this.trackCreator.createPoint(position, POINT_MATERIAL));
    }

    private drawLines(position: THREE.Vector3): void {
        if (this.trackCreator.points.length > 0) {
            this.lines = this.trackCreator.createLine(this.trackCreator.points[this.trackCreator.points.length - 1], position);
            this.addLinesToScene();
        }
    }

    private addLinesToScene(): void {
        for (const i of this.lines) {
            this.scene.add(i);
        }
    }

    public onRightClick(event: MouseEvent): void {
        event.preventDefault();
        this.removePoint();
    }

    public onDrag(event: MouseEvent, end: boolean): void {
        const newPoints: THREE.Vector3[] = this.trackCreator.points;
        this.trackCreator.points = [];

        const position: THREE.Vector3 =
            this.renderService.convertToWorldPosition(new THREE.Vector3(event.x, event.y));
        newPoints[this.dragIndex] = position;
        if (this.dragIndex === newPoints.length - 1 && this.trackCreator.isClosed) {
            newPoints[0] = position;
        }

        this.redrawTrack(newPoints);
        if (end) {
            this.dragIndex = -1;
        }
    }

    public getDraggedPointIndex(event: MouseEvent): void {
        const position: THREE.Vector3 =
            this.renderService.convertToWorldPosition(new THREE.Vector3(event.x, event.y));
        let index: number = -1;
        this.trackCreator.points.forEach((point, i) => {
            if (position.distanceTo(point) < MAX_SELECTION) {
                index = i;
            }
        });

        this.dragIndex = index;
    }

    private removePoint(): void {
        this.trackCreator.isClosed = false;
        const newPoints: THREE.Vector3[] = this.trackCreator.points;
        this.trackCreator.points = [];
        newPoints.pop();
        if (newPoints.length > 0) {
            this.redrawTrack(newPoints);
        } else {
            this.removeTrack();
        }
    }

    public redrawTrack(newPoints: THREE.Vector3[]): void {
        this.trackCreator.trackValid = true;
        if (!newPoints) {
            return;
        }
        if (this.trackCreator.isClosed) {
            newPoints[newPoints.length - 1] = newPoints[0];
        }
        this.removeTrack();
        this.scene.add(this.trackCreator.createPoint(newPoints[0], FIRST_POINT_MATERIAL));
        this.trackCreator.points.push(newPoints[0]);

        for (const position of newPoints.slice(1)) {
            this.lines = this.trackCreator.createLine(this.trackCreator.points[this.trackCreator.points.length - 1], position);
            this.scene.add(this.trackCreator.createPoint(position, POINT_MATERIAL));
            this.trackCreator.points.push(position);
            this.addLinesToScene();
        }

    }

    private removeTrack(): void {
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
    }
    public getPoints(): Array<THREE.Vector3> {
        return this.trackCreator.points;
    }

    public getTrackValid(): boolean {
        return this.trackCreator.trackValid;
    }

    public getIsClosed(): boolean {
        return this.trackCreator.isClosed;
    }

    public setIsClosed(isClosed: boolean): void {
        this.trackCreator.isClosed = isClosed;
    }
    public get scene(): THREE.Scene {
        return this._scene;
    }

}
