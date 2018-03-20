import * as THREE from "three";

export class PerspectiveCamera extends THREE.PerspectiveCamera {
    private static readonly WIDTH: number = window.innerWidth;
    private static readonly HEIGHT: number = window.innerHeight;
    private static readonly ASPECT: number = PerspectiveCamera.WIDTH / PerspectiveCamera.HEIGHT;
    private static readonly NEAR: number = 0.05;
    private static readonly FAR: number = 400;
    private static readonly VIEW_ANGLE: number = 45 * 1.025 ** 20;

}
