import * as THREE from 'three';
const MAX_LENGHT: number = 15;
export class Contraintes {
	//valid : boolean;

  constructor() { }

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

  private segmentsIntersection(position1: THREE.Vector3, position2: THREE.Vector3, position3: THREE.Vector3, position4: THREE.Vector3): boolean {
  
    if (position1.equals(position3) || position1.equals(position4) || position2.equals(position3) || position2.equals(position4))
      return false;

    let det = (position2.y - position1.y) * (position3.x - position4.x) - (position4.y - position3.y) * (position1.x - position2.x);
    if (det != 0) {
      let vec = new THREE.Vector3(0, 0, 0);

      vec.x = (((position3.x - position4.x) * ((position2.y - position1.y) * position1.x + (position1.x - position2.x) * position1.y))
        - ((position1.x - position2.x) * ((position4.y - position3.y) * position3.x + (position3.x - position4.x) * position3.y))) / det;

      vec.y = ((position2.y - position1.y) * ((position4.y - position3.y) * position3.x + (position3.x - position4.x) * position3.y)
        - (position4.y - position3.y) * ((position2.y - position1.y) * position1.x + (position1.x - position2.x) * position1.y)) / det;
      
      if (this.findIsInLine(position1, position2, vec) && this.findIsInLine(position3, position4, vec)) {
        return true;
      }
    }
    
    return false;
  }

  private findIsInLine(position1: THREE.Vector3, position2: THREE.Vector3, vec: THREE.Vector3): boolean {
    let precision = 0.0000001;
    let dist1 = Math.sqrt(Math.pow(vec.x - position1.x, 2) + Math.pow(vec.y - position1.y, 2));
    let dist2 = Math.sqrt(Math.pow(position2.x - vec.x, 2) + Math.pow(position2.y - vec.y, 2));
    let distTotal = Math.sqrt(Math.pow(position2.x - position1.x, 2) + Math.pow(position2.y - position1.y, 2));
    
    if (Math.abs(dist1 + dist2 - distTotal) > precision) {
      return false;
    }
    return true;
  }

  private lessThanLenght(position1: THREE.Vector3, position2: THREE.Vector3): boolean {

    let dist = Math.sqrt(Math.pow(position1.x - position2.x, 2) + Math.pow(position1.y - position2.y, 2));
    console.log(dist);
    if (dist < (2 * MAX_LENGHT)) {
      return true
    }

    return false;
  }

  public isValid(arrayPoints: THREE.Vector3[], position1: THREE.Vector3, position2: THREE.Vector3): THREE.Vector3[] {

    let arrayTmp = new Array();
    let reponse = false;

    if (this.lessThanLenght(position1, position2)) {
      let vec = new THREE.Vector3(0, 0, 0);
      console.log(vec);
      arrayTmp.push(vec);
    }

    let index = arrayPoints.indexOf(position1);
    if (index == 0)
      return arrayTmp;

    let position0 = arrayPoints[index - 1];

    if (!this.moreThan45Degres(position2, position1, position0)) {
      if (arrayTmp.length  == 1) {
        arrayTmp.pop();
      }
      arrayTmp.push(position0);
      arrayTmp.push(position1);
    }

    if (position2.equals(arrayPoints[0]) && !this.moreThan45Degres(arrayPoints[1], position2, position1)) {
      if (arrayTmp.length == 1) {
        arrayTmp.pop();
      }
      arrayTmp.push(arrayPoints[1]);
      arrayTmp.push(position2);
    }
    
    for (let i = 0; i < arrayPoints.length - 1; i++) {
      reponse = this.segmentsIntersection(position2, position1, arrayPoints[i], arrayPoints[i + 1]);

      if (reponse) {
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
