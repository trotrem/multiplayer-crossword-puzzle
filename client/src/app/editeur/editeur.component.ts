import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import * as THREE from "three";
import { Contraints } from "./contraints";
import { Track } from "./track";
import { HttpClient } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import { TrackServices } from "./track-services";
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

    private camera: THREE.PerspectiveCamera;

    private scene: THREE.Scene;

    private renderer: THREE.Renderer;

    public points: THREE.Vector3[];

    private isClosed: boolean;

    private dragIndex: number;

    private contraints: Contraints;

    private startingZone: THREE.Line3;

    private trackValid: boolean;

    private track: Track;

    private submitValid: boolean;

    private trackService: TrackServices;

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    public constructor(http: HttpClient) {
        this.dragIndex = -1;
        this.points = new Array<THREE.Vector3>();
        this.contraints = new Contraints();
        this.startingZone = new THREE.Line3();
        this.trackValid = true;
        this.track = new Track();
        this.submitValid = false;
        this.trackService = new TrackServices(http);
    }

    public ngAfterViewInit(): void {
        this.createScene();
        this.animate();
        this.subscribeEvents();
    }

    private subscribeEvents(): void {
        this.canvas.addEventListener("click", (event: MouseEvent) => this.onLeftClick(event));
        this.canvas.addEventListener("contextmenu", (event: MouseEvent) => {
            event.preventDefault();
            this.onRightClick();
        });
        this.canvas.addEventListener("dragstart", (event: MouseEvent) => { this.dragIndex = this.getDraggedPointIndex(event); });
        this.canvas.addEventListener("drag", (event: MouseEvent) => { this.onDrag(event, false); });
        this.canvas.addEventListener("dragend", (event: MouseEvent) => { this.onDrag(event, true); });
    }

    public createScene(): void {
        this.camera = new THREE.PerspectiveCamera();
        const CAMERA_DISTANCE: number = 100;
        this.camera.position.set(0, 0, CAMERA_DISTANCE);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public getScene(): THREE.Scene {
        return this.scene;
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
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

    private onRightClick(): void {
        this.isClosed = false;
        this.startingZone = new THREE.Line3();
        const nbChildren: number = this.scene.children.length;
        const newPoints: THREE.Vector3[] = this.points;
        this.points = [];
        newPoints.pop();
        if (newPoints.length > 0) {
            this.redraw(newPoints);
        } else {
            this.scene.remove(this.scene.children[nbChildren - 1]);
            this.scene.remove(this.scene.children[nbChildren - MAX_SELECTION]);
        }
    }

    private onDrag(event: MouseEvent, end: boolean): void {

        const newPoints: THREE.Vector3[] = this.points;
        this.points = [];
        this.startingZone = new THREE.Line3();
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

    private getDraggedPointIndex(event: MouseEvent): number {
        const position: THREE.Vector3 = this.convertToWorldPosition(event);
        let index: number = -1;
        this.points.forEach((point, i) => {
            if (position.distanceTo(point) < MAX_SELECTION) {
                index = i;
            }
        });

        return index;
    }

    private convertToWorldPosition(event: MouseEvent): THREE.Vector3 {
        const canvasRectangle: ClientRect = this.canvas.getBoundingClientRect();
        const canvasPosition: THREE.Vector3 = new THREE.Vector3(event.x - canvasRectangle.left, event.y - canvasRectangle.top);
        const canvasVector: THREE.Vector3 = new THREE.Vector3(
            (canvasPosition.x / this.canvas.width) * MAX_SELECTION - 1,
            -(canvasPosition.y / this.canvas.height) * MAX_SELECTION + 1,
            0);
        canvasVector.unproject(this.camera);
        const direction: THREE.Vector3 = canvasVector.sub(this.camera.position);
        const distance: number = - this.camera.position.z / direction.z;

        return this.camera.position.clone().add(direction.multiplyScalar(distance));
    }

    private getPlacementPosition(event: MouseEvent): THREE.Vector3 {
        let position: THREE.Vector3 = this.convertToWorldPosition(event);
        if (this.points.length > MAX_SELECTION && position.distanceTo(this.points[0]) < MAX_SELECTION) {
            position = this.points[0];
            this.isClosed = true;
            this.startingZone = new THREE.Line3(this.points[0], this.points[1]);
        }

        return position;
    }

    private createFirstPointContour(position: THREE.Vector3): void {
        const geometryPoint: THREE.Geometry = new THREE.Geometry();
        geometryPoint.vertices.push(position);
        const material: THREE.PointsMaterial = new THREE.PointsMaterial({ size: 5, color: 0xFAA61A });
        const point: THREE.Points = new THREE.Points(geometryPoint, material);
        this.scene.add(point);
    }

    public createPoint(position: THREE.Vector3): void { // public for test
        const pointGeometry: THREE.Geometry = new THREE.Geometry();
        pointGeometry.vertices.push(position);
        const material: THREE.PointsMaterial = new THREE.PointsMaterial({ size: 3, color: 0xFF00A7 });
        const point: THREE.Points = new THREE.Points(pointGeometry, material);
        this.scene.add(point);
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
        this.scene.add(line);
    }

    private redrawConflictingLines(illegalPoints: THREE.Vector3[], color: number): void {
        for (let i: number = 0; i < illegalPoints.length; i += MAX_SELECTION) {
            const lineGeometry: THREE.Geometry = new THREE.Geometry;
            lineGeometry.vertices.push(illegalPoints[i]);
            lineGeometry.vertices.push(illegalPoints[i + 1]);
            const line: THREE.Line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ "linewidth": 6, "color": color }));
            this.scene.add(line);
        }
    }

    private redraw(newPoints: THREE.Vector3[]): void {
        this.trackValid = true;
        if (!newPoints) {
            return;
        }

        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }

        this.createFirstPointContour(newPoints[0]);
        this.createPoint(newPoints[0]);
        this.points.push(newPoints[0]);

        for (const position of newPoints.slice(1)) {
            this.createLine(this.points[this.points.length - 1], position);
            this.createPoint(position);
            this.points.push(position);
        }
        this.startingZone = new THREE.Line3(this.points[0], this.points[1]);
    }

    public notReadyToSubmit(): boolean {
        return !this.isClosed || !this.trackValid;
    }
    public notReadyToSave(): boolean {
        return this.notReadyToSubmit() || !this.submitValid ;
    }

    public savetrack(): void {
        this.track.setPoints(this.points);
        this.track.setStartingZone(this.startingZone);
        this.trackService.saveTrackService(this.track);
    }
    public onSubmit(f: NgForm): void {
        this.track.setDescription(f.value.description);
        this.track.setName(f.value.name);
        this.submitValid = true;
    }

}
