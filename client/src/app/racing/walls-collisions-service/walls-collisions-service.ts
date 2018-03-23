import * as THREE from "three";
import { RaceUtils } from "../utils/utils";
import { Vector3 } from "three";
import { Car } from "../car/car";

interface ILine {
    pos1: THREE.Vector3;
    pos2: THREE.Vector3;
}

// Sides may be inverted depending on the orientation of the track (clockwise or counter-clockwise)
enum WallSide {
    exterior = -1,
    interior = 1
}

export class WallsCollisionsService {

    private _exteriorwalls: ILine[] = [];
    private _interiorwalls: ILine[] = [];

    private get _walls() {
        return this._exteriorwalls.concat(this._interiorwalls);
    }

    public willCollide(car: Car): boolean {
        return false;
    }

    public createWalls(trackPoints: THREE.Vector3[], trackWidth: number, scene: THREE.Scene) {
        this._exteriorwalls.push({pos1: null, pos2: null});
        this._interiorwalls.push({pos1: null, pos2: null});

        trackPoints.pop();
        for (let i: number = 0; i < trackPoints.length; i++) {
            let interiorCrossing: THREE.Vector3 = this.findWallPairIntersection(trackPoints, i, WallSide.interior);
            let exteriorCrossing: THREE.Vector3 = this.findWallPairIntersection(trackPoints, i, WallSide.exterior);

            this._exteriorwalls[i].pos2 = exteriorCrossing;
            if(i === trackPoints.length - 1) {
                this._exteriorwalls[0].pos1 = exteriorCrossing;
            } else {
                this._exteriorwalls.push({pos1: exteriorCrossing, pos2: null});
            }
            this._interiorwalls[i].pos2 = interiorCrossing;
            if(i === trackPoints.length - 1) {
                this._interiorwalls[0].pos1 = interiorCrossing;
            } else {
                this._interiorwalls.push({pos1: interiorCrossing, pos2: null});
            }
        }

        for (const line of this._walls) {
            var geo = new THREE.Geometry();
            geo.vertices.push( line.pos1 );
            geo.vertices.push( line.pos2 );
            var wallMaterial = new THREE.LineBasicMaterial( { color: 0x00ff88 } );
            
            var wall = new THREE.Line( geo, wallMaterial );
            
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