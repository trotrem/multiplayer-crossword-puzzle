import * as THREE from "three";
import { Car } from "../Car"
import { Object3D } from "three";

const OBJECT_SIZE: number = 0.5
export class CarsCollision {

    private objects: THREE.Object3D = new THREE.Object3D;

    public constructor(private raycaster: THREE.Raycaster = new THREE.Raycaster()) {
    }

    public setCars(): void {

    }

    public checkCarsCollision(car: Car): void {
        //console.log("checking");
        for (let vIndex: number = 0; vIndex < car.getCorners(car.getUpdatedPosition()).length; vIndex++) {
            let localVertex = car.getCorners(car.getUpdatedPosition())[vIndex];
            let globalVertex = localVertex.applyMatrix4(car.mesh.matrix);
            let directionVector = globalVertex.sub(car.getUpdatedPosition());
            let angle = car.velocity.angleTo(directionVector);

            if (angle <= Math.PI / 2) {
                this.raycaster.set(car.mesh.position, directionVector.clone().normalize());
                let collisionResults = this.raycaster.intersectObjects(this.objects.children)
                console.log("existe?")
                if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                    this.handleCarsCollision(car, collisionResults[0]);
                    break;
                }
            }
        }
    }

    public handleCarsCollision(carA: Car, collisionResult: THREE.Intersection): void {
        //let carB: Car = collisionResult.object;
        console.log("handling");
        let masses: number = carA.Mass + 1500;
        let avX = (carA.velocity.x * (carA.Mass - 5) + (2 * 1500 * 2)) / masses;
        let avY = (carA.velocity.y * (carA.Mass - 5) + (2 * 1500 * 2)) / masses;
        let avZ = (carA.velocity.z * (carA.Mass - 5) + (2 * 1500 * 2)) / masses;
        //let bvX = 5 + (2 * carA.Mass * carA.velocity.x)) / masses;
        //let bvY = 5 + (2 * carA.Mass * carA.velocity.y)) / masses;
        //let bvZ = (carB.velocity.z * (carB.Mass - 5) + (2 * carA.Mass * carA.velocity.z)) / masses;

        carA.velocity.set(avX, avY, avZ);
        //carB.velocity.set(bvX, bvY, bvZ);
    }

   /* public updateCollision(): void {
        for (var i = 0; i < this.objects.children.length; i++) {
            var mesh = this.objects.children[i];
     
        }
    }*/

}

