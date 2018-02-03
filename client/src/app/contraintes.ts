import * as THREE from 'three';
const MAX_LENGHT: number = 15;
const PRECISION = 0.0000001;
export class Contraintes {
	

  constructor() {}
    

  private moreThan45Degres(position1: THREE.Vector3, position2: THREE.Vector3, position3: THREE.Vector3): boolean {
    let AB = Math.sqrt(Math.pow(position2.x-position1.x,2)+ Math.pow(position2.y-position1.y,2));    
    let BC = Math.sqrt(Math.pow(position2.x-position3.x,2)+ Math.pow(position2.y-position3.y,2)); 
    let AC = Math.sqrt(Math.pow(position3.x-position1.x,2)+ Math.pow(position3.y-position1.y,2));
    let angle = Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));

    angle = 180 * (angle) / Math.PI;
    
		if(angle < 45)
			return false;
		return true;
	}

  private twoLinesIntersect(position1: THREE.Vector3, position2: THREE.Vector3, position3: THREE.Vector3, position4: THREE.Vector3): boolean {

    let intersection = new THREE.Vector3(0, 0, 0);
    if (position1.equals(position3) || position1.equals(position4) || position2.equals(position3) || position2.equals(position4))
      return false;

    let det = (position2.y - position1.y) * (position3.x - position4.x) - (position4.y - position3.y) * (position1.x - position2.x);
    if (det != 0) {
      intersection.x = (((position3.x - position4.x) * ((position2.y - position1.y) * position1.x + (position1.x - position2.x) * position1.y))
        - ((position1.x - position2.x) * ((position4.y - position3.y) * position3.x + (position3.x - position4.x) * position3.y))) / det;

      intersection.y = ((position2.y - position1.y) * ((position4.y - position3.y) * position3.x + (position3.x - position4.x) * position3.y)
        - (position4.y - position3.y) * ((position2.y - position1.y) * position1.x + (position1.x - position2.x) * position1.y)) / det;
      
      if (this.findIsInLine(position1, position2, intersection) && this.findIsInLine(position3, position4, intersection)) {
        return true;
      }
    }
    return false;
  }

  private findIsInLine(position1: THREE.Vector3, position2: THREE.Vector3, intersection: THREE.Vector3): boolean {
    let dist1 = Math.sqrt(Math.pow(intersection.x - position1.x, 2) + Math.pow(intersection.y - position1.y, 2));
    let dist2 = Math.sqrt(Math.pow(position2.x - intersection.x, 2) + Math.pow(position2.y - intersection.y, 2));
    let distTotal = Math.sqrt(Math.pow(position2.x - position1.x, 2) + Math.pow(position2.y - position1.y, 2));
    if (Math.abs(dist1 + dist2 - distTotal) > PRECISION) {
      return false;
    }
    return true;
  }

  private lessThanLenght(position1: THREE.Vector3, position2: THREE.Vector3): boolean {

    let dist = Math.sqrt(Math.pow(position1.x - position2.x, 2) + Math.pow(position1.y - position2.y, 2));
    if (dist < (2 * MAX_LENGHT)) {
      return true
    }
    return false;
  }

  public isValid(arrayPoints: THREE.Vector3[], position1: THREE.Vector3, position2: THREE.Vector3): THREE.Vector3[] {

    let arrayTmp = new Array();
    let answer = false;
    let index = arrayPoints.indexOf(position1);
    //contraint about the segment must not be less than two time the lenght
    if (this.lessThanLenght(position1, position2)) { 
      let vec = new THREE.Vector3(0, 0, 0);
      arrayTmp.push(vec);
    }
    if (index == 0)
      return arrayTmp;
    let position0 = arrayPoints[index - 1];

    //contraint about the angle
    if (!this.moreThan45Degres(position2, position1, position0)) { //contraint about the angle
      if (arrayTmp.length  == 1) {
        arrayTmp.pop();
      }
      arrayTmp.push(position0);
      arrayTmp.push(position1);
    }
    //contraint about the angle when the track is close
    if (position2.equals(arrayPoints[0]) && !this.moreThan45Degres(arrayPoints[1], position2, position1)) { 
      if (arrayTmp.length == 1) {
        arrayTmp.pop();
      }
      arrayTmp.push(arrayPoints[1]);
      arrayTmp.push(position2);
    }
    //
    for (let i = 0; i < arrayPoints.length - 1; i++) {
      answer = this.twoLinesIntersect(position2, position1, arrayPoints[i], arrayPoints[i + 1]);

      if (answer) {
        if (arrayTmp.length ==1) {
          arrayTmp.pop();
        }
        arrayTmp.push(arrayPoints[i]);
        arrayTmp.push(arrayPoints[i + 1]);
      }
    }

    return arrayTmp;
  }
}
