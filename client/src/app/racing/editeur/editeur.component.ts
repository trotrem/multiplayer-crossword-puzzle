import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import * as THREE from "three";
import { Contraints } from "./contraints";
import { HttpClient } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import { TrackSavor } from "./track-savor";
import { Track } from "./track";
import { TrackServices } from "./../track.services/track-services";
import { ActivatedRoute } from "@angular/router";
import { SceneServices } from "./../scene.services/scene.services";
const MAX_SELECTION: number = 2;
const RED_COLOR: number = 0xFF0000;
const GREEN_COLOR: number = 0x88D8B0;

@Component({
    selector: "app-editeur",
    templateUrl: "./editeur.component.html",
    styleUrls: ["./editeur.component.css"]
})

export class EditeurComponent implements AfterViewInit {

    @ViewChild("canvas")
    private canvasRef: ElementRef;

    public points: THREE.Vector3[];

    private isClosed: boolean;

    private dragIndex: number;

    private contraints: Contraints;

    private trackValid: boolean;

    private trackSavor: TrackSavor;

    private trackService: TrackServices;

    private track: Track;

    private sceneService: SceneServices;

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    public constructor(private http: HttpClient, private route: ActivatedRoute) {
        this.dragIndex = -1;
        this.points = new Array<THREE.Vector3>();
        this.contraints = new Contraints();
        this.track = new Track();
        this.trackValid = true;
        this.trackService = new TrackServices(this.http);
        this.trackSavor = new TrackSavor(this.http, this.points);
        this.sceneService = new SceneServices(this.route);
    }

    public ngAfterViewInit(): void {
        this.sceneService.initialize(this.canvas);
    }

    private onLeftClick(event: MouseEvent): void {
        if (this.isClosed) {
            return null;
        }

        const position: THREE.Vector3 = this.getPlacementPosition(event);

        if (this.points.length === 0) {
            this.createFirstPointContour(position);
        }
        this.createPoint(position);

        if (this.points.length > 0) {
            this.createLine(this.points[this.points.length - 1], position);
        }

        this.points.push(position);
    }

    private onRightClick(event: MouseEvent): void {
        event.preventDefault();
        this.isClosed = false;

        const nbChildren: number = this.sceneService.scene.children.length;
        const newPoints: THREE.Vector3[] = this.points;
        this.points = [];
        newPoints.pop();
        if (newPoints.length > 0) {
            this.redraw(newPoints);
        } else {
            this.sceneService.scene.remove(this.sceneService.scene.children[nbChildren - 1]);
            this.sceneService.scene.remove(this.sceneService.scene.children[nbChildren - MAX_SELECTION]);
        }
    }

    private onDrag(event: MouseEvent, end: boolean): void {

        const newPoints: THREE.Vector3[] = this.points;
        this.points = [];

        const position: THREE.Vector3 = this.convertToWorldPosition(event);
        newPoints[this.dragIndex] = position;
        if (this.dragIndex === newPoints.length - 1 && this.isClosed) {
            newPoints[0] = position;
        }

        this.redraw(newPoints);
        if (end) {
            this.dragIndex = -1;
        }
    }

    private getDraggedPointIndex(event: MouseEvent): void {
        const position: THREE.Vector3 = this.convertToWorldPosition(event);
        let index: number = -1;
        this.points.forEach((point, i) => {
            if (position.distanceTo(point) < MAX_SELECTION) {
                index = i;
            }
        });

        this.dragIndex = index;
    }

    private convertToWorldPosition(event: MouseEvent): THREE.Vector3 {
        const canvasRectangle: ClientRect = this.canvas.getBoundingClientRect();
        const canvasPosition: THREE.Vector3 = new THREE.Vector3(event.x - canvasRectangle.left, event.y - canvasRectangle.top);
        const canvasVector: THREE.Vector3 = new THREE.Vector3(
            (canvasPosition.x / this.canvas.width) * MAX_SELECTION - 1,
            -(canvasPosition.y / this.canvas.height) * MAX_SELECTION + 1,
            0);
        canvasVector.unproject(this.sceneService.getCamera());
        const direction: THREE.Vector3 = canvasVector.sub(this.sceneService.getCamera().position);
        const distance: number = - this.sceneService.getCamera().position.z / direction.z;

        return this.sceneService.getCamera().position.clone().add(direction.multiplyScalar(distance));
    }

    private getPlacementPosition(event: MouseEvent): THREE.Vector3 {
        let position: THREE.Vector3 = this.convertToWorldPosition(event);
        if (this.points.length > MAX_SELECTION && position.distanceTo(this.points[0]) < MAX_SELECTION) {
            position = this.points[0];
            this.isClosed = true;

        }

        return position;
    }

    private createFirstPointContour(position: THREE.Vector3): void {
        const geometryPoint: THREE.Geometry = new THREE.Geometry();
        geometryPoint.vertices.push(position);
        const material: THREE.PointsMaterial = new THREE.PointsMaterial({ size: 5, color: 0xFAA61A });
        const point: THREE.Points = new THREE.Points(geometryPoint, material);
        this.sceneService.scene.add(point);
    }

    public createPoint(position: THREE.Vector3): void { // public for test
        const pointGeometry: THREE.Geometry = new THREE.Geometry();
        pointGeometry.vertices.push(position);
        const material: THREE.PointsMaterial = new THREE.PointsMaterial({ size: 3, color: 0xFF00A7 });
        const point: THREE.Points = new THREE.Points(pointGeometry, material);
        this.sceneService.scene.add(point);
    }

    public createLine(lastPos: THREE.Vector3, newPos: THREE.Vector3): void { // public for test
        let illegalPoints: THREE.Vector3[] = new Array<THREE.Vector3>();
        let color: number;
        illegalPoints = this.contraints.isValid(this.points, lastPos, newPos);

        if (illegalPoints.length === 0) {
            color = GREEN_COLOR;
        } else {
            color = RED_COLOR;
            if (illegalPoints.length > 1) {
                this.redrawConflictingLines(illegalPoints, color);
            }
            this.trackValid = false;
        }

        const lineGeometry: THREE.Geometry = new THREE.Geometry;
        lineGeometry.vertices.push(lastPos);
        lineGeometry.vertices.push(newPos);
        const line: THREE.Line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ "linewidth": 6, color }));
        this.sceneService.scene.add(line);
    }

    private redrawConflictingLines(illegalPoints: THREE.Vector3[], color: number): void {
        for (let i: number = 0; i < illegalPoints.length; i += MAX_SELECTION) {
            const lineGeometry: THREE.Geometry = new THREE.Geometry;
            lineGeometry.vertices.push(illegalPoints[i]);
            lineGeometry.vertices.push(illegalPoints[i + 1]);
            const line: THREE.Line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ "linewidth": 6, "color": color }));
            this.sceneService.scene.add(line);
        }
    }

    private redraw(newPoints: THREE.Vector3[]): void {
        this.trackValid = true;
        if (!newPoints) {
            return;
        }

        while (this.sceneService.scene.children.length > 0) {
            this.sceneService.scene.remove(this.sceneService.scene.children[0]);
        }

        this.createFirstPointContour(newPoints[0]);
        this.createPoint(newPoints[0]);
        this.points.push(newPoints[0]);

        for (const position of newPoints.slice(1)) {
            this.createLine(this.points[this.points.length - 1], position);
            this.createPoint(position);
            this.points.push(position);
        }

    }

    public notReadyToSubmit(): boolean {
        return !this.isClosed || !this.trackValid;
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

}
