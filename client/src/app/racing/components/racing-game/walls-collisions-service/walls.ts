import * as THREE from "three";
import { VectorUtils, ILine } from "../../../race-utils/vector-utils";
import { Injectable } from "@angular/core";

enum WallSide {
    exterior = -1,
    interior = 1
}

const WALL_WIDTH: number = 8;

@Injectable()
export class WallService {
    private _walls: ILine[] = [];

    public get walls(): ILine[] {
        return this._walls;
    }

    public createWalls(trackPoints: THREE.Vector3[]): ILine[] {
        const exteriorWalls: ILine[] = [{ pos1: null, pos2: null }];
        const interiorWalls: ILine[] = [{ pos1: null, pos2: null }];

        const points: THREE.Vector3[] = this.copyPoints(trackPoints);
        points.pop();
        this.setExtIntWalls(exteriorWalls, interiorWalls, points);

        return this._walls;
    }

    private setExtIntWalls(exteriorWalls: ILine[], interiorWalls: ILine[], points: THREE.Vector3[]): void {
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

        return VectorUtils.getIntersection(
            { pos1: firstSegmentCoordinates[0], pos2: firstSegmentCoordinates[1] },
            { pos1: secondSegmentCoordinates[0], pos2: secondSegmentCoordinates[1] }
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
