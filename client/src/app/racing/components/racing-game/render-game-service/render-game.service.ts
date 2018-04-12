import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import * as THREE from "three";
import { Car } from "../car/car";
import { OrthographicCamera } from "../camera/topView-camera";
import { PerspectiveCamera } from "../camera/rearView-camera";
import { ILine } from "../walls-collisions-service/walls-collisions-service";
import { Track } from "../../../track";
import { KeyboardService } from "../commands/keyboard.service";
import * as Command from "../commands/concrete-commands/headers";
import * as KeyCode from "../commands/key-code";
import { SceneGameService } from "../scene-game-service/scene-game-service.service";

const ZOOM_FACTOR: number = 0.05;
const ZOOM_MAX: number = 2;
const ZOOM_MIN: number = 0.75;

@Injectable()
export class RenderGameService {
    private cameras: [PerspectiveCamera, OrthographicCamera] = [null, null];
    private canvas: HTMLCanvasElement;
    private renderer: THREE.WebGLRenderer;
    private stats: Stats;
    private cameraID: number;

    public constructor(private keyboard: KeyboardService, private sceneGameService: SceneGameService) {
        this.cameraID = 0;
    }
    public getTopCamera(): OrthographicCamera {
        return this.cameras[1];
    }
    public getRearCamera(): PerspectiveCamera {
        return this.cameras[0];
    }

    public initialize(canvas: HTMLCanvasElement, track: Track, cars: Car[], walls: ILine[]): void {
        if (canvas) {
            this.canvas = canvas;
        }
        this.sceneGameService.initialize(track, cars, walls);

        this.initStats();
        this.initalizeCamera();
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.initCameraCommands();
    }

    private initalizeCamera(): void {
        this.cameras[0] = new PerspectiveCamera();
        this.cameras[1] = new OrthographicCamera();
        this.cameras[0].up.set(0, 0, 1);
    }

    private initStats(): void {
        this.stats = new Stats();
        this.stats.dom.style.position = "absolute";
        this.canvas.appendChild(this.stats.dom);
    }
    private getAspectRatio(): number {
        return this.canvas.clientWidth / this.canvas.clientHeight;
    }
    public render(player: Car): void {
        if (this.cameraID === 0) {
            this.cameras[0].updatePosition(player);
        } else {
            this.cameras[1].updatePosition(player.getUpdatedPosition());
        }
        this.renderer.render(this.sceneGameService.scene, this.cameras[this.cameraID]);
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
        this.renderer.setSize(window.innerWidth,  window.innerHeight);

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
    public initCameraCommands(): void {
        this.keyboard.addCommand(KeyCode.ZOOM_IN_KEYCODE, new Command.ZoomInCommand(this));
        this.keyboard.addCommand(KeyCode.ZOOM_OUT_KEYCODE, new Command.ZoomOutCommand(this));
        this.keyboard.addCommand(KeyCode.SWITCH_CAMERA_KEYCODE, new Command.SwitchCameraCommand(this));
    }

}
