import * as THREE from "three";
import { VectorUtils} from "../../race-utils/vector-utils";
import { Car } from "../../components/racing-game/car/car";
import { Injectable } from "@angular/core";
import { WallService } from "./walls";

@Injectable()
export class WallsCollisionsService {
    public constructor(private wallsService: WallService) {

    }
    public getCollisionNormal(car: Car): THREE.Vector3[] {
        const normals: THREE.Vector3[] = [];
        const corners: THREE.Vector3[] = car.getCorners(car.getUpdatedPosition().add(car.velocity));
        for (let i: number = 0; i < corners.length; i++) {
            for (const wall of this.wallsService.walls) {
                if (VectorUtils.doLinesIntersect(
                    { pos1: corners[i], pos2: corners[(i + 1) % corners.length] },
                    { pos1: wall.pos1, pos2: wall.pos2 })) {
                    normals.push(wall.pos2.clone().sub(wall.pos1).cross(new THREE.Vector3(0, 0, 1)).normalize());
                }
            }
        }

        return normals;
    }
}
