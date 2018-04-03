import * as THREE from "three";
import { Car } from "../Car"
import { Object3D, Vector2, Vector3 } from "three";
import { Injectable } from "@angular/core";

@Injectable()
export class CarsCollisionService {

    private axes: Vector3[];
    private cars: Car[];

    public constructor(axes: THREE.Vector3[], cars: Car[]) {
        this.axes = axes;
        this.cars = cars
    }

    private setShape(): void {

    }

    private getNormals(): THREE.Vector3 {
        return new THREE.Vector3;
    }

    public checkCarsCollisions(): void {
        /*  TODO:
        *   Step 1: Get the shape of each car
        *   Step 2: Get those normals
        *   Step 3: Check for overlaps for each axes
        *   Step 4: If overlapped, do physics stuff
        */

    }

    private overlap(vector: THREE.Vector3): boolean {
        return true;
    }

    private handleCollisions(): void {

    }
}
