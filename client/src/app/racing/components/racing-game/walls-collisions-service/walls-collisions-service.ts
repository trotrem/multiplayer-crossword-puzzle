import * as THREE from "three";
import { RaceUtils, ILine } from "../../../race-utils/race-utils";
import { Car } from "../car/car";
import { Injectable } from "@angular/core";

// Sides may be inverted depending on the orientation of the track (clockwise or counter-clockwise)
enum WallSide {
    exterior = -1,
    interior = 1
}

const WALL_WIDTH: number = 8;

@Injectable()
export class WallsCollisionsService {
    private _walls: ILine[] = [];
    private _corners: THREE.Vector3[] = [];

    /* REFACTOR */
    public getCollisionNormal(car: Car): THREE.Vector3[] {
        const normals: THREE.Vector3[] = [];
        this._corners = car.getCorners(car.getUpdatedPosition().add(car.velocity));
        for (let i: number = 0; i < this._corners.length; i++) {
            for (const wall of this._walls) {
                if (RaceUtils.doLinesIntersect({pos1: this._corners[i], pos2: this._corners[(i + 1) % this._corners.length]},
                                               {pos1: wall.pos1, pos2: wall.pos2})) {
                    normals.push(wall.pos2.clone().sub(wall.pos1).cross(new THREE.Vector3(0, 0, 1)).normalize());
                }
            }
        }

        return normals;
    }

    public createWalls(trackPoints: THREE.Vector3[]): ILine[] {
        const exteriorWalls: ILine[] = [{ pos1: null, pos2: null }];
        const interiorWalls: ILine[] = [{ pos1: null, pos2: null }];

        const points: THREE.Vector3[] = this.copyPoints(trackPoints);
        points.pop();

        for (let i: number = 0; i < points.length; i++) {
            const interiorCrossing: THREE.Vector3 = this.findWallPairIntersection(points, i, WallSide.interior);
            const exteriorCrossing: THREE.Vector3 = this.findWallPairIntersection(points, i, WallSide.exterior);

            exteriorWalls[i].pos2 = exteriorCrossing;
            interiorWalls[i].pos2 = interiorCrossing;
            if (i === points.length - 1) {
                exteriorWalls[0].pos1 = exteriorCrossing;
                interiorWalls[0].pos1 = interiorCrossing;
            } else {
                exteriorWalls.push({ pos1: exteriorCrossing, pos2: null });
                interiorWalls.push({ pos1: interiorCrossing, pos2: null });
            }
        }

        this._walls = interiorWalls.concat(exteriorWalls);

        return this._walls;
    }

    private copyPoints(points: THREE.Vector3[]): THREE.Vector3[] {
        const newPoints: THREE.Vector3[] = [];
        for (const point of points) {
            newPoints.push(new THREE.Vector3(point.x, point.y));
        }

        return newPoints;
    }

    private findWallPairIntersection(trackPoints: THREE.Vector3[], i: number, wallSide: WallSide): THREE.Vector3 {
        const firstSegmentCoordinates: THREE.Vector3[] = this.trackToWallCoordinates(
            trackPoints
                .slice(i, i + 1)
                .concat(trackPoints[(i + 1) % trackPoints.length]),
            wallSide
        );
        const secondSegmentCoordinates: THREE.Vector3[] = this.trackToWallCoordinates(
            trackPoints
                .slice((i + 1) % trackPoints.length, (i + 1) % trackPoints.length + 1)
                .concat(trackPoints[(i + 2) % trackPoints.length]),
            wallSide
        );

        return RaceUtils.getTwoLinesIntersection(
            {pos1: firstSegmentCoordinates[0], pos2: firstSegmentCoordinates[1]},
            {pos1: secondSegmentCoordinates[0], pos2: secondSegmentCoordinates[1]}
        );
    }

    private trackToWallCoordinates(trackSegmentPoints: THREE.Vector3[], wallSide: WallSide): THREE.Vector3[] {
        const wallCoordinates: THREE.Vector3[] = [];
        const segmentDirection: THREE.Vector3 = trackSegmentPoints[1].clone().sub(trackSegmentPoints[0]).normalize();
        wallCoordinates.push(trackSegmentPoints[0].clone()
            .add(segmentDirection.clone().cross(new THREE.Vector3(0, 0, wallSide)).multiplyScalar(WALL_WIDTH)));

        wallCoordinates.push(trackSegmentPoints[1].clone()
            .add(segmentDirection.clone().cross(new THREE.Vector3(0, 0, wallSide)).multiplyScalar(WALL_WIDTH)));

        return wallCoordinates;
    }
}
