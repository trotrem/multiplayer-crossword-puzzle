export class Contraintes {
	//valid : boolean;

  constructor() { }

  private moreThan45Degres(position1: THREE.Vector3, position2: THREE.Vector3, position3: THREE.Vector3): boolean {
    console.log(position1);
    console.log(position2);
    console.log(position3);
    let angle1 = Math.atan2(position1.y - position2.y, position1.x - position2.x);
    let angle2 = Math.atan2(position2.y - position3.y, position2.x - position3.x);
    
    let angle = Math.abs(angle1 - angle2);
    
    angle = 180 * (angle) / Math.PI;
    
      angle = Math.abs(180 - angle);
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
