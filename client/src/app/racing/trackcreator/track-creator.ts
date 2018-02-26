import { Injectable } from "@angular/core";
import { SceneServices } from "../scene.services/scene.service";
import * as THREE from "three";
import { TrackValidator } from "./track-validator";
const MAX_SELECTION: number = 2;
const RED_COLOR: number = 0xFF0000;
const GREEN_COLOR: number = 0x88D8B0;

export class TrackCreator {

    public points: THREE.Vector3[];

    public isClosed: boolean;

    public trackValidator: TrackValidator;

    public trackValid: boolean;

    public constructor() {
        this.trackValidator = new TrackValidator();
        this.points = new Array<THREE.Vector3>();
        this.trackValid = true;
        this.trackValid = false;
        this.isClosed = false;
    }

    public convertToWorldPosition(event: MouseEvent, canvas: HTMLCanvasElement, camera: THREE.PerspectiveCamera): THREE.Vector3 {
        const canvasRectangle: ClientRect = canvas.getBoundingClientRect();
        const canvasPosition: THREE.Vector3 = new THREE.Vector3(event.x - canvasRectangle.left, event.y - canvasRectangle.top);
        const canvasVector: THREE.Vector3 = new THREE.Vector3(
            (canvasPosition.x / canvas.width) * MAX_SELECTION - 1,
            -(canvasPosition.y / canvas.height) * MAX_SELECTION + 1,
            0);
        canvasVector.unproject(camera);
        const direction: THREE.Vector3 = canvasVector.sub(camera.position);
        const distance: number = - camera.position.z / direction.z;

        return camera.position.clone().add(direction.multiplyScalar(distance));
    }

    public getPlacementPosition(event: MouseEvent, canvas: HTMLCanvasElement, camera: THREE.PerspectiveCamera): THREE.Vector3 {
        let position: THREE.Vector3 = this.convertToWorldPosition(event, canvas, camera);
        if (this.points.length > MAX_SELECTION && position.distanceTo(this.points[0]) < MAX_SELECTION) {
            position = this.points[0];
            this.isClosed = true;
        }

        return position;
    }

    public createFirstPointContour(position: THREE.Vector3): THREE.Points {
        const geometryPoint: THREE.Geometry = new THREE.Geometry();
        geometryPoint.vertices.push(position);
        const material: THREE.PointsMaterial = new THREE.PointsMaterial({ size: 5, color: 0xFAA61A });

        return new THREE.Points(geometryPoint, material);
    }

    public createPoint(position: THREE.Vector3): THREE.Points {
        const pointGeometry: THREE.Geometry = new THREE.Geometry();
        pointGeometry.vertices.push(position);
        const material: THREE.PointsMaterial = new THREE.PointsMaterial({ size: 3, color: 0xFF00A7 });

        return new THREE.Points(pointGeometry, material);
    }

    public createLine(lastPos: THREE.Vector3, newPos: THREE.Vector3): Array<THREE.Line> {
        let lines: Array<THREE.Line> = new Array<THREE.Line>();
        let illegalPoints: THREE.Vector3[] = new Array<THREE.Vector3>();
        let color: number;
        illegalPoints = this.trackValidator.isValid(this.points, lastPos, newPos);

        if (illegalPoints.length === 0) {
            color = GREEN_COLOR;
        } else {
            color = RED_COLOR;
            if (illegalPoints.length > 1) {
                lines = this.redrawConflictingLines(illegalPoints);
            }
            this.trackValid = false;
        }

        const lineGeometry: THREE.Geometry = new THREE.Geometry;
        lineGeometry.vertices.push(lastPos);
        lineGeometry.vertices.push(newPos);
        const line: THREE.Line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ "linewidth": 6, color }));
        lines.push(line);
        this.trackValidator.popPoints();

        return lines;
    }

    public redrawConflictingLines(illegalPoints: THREE.Vector3[]): Array<THREE.Line> {
        const lines: Array<THREE.Line> = new Array<THREE.Line>();
        for (let i: number = 0; i < illegalPoints.length; i += MAX_SELECTION) {
            const lineGeometry: THREE.Geometry = new THREE.Geometry;
            lineGeometry.vertices.push(illegalPoints[i]);
            lineGeometry.vertices.push(illegalPoints[i + 1]);
            const line: THREE.Line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ "linewidth": 6, "color": RED_COLOR }));
            lines.push(line);
        }

        return lines;
    }

}
