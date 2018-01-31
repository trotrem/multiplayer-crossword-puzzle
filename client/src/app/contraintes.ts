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
	
    public isValid(arrayPoints: THREE.Vector3[], position1: THREE.Vector3, position2: THREE.Vector3): boolean {
      let index = arrayPoints.indexOf(position2);
      if (index == 0)
        return true

      let position3 = arrayPoints[index - 1];
    
      if (this.moreThan45Degres(position1, position2, position3)){
        return true;
      }
      return false;
	}
}
