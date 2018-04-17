import { Injectable } from "@angular/core";
import * as THREE from "three";
import { Car } from "./../car/car";
import { TrackDisplay } from "./../trackDisplay/track-display";
import { CARS_MAX } from "../../../../constants";
import { CarsPositionsHandler } from "./../cars-positions-handler/cars-positions-handler";
import {Skybox} from "./skybox";
import { ILine } from "../../../race-utils/vector-utils";

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 2;

@Injectable()
export class SceneGameService {

    private _scene: THREE.Scene;

    public constructor() {
        this._scene = new THREE.Scene;
    }

    public get scene(): THREE.Scene {
        return this._scene;
    }
    public initialize(points: THREE.Vector3[], startingZone: THREE.Line3, cars: Car[], walls: ILine[]): void {
        this.createScene(points, cars, walls);
        for (const car of CarsPositionsHandler.insertCars(startingZone, cars)) {
            this.scene.add(car);
        }
    }

    private showWalls(walls: ILine[]): void {
        for (const line of walls) {
            const geo: THREE.Geometry = new THREE.Geometry();
            geo.vertices.push(line.pos1);
            geo.vertices.push(line.pos2);
            this.scene.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ visible: false })));
        }
    }

    private createScene(points: THREE.Vector3[], cars: Car[], walls: ILine[]): void {
        this._scene = new THREE.Scene();
        const trackMeshs: THREE.Mesh[] = TrackDisplay.drawTrack(points);
        for (const mesh of trackMeshs) {
            this.scene.add(mesh);
        }
        for (let i: number = 0; i < CARS_MAX; i++) {
            this.scene.add(cars[i]);
        }
        this.showWalls(walls);
        points.splice(0, 1, trackMeshs[trackMeshs.length - 1].position);
        this.scene.add(new THREE.AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
        this.scene.add(Skybox.instance.createSkybox());
    }
}
