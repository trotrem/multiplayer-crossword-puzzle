import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import * as THREE from "three";
import { Car } from "../car/car";
import { CarsPositionsHandler } from "../cars-positions-handler/cars-positions-handler";
import { OrthographicCamera } from "../camera/topView-camera";
import { PerspectiveCamera } from "../camera/rearView-camera";
import { TrackDisplay } from "./../trackDisplay/track-display";
import { ILine } from "../walls-collisions-service/walls-collisions-service";
import { CARS_MAX } from "../constants";
import { Track } from "../../../track";

const ZOOM_FACTOR: number = 0.05;
const ZOOM_MAX: number = 2;
const ZOOM_MIN: number = 0.75;

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 2;
// const INITIAL_AXISHELPER: number = 6;
const RED: number = 0xFF0000;

@Injectable()
export class RenderService {
    private cameras: [PerspectiveCamera, OrthographicCamera] = [null, null];
    private container: HTMLDivElement;
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private stats: Stats;
    private cameraID: number;

    public constructor() {
        this.cameraID = 0;
    }
    public getScene(): THREE.Scene {
        return this.scene;
    }
    public getTopCamera(): OrthographicCamera {
        return this.cameras[1];
    }
    public getRearCamera(): PerspectiveCamera {
        return this.cameras[0];
    }

    public initialize(container: HTMLDivElement, track: Track, cars: Car[], walls: ILine[]): void {
        if (container) {
            this.container = container;
        }
        this.createScene(track, cars, walls);
        CarsPositionsHandler.insertCars(track.startingZone, this.scene, cars);
        this.initStats();

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        this.cameras[0].up.set(0, 0, 1);
    }

    private initStats(): void {
        this.stats = new Stats();
        this.stats.dom.style.position = "absolute";
        this.container.appendChild(this.stats.dom);
    }

    private createSkyBox(): void {
        /* const loader: THREE.CubeTextureLoader = new THREE.CubeTextureLoader();
         const path: string = "../../assets/camero/clouds/";
         const format: string = ".png";
         const urls: string[] = [
             path + "posx" + format,
             path + "negx" + format,
             path + "posy" + format,
             path + "negy" + format,
             path + "posz" + format,
             path + "negz" + format
         ];
         const textureSky: THREE.CubeTexture = loader.load(urls);
         const skyMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
             color: 0xffffff,
             envMap: textureSky,
             side: THREE.BackSide
         });
 
         const skyGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(300, 200, 100);
         const skyMesh: THREE.Mesh = new THREE.Mesh(skyGeometry, skyMaterial);
         this.scene.add(skyMesh);*/
        const skyMaterials: THREE.MeshBasicMaterial[] = [
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./../../assets/models/Day-Front.jpg"),
                side: THREE.DoubleSide
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./../../assets/models/Day-Back.jpg"),
                side: THREE.DoubleSide
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./../../assets/models/Day-Ceilling.jpg"),
                side: THREE.DoubleSide
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./../../assets/models/Day-Bottom.jpg"),
                side: THREE.DoubleSide
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./../../assets/models/Day-Right.jpg"),
                side: THREE.DoubleSide
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./../../assets/models/Day-Left.jpg"),
                side: THREE.DoubleSide
            })];
        const skyMaterial: THREE.MeshFaceMaterial = new THREE.MeshFaceMaterial(skyMaterials);
        const skyGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(100000, 100000, 100000);
        const skyMesh: THREE.Mesh = new THREE.Mesh(skyGeometry, skyMaterial);
        skyMesh.rotateZ(Math.PI / 2);
        skyMesh.rotateX(Math.PI / 2);
        skyMesh.translate(20, new THREE.Vector3(0, 1, 0));
        this.scene.add(skyMesh);
    }

    private createScene(track: Track, cars: Car[], walls: ILine[]): void {
        this.scene = new THREE.Scene();
        this.cameras[0] = new PerspectiveCamera();
        this.cameras[1] = new OrthographicCamera();
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
        this.createSkyBox();
    }
    private getAspectRatio(): number {
        return this.container.clientWidth / this.container.clientHeight;
    }
    public render(player: Car): void {
        if (this.cameraID === 0) {
            this.cameras[0].updatePosition(player);
        } else {
            this.cameras[1].updatePosition(player.getUpdatedPosition());
        }
        this.renderer.render(this.scene, this.cameras[this.cameraID]);
        this.stats.update();
    }
    public onResize(): void {
        if (this.cameraID === 0) {
            this.cameras[0].aspect = this.getAspectRatio();
            this.cameras[0].updateProjectionMatrix();
        } else {
            this.cameras[1].left = this.cameras[1].bottom * (this.getAspectRatio());
            this.cameras[1].right = this.cameras[1].top * (this.getAspectRatio());
            this.cameras[1].updateProjectionMatrix();
        }
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    }

    public get CameraID(): number {
        return this.cameraID;
    }

    public get TopCamera(): OrthographicCamera {
        return this.cameras[1];
    }

    public get RearCamera(): PerspectiveCamera {
        return this.cameras[0];
    }

    public toggleCamera(): void {
        this.cameraID = (this.cameraID === 1) ? 0 : 1;
    }

    public zoomIn(): void {
        for (let i: number = 0; i < 2; i++) {
            if (this.cameras[i].zoom < ZOOM_MAX) {
                this.cameras[i].zoom += ZOOM_FACTOR;
            }
        }
    }

    public zoomOut(): void {
        for (let i: number = 0; i < 2; i++) {
            if (this.cameras[i].zoom > ZOOM_MIN) {
                this.cameras[i].zoom -= ZOOM_FACTOR;
            }
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
}
