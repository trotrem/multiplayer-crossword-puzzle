import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import * as THREE from "three";
import { Contraints } from "./contraints";

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

    public arrayPoints: THREE.Vector3[];

    private isClosed: boolean;

    private dragIndex: number;

    private contraints: Contraints;

    private startingZone: THREE.Line3;

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    public constructor() {
        this.dragIndex = -1;
        this.arrayPoints = new Array<THREE.Vector3>();
        this.contraints = new Contraints();
        this.startingZone = new THREE.Line3();
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
        this.canvas.addEventListener("dragend", (event: MouseEvent) => { this.onDragEnd(event); });
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

        if (this.arrayPoints.length === 0) {
            this.createFirstPointContour(position);
        }
        this.createPoint(position);

        if (this.arrayPoints.length > 0) {
            this.createLine(this.arrayPoints[this.arrayPoints.length - 1], position);
        }

        this.arrayPoints.push(position);
    }

    private onRightClick(): void {
        this.isClosed = false;
        this.startingZone = new THREE.Line3();
        const nbChildren: number = this.scene.children.length;
        const newArray: THREE.Vector3[] = this.arrayPoints;
        this.arrayPoints = [];
        newArray.pop();
        if (newArray.length > 0) {
            this.redraw(newArray);
        } else {
            this.scene.remove(this.scene.children[nbChildren - 1]);
            this.scene.remove(this.scene.children[nbChildren - MAX_SELECTION]);
        }
    }

    private onDragEnd(event: MouseEvent): void {
        event.preventDefault();
        const newArray: THREE.Vector3[] = this.arrayPoints;
        this.arrayPoints = [];
        this.startingZone = new THREE.Line3();
        const position: THREE.Vector3 = this.convertToWorldPosition(event);
        newArray[this.dragIndex] = position;
        if (this.dragIndex === newArray.length - 1 && this.isClosed) {
            newArray[0] = position;
        }
        this.dragIndex = -1;
        this.redraw(newArray);
    }

    private getDraggedPointIndex(event: MouseEvent): number {
        const position: THREE.Vector3 = this.convertToWorldPosition(event);
        let index: number = -1;
        this.arrayPoints.forEach((point, i) => {
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
        if (this.arrayPoints.length > MAX_SELECTION && position.distanceTo(this.arrayPoints[0]) < MAX_SELECTION) {
            position = this.arrayPoints[0];
            this.isClosed = true;
            this.startingZone = new THREE.Line3(this.arrayPoints[0], this.arrayPoints[1]);
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
        illegalPoints = this.contraints.isValid(this.arrayPoints, lastPos, newPos);

        if (illegalPoints.length === 0) {
            color = GREEN_COLOR;
        } else {
            color = RED_COLOR;
            if (illegalPoints.length > 1) {
                this.redrawConflictingLines(illegalPoints, color);
            }
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

    private redraw(newArrayPoints: THREE.Vector3[]): void {
        if (!newArrayPoints) {
            return;
        }

        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }

        this.createFirstPointContour(newArrayPoints[0]);
        this.createPoint(newArrayPoints[0]);
        this.arrayPoints.push(newArrayPoints[0]);

        for (const position of newArrayPoints.slice(1)) {
            this.createLine(this.arrayPoints[this.arrayPoints.length - 1], position);
            this.createPoint(position);
            this.arrayPoints.push(position);
        }
        this.startingZone = new THREE.Line3(this.arrayPoints[0], this.arrayPoints[1]);
    }
}
