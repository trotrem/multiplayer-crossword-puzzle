import * as THREE from "three";
const MAX_LENGTH: number = 15;
const PRECISION: number = 0.0000001;
export class Contraints {

  public constructor() {}

  public moreThan45Degres(position1: THREE.Vector3, position2: THREE.Vector3, position3: THREE.Vector3): boolean {
    // disabled tslint in the following lines so it wouldn't trigger on the 2s and the disable tslint comments
    const AB: number = Math.sqrt(Math.pow(position2.x - position1.x, 2) + Math.pow(position2.y - position1.y, 2)); // tslint:disable-line
    const BC: number = Math.sqrt(Math.pow(position2.x - position3.x, 2) + Math.pow(position2.y - position3.y, 2)); // tslint:disable-line
    const AC: number = Math.sqrt(Math.pow(position3.x - position1.x, 2) + Math.pow(position3.y - position1.y, 2)); // tslint:disable-line
    let angle: number = Math.acos((BC * BC + AB * AB - AC * AC)/(2 * BC * AB)); // tslint:disable-line

    const HALF_CIRCLE_DEGREES: number = 180;
    angle = HALF_CIRCLE_DEGREES * (angle) / Math.PI;

    const ANGLE_TRESHOLD: number = 45;
    if (angle < ANGLE_TRESHOLD) {
      return false;
    }

    return true;
  }

  private twoLinesIntersect(
    position1: THREE.Vector3,
    position2: THREE.Vector3,
    position3: THREE.Vector3,
    position4: THREE.Vector3): boolean {

    const intersection: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    if (position1.equals(position3) || position1.equals(position4) || position2.equals(position3) || position2.equals(position4)) {
      return false;
    }

    const det: number = (position2.y - position1.y) * (position3.x - position4.x)
      - (position4.y - position3.y) * (position1.x - position2.x);

    if (det !== 0) {
      intersection.x = (((position3.x - position4.x)
        * ((position2.y - position1.y) * position1.x + (position1.x - position2.x) * position1.y))
        - ((position1.x - position2.x) * ((position4.y - position3.y) * position3.x + (position3.x - position4.x) * position3.y))) / det;

      intersection.y = ((position2.y - position1.y)
        * ((position4.y - position3.y) * position3.x + (position3.x - position4.x) * position3.y)
        - (position4.y - position3.y) * ((position2.y - position1.y) * position1.x
        + (position1.x - position2.x) * position1.y)) / det;

      if (this.findIsInLine(position1, position2, intersection) && this.findIsInLine(position3, position4, intersection)) {
        return true;
      }
    }

    return false;
  }

  private findIsInLine(position1: THREE.Vector3, position2: THREE.Vector3, intersection: THREE.Vector3): boolean {
    // disabled tslint in the following lines so it wouldn't trigger on the 2s and the disable tslint comments
    const dist1 = Math.sqrt(Math.pow(intersection.x - position1.x, 2) + Math.pow(intersection.y - position1.y, 2)); // tslint:disable-line
    const dist2 = Math.sqrt(Math.pow(position2.x - intersection.x, 2) + Math.pow(position2.y - intersection.y, 2)); // tslint:disable-line
    const distTotal = Math.sqrt(Math.pow(position2.x - position1.x, 2) + Math.pow(position2.y - position1.y, 2)); // tslint:disable-line
    if (Math.abs(dist1 + dist2 - distTotal) > PRECISION) {
      return false;
    }

    return true;
  }

  private lessThanLength(position1: THREE.Vector3, position2: THREE.Vector3): boolean {
    // disabled tslint in the following lines so it wouldn't trigger on the 2s and the disable tslint comments
    const dist: number = Math.sqrt(Math.pow(position1.x - position2.x, 2) + Math.pow(position1.y - position2.y, 2)); // tslint:disable-line
    if (dist < (MAX_LENGTH * 2)) { // tslint:disable-line:no-magic-numbers
      return true;
    }

    return false;
  }

  public isValid(arrayPoints: THREE.Vector3[], position1: THREE.Vector3, position2: THREE.Vector3): THREE.Vector3[] {
    const arrayTmp: Array<THREE.Vector3> = new Array<THREE.Vector3>();
    let answer: boolean = false;
    const index: number = arrayPoints.indexOf(position1);
    // contraint about the segment must not be less than two time the lenght
    if (this.lessThanLength(position1, position2)) {
      const vec: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
      arrayTmp.push(vec);
    }
    if (index === 0) {
      return arrayTmp;
    }

    const position0: THREE.Vector3 = arrayPoints[index - 1];

    // contraint about the angle
    if (!this.moreThan45Degres(position2, position1, position0)) { // contraint about the angle
      if (arrayTmp.length  === 1) {
        arrayTmp.pop();
      }
      arrayTmp.push(position0);
      arrayTmp.push(position1);
    }
    // contraint about the angle when the track is close
    if (position2.equals(arrayPoints[0]) && !this.moreThan45Degres(arrayPoints[1], position2, position1)) {
      if (arrayTmp.length === 1) {
        arrayTmp.pop();
      }
      arrayTmp.push(arrayPoints[1]);
      arrayTmp.push(position2);
    }

    for (let i: number = 0; i < arrayPoints.length - 1; i++) {
      answer = this.twoLinesIntersect(position2, position1, arrayPoints[i], arrayPoints[i + 1]);

      if (answer) {
        if (arrayTmp.length === 1) {
          arrayTmp.pop();
        }
        arrayTmp.push(arrayPoints[i]);
        arrayTmp.push(arrayPoints[i + 1]);
      }
    }

    return arrayTmp;
  }
}
