import { TrackDisplay } from "./track-display";
import { TestBed } from "@angular/core/testing";
import * as THREE from "three";
// "magic numers" utilisés pour les tests
/* tslint:disable:no-magic-numbers */
describe("TrackDisplay", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TrackDisplay]
        });
    });

    it("should return a array of mesh to be add to the scene", () => {
        let meshs: THREE.Mesh[] = new Array<THREE.Mesh>();
        const points: THREE.Vector3[] = new Array<THREE.Vector3>();
        points.push(new THREE.Vector3(-23, 77, 0));
        points.push(new THREE.Vector3(-7, 8, 0));
        points.push(new THREE.Vector3(-2, 77, 0));
        points.push(new THREE.Vector3(-1, 70, 0));
        points.push(new THREE.Vector3(-23, 77, 0));
        meshs = TrackDisplay.drawTrack(points);
        expect(meshs.length).toBe(9);
    });
});
