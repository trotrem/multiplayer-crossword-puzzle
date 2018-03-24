import * as THREE from "three";
import { RaceUtils } from "../utils/utils";
import { Car } from "../car/car";
import { ILine } from "../dataStructures";

// Sides may be inverted depending on the orientation of the track (clockwise or counter-clockwise)
enum WallSide {
  exterior = -1,
  interior = 1
}

const WALL_COLOR: number = 0x00FF88;
const WALL_WIDTH: number = 8;

export class WallsCollisionsService {
  private _walls: ILine[] = [];
  private _raycaster: THREE.Raycaster = new THREE.Raycaster();
  private _intersects: THREE.Intersection[] = [];

  public constructor(private _scene: THREE.Scene) {}

  public willCollide(car: Car): boolean {
    const corners: THREE.Vector3[] = car.getCorners(car.getUpdatedPosition());
    for (let i: number = 0; i < corners.length; i++) {
      for (const wall of this._walls) {
        if (
          RaceUtils.linesCross(
            corners[i],
            corners[(i + 1) % corners.length],
            wall.pos1,
            wall.pos2
          )
        ) {
          return true;
        }
      }
    }

    return false;
  }

  public createWalls(
    trackPoints: THREE.Vector3[],
    scene: THREE.Scene
  ): void {
    const exteriorWalls: ILine[] = [{ pos1: null, pos2: null }];
    const interiorWalls: ILine[] = [{ pos1: null, pos2: null }];

    trackPoints.pop();
    for (let i: number = 0; i < trackPoints.length; i++) {
      const interiorCrossing: THREE.Vector3 = this.findWallPairIntersection(trackPoints, i, WallSide.interior);
      const exteriorCrossing: THREE.Vector3 = this.findWallPairIntersection(trackPoints, i, WallSide.exterior);

      exteriorWalls[i].pos2 = exteriorCrossing;
      if (i === trackPoints.length - 1) {
        exteriorWalls[0].pos1 = exteriorCrossing;
      } else {
        exteriorWalls.push({ pos1: exteriorCrossing, pos2: null });
      }
      interiorWalls[i].pos2 = interiorCrossing;
      if (i === trackPoints.length - 1) {
        interiorWalls[0].pos1 = interiorCrossing;
      } else {
        interiorWalls.push({ pos1: interiorCrossing, pos2: null });
      }
    }

    this.showWalls(interiorWalls.concat(exteriorWalls), scene);
  }

  private showWalls(walls: ILine[], scene: THREE.Scene): void {
    for (const line of walls) {
        const geo: THREE.Geometry = new THREE.Geometry();
        geo.vertices.push(line.pos1);
        geo.vertices.push(line.pos2);
        const wallMaterial: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({ color: WALL_COLOR });

        const wall: THREE.Line = new THREE.Line(geo, wallMaterial);
        this._walls.push(line);

        scene.add(wall);
      }
  }

  private findWallPairIntersection(
    trackPoints: THREE.Vector3[],
    i: number,
    wallSide: WallSide
  ): THREE.Vector3 {
    const firstSegmentCoordinates: THREE.Vector3[] = this.trackToWallCoordinates(
      trackPoints
        .slice(i, i + 1)
        .concat(trackPoints[(i + 1) % trackPoints.length]),
      wallSide
    );
    const loopingIndex: number = (i + 1) % trackPoints.length;
    const secondSegmentCoordinates: THREE.Vector3[] = this.trackToWallCoordinates(
      trackPoints
        .slice(loopingIndex, loopingIndex + 1)
        .concat(trackPoints[(i + 2) % trackPoints.length]),
      wallSide
    );

    return RaceUtils.twoLinesIntersection(
      firstSegmentCoordinates[0],
      firstSegmentCoordinates[1],
      secondSegmentCoordinates[0],
      secondSegmentCoordinates[1]
    );
  }

  private trackToWallCoordinates(
    trackSegmentPoints: THREE.Vector3[],
    wallSide: WallSide
  ): THREE.Vector3[] {
    const wallCoordinates: THREE.Vector3[] = [];
    const segmentDirection: THREE.Vector3 = trackSegmentPoints[1]
      .clone()
      .sub(trackSegmentPoints[0])
      .normalize();
    wallCoordinates.push(
      trackSegmentPoints[0].clone().add(
        segmentDirection
          .clone()
          .cross(new THREE.Vector3(0, 0, wallSide))
          .multiplyScalar(WALL_WIDTH)
      )
    );
    wallCoordinates.push(
      trackSegmentPoints[1].clone().add(
        segmentDirection
          .clone()
          .cross(new THREE.Vector3(0, 0, wallSide))
          .multiplyScalar(WALL_WIDTH)
      )
    );

    return wallCoordinates;
  }
}
