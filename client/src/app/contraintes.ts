export class Contraintes {
	//valid : boolean;

  constructor() { }

  private moreThan45Degres(position1: THREE.Vector3, position2: THREE.Vector3, position3: THREE.Vector3): boolean {
    console.log(position1);
    console.log(position2);
    console.log(position3);
    let AB = Math.sqrt(Math.pow(position2.x-position1.x,2)+ Math.pow(position2.y-position1.y,2));    
    let BC = Math.sqrt(Math.pow(position2.x-position3.x,2)+ Math.pow(position2.y-position3.y,2)); 
    let AC = Math.sqrt(Math.pow(position3.x-position1.x,2)+ Math.pow(position3.y-position1.y,2));
    let angle = Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));

    angle = 180 * (angle) / Math.PI;
    
		console.log(angle);
		if(angle < 45)
			return false;
		return true;
	}
	
    public isValid(arrayPoints: THREE.Vector3[], position1: THREE.Vector3, position2: THREE.Vector3): boolean {
      if (arrayPoints.length > 2){
        let position3 = arrayPoints[arrayPoints.length - 2];
      
        if (this.moreThan45Degres(position1, position2, position3)){
          return true;
        }
        return false;
      }
      return true;
	}
}
