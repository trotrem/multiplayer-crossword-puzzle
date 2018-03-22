import * as THREE from "three";
import { BoxGeometry, Vector3, Vector } from "three";

interface ILine {
    pos1: THREE.Vector3;
    pos2: THREE.Vector3;
}

export class WallsCollisionsService {

    private _walls: THREE.Line[] = [];

    public createWalls(trackPoints: THREE.Vector3[], trackWidth: number) {
        for (let i: number = 3; i < trackPoints.length; i++) {
            let track1Direction: Vector3 = trackPoints[i - 1].clone().sub(trackPoints[i - 2]);
            let track2Direction: Vector3 = trackPoints[i].clone().sub(trackPoints[i - 1]);
            let exterior1Vector: Vector3 = track1Direction.clone().add(track1Direction.clone().cross(new Vector3(0, 0, 1).multiplyScalar(7)));
            let interior11Vector: Vector3 = track1Direction.clone().add(track1Direction.clone().cross(new Vector3(0, 0, -1).multiplyScalar(7)));
            let exterior2Vector: Vector3 = track1Direction.clone().add(track1Direction.clone().cross(new Vector3(0, 0, 1).multiplyScalar(7)));
            let interior2Vector: Vector3 = track1Direction.clone().add(track1Direction.clone().cross(new Vector3(0, 0, -1).multiplyScalar(7)));

            let exteriorCrossing: Vector3 = 

            
            this._walls.push()
          }
    }
}