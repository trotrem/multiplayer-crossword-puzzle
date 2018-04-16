import * as THREE from "three";
import { RaceUtils, ILine } from "../../../race-utils/race-utils";
import { Car } from "../car/car";
import { Injectable } from "@angular/core";

enum WallSide {
    exterior = -1,
    interior = 1
}

const WALL_WIDTH: number = 8;

@Injectable()
export class WallsCollisionsService {
    private _corners: THREE.Vector3[] = [];

    public getCollisionNormal(car: Car, walls: ILine[]): THREE.Vector3[] {
        const normals: THREE.Vector3[] = [];
        this._corners = car.getCorners(car.getUpdatedPosition().add(car.velocity));
        for (let i: number = 0; i < this._corners.length; i++) {
            for (const wall of walls) {
                if (RaceUtils.doLinesIntersect( { pos1: this._corners[i], pos2: this._corners[(i + 1) % this._corners.length] },
                                                { pos1: wall.pos1, pos2: wall.pos2 })) {
                    normals.push(wall.pos2.clone().sub(wall.pos1).cross(new THREE.Vector3(0, 0, 1)).normalize());
                }
            }
        }

        return normals;
    }
}
