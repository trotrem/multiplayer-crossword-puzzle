import * as THREE from "three";
import { RaceUtils } from "../utils/utils";
import { Vector3, LineBasicMaterial } from "three";
import { Car } from "../car/car";
import { ILine } from "../dataStructures";

// Sides may be inverted depending on the orientation of the track (clockwise or counter-clockwise)
enum WallSide {
    exterior = -1,
    interior = 1
}

export class WallsCollisionsService {

    private _walls: ILine[] = [];
    private _raycaster: THREE.Raycaster = new THREE.Raycaster();
    private _intersects: THREE.Intersection[] = [];

    constructor(private _scene: THREE.Scene) {

    }

    public willCollide(car: Car): boolean {
        let corners: Vector3[] = car.getCorners(car.getUpdatedPosition());
        for (let i: number = 0; i < corners.length; i++) {
            for (const wall of this._walls) {
                if (RaceUtils.linesCross(corners[i], corners[(i + 1) % corners.length], wall.pos1, wall.pos2)) {
                    return true;
                }
            }
        }
        return false;
    }

    public createWalls(trackPoints: THREE.Vector3[], trackWidth: number, scene: THREE.Scene) {
        let exteriorWalls: ILine[] = [{pos1: null, pos2: null}];
        let interiorWalls: ILine[] = [{pos1: null, pos2: null}];

        trackPoints.pop();
        for (let i: number = 0; i < trackPoints.length; i++) {
            let interiorCrossing: THREE.Vector3 = this.findWallPairIntersection(trackPoints, i, WallSide.interior);
            let exteriorCrossing: THREE.Vector3 = this.findWallPairIntersection(trackPoints, i, WallSide.exterior);

            exteriorWalls[i].pos2 = exteriorCrossing;
            if(i === trackPoints.length - 1) {
                exteriorWalls[0].pos1 = exteriorCrossing;
            } else {
                exteriorWalls.push({pos1: exteriorCrossing, pos2: null});
            }
            interiorWalls[i].pos2 = interiorCrossing;
            if(i === trackPoints.length - 1) {
                interiorWalls[0].pos1 = interiorCrossing;
            } else {
                interiorWalls.push({pos1: interiorCrossing, pos2: null});
            }
        }

        for (const line of interiorWalls.concat(exteriorWalls)) {
            var geo = new THREE.Geometry();
            geo.vertices.push( line.pos1 );
            geo.vertices.push( line.pos2 );
            var wallMaterial = new THREE.LineBasicMaterial( { color: 0x00ff88 } );
            
            var wall = new THREE.Line( geo, wallMaterial );
            this._walls.push(line);

            scene.add( wall );
        }
    }

    private findWallPairIntersection(trackPoints: THREE.Vector3[], i: number, wallSide: WallSide): Vector3 {
            let firstSegmentCoordinates: THREE.Vector3[] = this.trackToWallCoordinates(trackPoints.slice(i, i + 1).concat(trackPoints[(i + 1) % trackPoints.length]), wallSide);
            const loopingIndex: number = (i + 1) % trackPoints.length;
            let secondSegmentCoordinates: THREE.Vector3[] = this.trackToWallCoordinates(trackPoints.slice(loopingIndex, loopingIndex + 1).concat(trackPoints[(i + 2) % trackPoints.length]), wallSide);
            
            return RaceUtils.twoLinesIntersection(firstSegmentCoordinates[0], firstSegmentCoordinates[1], secondSegmentCoordinates[0], secondSegmentCoordinates[1]);
    }

    private trackToWallCoordinates(trackSegmentPoints: THREE.Vector3[], wallSide: WallSide): THREE.Vector3[] {
        let wallCoordinates: THREE.Vector3[] = []
        let segmentDirection: THREE.Vector3 = trackSegmentPoints[1].clone().sub(trackSegmentPoints[0]).normalize();
        wallCoordinates.push(trackSegmentPoints[0].clone().add(segmentDirection.clone().cross(new THREE.Vector3(0, 0, wallSide)).multiplyScalar(8)));
        wallCoordinates.push(trackSegmentPoints[1].clone().add(segmentDirection.clone().cross(new THREE.Vector3(0, 0, wallSide)).multiplyScalar(8)));
        
        return wallCoordinates;
    }
}