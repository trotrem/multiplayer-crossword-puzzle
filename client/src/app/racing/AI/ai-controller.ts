import { Car } from "../car/car";
import THREE = require("three");
import { Raycaster, Vector3 } from "three";

export class AiController {

    private _car: Car;

    public constructor(car: Car) {
        this._car = car;
    }

    // Called each tick
    private update(): void {

        this._car.isAcceleratorPressed = true;
        // RayCaster
        let rayCasters: THREE.Raycaster[] = new Array<THREE.Raycaster>();
        rayCasters[0] = new THREE.Raycaster(); // Gauche
        rayCasters[1] = new THREE.Raycaster(); // Droite

        rayCasters[0].set(this._car.position.add(this._car.speed.clone().normalize().cross(new Vector3(0, 0, -1)).multiplyScalar(3)), this._car.speed);
        rayCasters[1].set(this._car.position.add(this._car.speed.clone().normalize().cross(new Vector3(0, 0, 1)).multiplyScalar(3)), this._car.speed);

        let walls: THREE.Object3D[];
        let intersects: THREE.Intersection[][] = rayCasters.map((r) => r.intersectObjects(walls));

        for (let i: number = 0; i < intersects.length; i++) {
            if (i === 0 && intersects.length > 0 && intersects[0][0].distance < 0.5) {
                this._car.steerLeft();
            } else if (i === 1 && intersects.length > 0 && intersects[1][0].distance < 0.5) {
                this._car.steerRight();
            }
        }
    }

}

