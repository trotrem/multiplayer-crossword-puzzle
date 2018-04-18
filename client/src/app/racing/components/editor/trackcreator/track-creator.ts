import * as THREE from "three";
import { TrackValidator } from "./track-validator";
import { RenderEditorService } from "../render-editor.service/render-editor.service";
const MAX_SELECTION: number = 2;
const RED_COLOR: number = 0xFF0000;
const GREEN_COLOR: number = 0x88D8B0;

export class TrackCreator {

    public points: THREE.Vector3[];

    public isClosed: boolean;

    public trackValid: boolean;

    private color: number;

    public illegalPoints: THREE.Vector3[];

    public constructor(private renderService: RenderEditorService) {
        this.points = new Array<THREE.Vector3>();
        this.illegalPoints = new Array<THREE.Vector3>();
        this.trackValid = false;
        this.isClosed = false;
        this.color = 0;
    }

    public getPlacementPosition(positionEvent: THREE.Vector3): THREE.Vector3 {
        let position: THREE.Vector3 = this.renderService.convertToWorldPosition(positionEvent);

        if (this.verifieDistance(position)) {
            position = this.points[0];
            this.isClosed = true;
        }

        return position;
    }

    public createPoint(position: THREE.Vector3, material: THREE.PointsMaterial): THREE.Points {
        const pointGeometry: THREE.Geometry = new THREE.Geometry();
        pointGeometry.vertices.push(position);

        return new THREE.Points(pointGeometry, material);
    }

    public createLine(lastPos: THREE.Vector3, newPos: THREE.Vector3): Array<THREE.Line> {
        const lines: Array<THREE.Line> = this.verifyTrack(lastPos, newPos);
        const color: number = this.color;
        const lineGeometry: THREE.Geometry = new THREE.Geometry;
        lineGeometry.vertices.push(lastPos);
        lineGeometry.vertices.push(newPos);
        const line: THREE.Line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color }));
        lines.push(line);
        TrackValidator.emptyPoints(this.illegalPoints);

        return lines;
    }

    public redrawConflictingLines(color: number): Array<THREE.Line> {
        const lines: Array<THREE.Line> = new Array<THREE.Line>();
        for (let i: number = 0; i < this.illegalPoints.length; i += MAX_SELECTION) {
            const lineGeometry: THREE.Geometry = new THREE.Geometry;
            lineGeometry.vertices.push(this.illegalPoints[i]);
            lineGeometry.vertices.push(this.illegalPoints[i + 1]);
            const line: THREE.Line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color }));
            lines.push(line);
        }

        return lines;
    }

    private verifieDistance(position: THREE.Vector3): boolean {
        return this.points.length > MAX_SELECTION && position.distanceTo(this.points[0]) < MAX_SELECTION;
    }

    private verifyTrack(lastPos: THREE.Vector3, newPos: THREE.Vector3): Array<THREE.Line> {
        let lines: Array<THREE.Line> = new Array<THREE.Line>();
        this.illegalPoints = TrackValidator.isValid(this.points, lastPos, newPos);

        if (this.illegalPoints.length === 0) {
            this.color = GREEN_COLOR;
        } else {
            this.color = RED_COLOR;
            if (this.illegalPoints.length > 1) {
                lines = this.redrawConflictingLines(this.color);
            }
            this.trackValid = false;
        }

        return lines;
    }


}
