import { Injectable } from "@angular/core";
import * as THREE from "three";
import { ILine } from "./../walls-collisions-service/walls-collisions-service";
import { Track } from "./../../../track";
import { Car } from "./../car/car";
import { TrackDisplay } from "./../trackDisplay/track-display";
import { CARS_MAX } from "../../../../constants";
import { CarsPositionsHandler } from "./../cars-positions-handler/cars-positions-handler";

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
    public initialize(track: Track, cars: Car[], walls: ILine[]): void {
        this.createScene(track, cars, walls);
        CarsPositionsHandler.insertCars(track.startingZone, this.scene, cars);

    }

    private showWalls(walls: ILine[]): void {
        for (const line of walls) {
            const geo: THREE.Geometry = new THREE.Geometry();
            geo.vertices.push(line.pos1);
            geo.vertices.push(line.pos2);
            this.scene.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ visible: false })));
        }
    }

    private createScene(track: Track, cars: Car[], walls: ILine[]): void {
        this._scene = new THREE.Scene();
        const trackMeshs: THREE.Mesh[] = TrackDisplay.drawTrack(track.points);
        for (const mesh of trackMeshs) {
            this.scene.add(mesh);
        }
        for (let i: number = 0; i < CARS_MAX; i++) {
            this.scene.add(cars[i]);
        }
        this.showWalls(walls);
        track.points.splice(0, 1, trackMeshs[trackMeshs.length - 1].position);
        this.scene.add(new THREE.AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
    }

}
