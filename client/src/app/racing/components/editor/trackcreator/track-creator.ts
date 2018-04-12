import * as THREE from "three";
import { TrackValidator } from "./track-validator";
import { RenderEditorService } from "../render-editor.service/render-editor.service";
const MAX_SELECTION: number = 2;
const RED_COLOR: number = 0xFF0000;
const GREEN_COLOR: number = 0x88D8B0;
const FIRST_POINT_COUNTOUR_SIZE: number = 5;
const POINT_SIZE: number = 3;

export class TrackCreator {

    public points: THREE.Vector3[];

    public isClosed: boolean;

    public trackValidator: TrackValidator;

    public trackValid: boolean;

    public constructor(private renderService: RenderEditorService) {
        this.trackValidator = new TrackValidator();
        this.points = new Array<THREE.Vector3>();

        this.trackValid = false;
        this.isClosed = false;
    }

    public getPlacementPosition(positionEvent: THREE.Vector3): THREE.Vector3 {
        let position: THREE.Vector3 = this.renderService.convertToWorldPosition(positionEvent);

        if (this.points.length > MAX_SELECTION && position.distanceTo(this.points[0]) < MAX_SELECTION) {
            position = this.points[0];
            this.isClosed = true;
        }

        return position;
    }

    public createFirstPointContour(position: THREE.Vector3): THREE.Points {
        const geometryPoint: THREE.Geometry = new THREE.Geometry();
        geometryPoint.vertices.push(position);
        const material: THREE.PointsMaterial = new THREE.PointsMaterial({ size: FIRST_POINT_COUNTOUR_SIZE, color: 0xFAA61A });

        return new THREE.Points(geometryPoint, material);
    }

    public createPoint(position: THREE.Vector3): THREE.Points {
        const pointGeometry: THREE.Geometry = new THREE.Geometry();
        pointGeometry.vertices.push(position);
        const material: THREE.PointsMaterial = new THREE.PointsMaterial({ size: POINT_SIZE, color: 0xFF00A7 });

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
        const line: THREE.Line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ /*"linewidth": 6,*/ color }));
        lines.push(line);
        this.trackValidator.emptyPoints();

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
