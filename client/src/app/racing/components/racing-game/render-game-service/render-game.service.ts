import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import * as THREE from "three";
import { Car } from "../car/car";
import { OrthographicCamera } from "../camera/topView-camera";
import { PerspectiveCamera } from "../camera/rearView-camera";
import { KeyboardEventService } from "../commands/keyboard-event.service";
import * as Command from "../commands/command";
import * as KeyCode from "../commands/key-code";
import { SceneGameService } from "../scene-game-service/scene-game-service.service";
import { RenderService } from "../../render.service/render.service";
import { ILine } from "../../../race-utils/vector-utils";

const ZOOM_FACTOR: number = 0.05;
const ZOOM_MAX: number = 2;
const ZOOM_MIN: number = 0.75;

@Injectable()
export class RenderGameService extends RenderService {
    private cameras: [PerspectiveCamera, OrthographicCamera] = [null, null];
    private stats: Stats;
    private cameraID: number;

    public constructor( private sceneGameService: SceneGameService) {
        super();
        this.cameraID = 0;
    }
    public getTopCamera(): OrthographicCamera {
        return this.cameras[1];
    }
    public getRearCamera(): PerspectiveCamera {
        return this.cameras[0];
    }

    public initialize(canvas: HTMLCanvasElement, points: THREE.Vector3[], startingZone: THREE.Line3,
                      cars: Car[], walls: ILine[], keyboard: KeyboardEventService): void {
        super.initializeSuper(canvas);
        this.sceneGameService.initialize(points, startingZone, cars, walls);

        // this.initStats();
        this.initializeCamera();
        this.initCameraCommands(keyboard);
    }

    private initializeCamera(): void {
        this.cameras[0] = new PerspectiveCamera();
        this.cameras[1] = new OrthographicCamera();
        this.cameras[0].up.set(0, 0, 1);
    }
    // TODO : check si necessaire
   /* private initStats(): void {
        this.stats = new Stats();
        this.stats.dom.style.position = "absolute";
        this.canvas.appendChild(this.stats.dom);
    }*/

    public render(player: Car): void {
        if (this.cameraID === 0) {
            this.cameras[0].updatePosition(player);
        } else {
            this.cameras[1].updatePosition(player.getUpdatedPosition());
        }
        this.renderer.render(this.sceneGameService.scene, this.cameras[this.cameraID]);
        // this.stats.update();
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
        this.renderer.setSize(window.innerWidth, window.innerHeight);

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
    public initCameraCommands(keyboard: KeyboardEventService): void {
        keyboard.addCommand(KeyCode.ZOOM_IN_KEYCODE, new Command.ZoomInCommand(this));
        keyboard.addCommand(KeyCode.ZOOM_OUT_KEYCODE, new Command.ZoomOutCommand(this));
        keyboard.addCommand(KeyCode.SWITCH_CAMERA_KEYCODE, new Command.SwitchCameraCommand(this));
    }

}
