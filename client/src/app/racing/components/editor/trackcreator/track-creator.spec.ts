import { TrackCreator } from "./track-creator";
import * as THREE from "three";
import { RenderEditorService } from "../../../services/render-editor/render-editor.service";
const POINT_MATERIAL: THREE.PointsMaterial = new THREE.PointsMaterial({ size: 3, color: 0xFF00A7 });

/* tslint:disable:no-magic-numbers*/
describe("TrackCreator", () => {
    const service: RenderEditorService = new RenderEditorService();
    const component: TrackCreator = new TrackCreator(service);
    it("should create an instance", () => {
        expect(component).toBeDefined();
    });

    it("should create a point", () => {
        const position: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
        const point: THREE.Points = component.createPoint(position, POINT_MATERIAL);
        expect(point).toBeDefined();
    });

    it("should create a line", () => {
        const points: Array<THREE.Vector3> = new Array<THREE.Vector3>();
        const position1: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
        const position2: THREE.Vector3 = new THREE.Vector3(23, -2, 0);
        points.push(position1);
        component.points = points;
        const lines: Array<THREE.Line> = component.createLine(position1, position2);
        expect(lines.length).toBe(1);
    });
    it("should recreate a conflict line ", () => {
        const color: number =  0xFF0000;
        component.illegalPoints = new Array<THREE.Vector3>();
        const position1: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
        const position2: THREE.Vector3 = new THREE.Vector3(23, -2, 0);
        component.illegalPoints.push(position1);
        component.illegalPoints.push(new THREE.Vector3(0, 0, 0));
        component.illegalPoints.push(position2);
        const lines: Array<THREE.Line> = component.redrawConflictingLines( color);
        expect(lines.length).toBe(2);
    });
});
