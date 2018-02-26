import { TrackValidator } from "./track-validator";
import * as THREE from "three";

// "magic numers" utilisés pour les tests
/* tslint:disable:no-magic-numbers */

describe("TrackValoidator", () => {
    const trackValidator: TrackValidator = new TrackValidator();
    it("should create the object contraints", () => {
        expect(trackValidator).toBeDefined();
    });

    it("shouldnt accept two segments forming an angle below 45 degree", () => {
        const points: Array<THREE.Vector3> = new Array<THREE.Vector3>();
        points.push(new THREE.Vector3(-18.6, 15.6, 0));
        const position1: THREE.Vector3 = new THREE.Vector3(-18.3, -23.6, 0);
        points.push(position1);
        const position2: THREE.Vector3 = new THREE.Vector3(-13.3, 17.9, 0);
        expect(trackValidator.isValid(points, position1, position2).length).toBe(2);
    });

    it("shouldnt accept a segment smaller than MAX_LENGHT", () => {
        const points: Array<THREE.Vector3> = new Array<THREE.Vector3>();
        points.push(new THREE.Vector3(-22.5, 17.5, 0));
        const position1: THREE.Vector3 = new THREE.Vector3(-24, -22.6, 0);
        points.push(position1);
        const position2: THREE.Vector3 = new THREE.Vector3(-10.3, -23.3, 0);
        expect(trackValidator.isValid(points, position1, position2).length).toBe(3);
    });

    it("shouldnt accept two segments crossing", () => {
        const points: Array<THREE.Vector3> = new Array<THREE.Vector3>();
        points.push(new THREE.Vector3(-27.7, 24.4, 0));
        points.push(new THREE.Vector3(-28.5, -25, 0));
        points.push(new THREE.Vector3(10, -26, 0));
        const position1: THREE.Vector3 = new THREE.Vector3(12, 6, 0);
        points.push(position1);
        const position2: THREE.Vector3 = new THREE.Vector3(-42, 7.7, 0);
        expect(trackValidator.isValid(points, position1, position2).length).toBe(5);
    });
});
