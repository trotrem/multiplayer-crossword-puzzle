import * as THREE from 'three';
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

  public isValid(arrayPoints: THREE.Vector3[], position1: THREE.Vector3, position2: THREE.Vector3): boolean {
    let index = arrayPoints.indexOf(position2);
    if (index == 0)
      return true

    let position3 = arrayPoints[index - 1];
  
    if (!this.moreThan45Degres(position1, position2, position3)){
      return false;
    }

    for (let i = 0; i < arrayPoints.length-1; i++) {
      if(this.segmentsIntersection(position1, position2, arrayPoints[i], arrayPoints[i + 1]))
        return false;
    }

    return true;
	}
}
