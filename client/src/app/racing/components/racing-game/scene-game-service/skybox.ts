import * as THREE from "three";

const SKYBOX_POSITION: number = 800;
const SKYBOX_SIZE: number = 5000;
const PATH: string = "./../../assets/models/Skybox/";
const FRONT: string = "front.JPG";
const BACK: string = "back.JPG";
const RIGHT: string = "right.JPG";
const LEFT: string = "left.JPG";
const TOP: string = "top.JPG";
const BOTTOM: string = "bottom.JPG";

export class Skybox {
    private static _instance: Skybox;
    private skyMaterials: THREE.MeshBasicMaterial[];
    private skyMesh: THREE.Mesh;
    private skyMaterial: THREE.MultiMaterial;
    private skyGeometry: THREE.BoxGeometry;

    public static get instance(): Skybox {

        return this._instance || (this._instance = new this());
    }

    private constructor() {
        this.skyMaterials = this.initializeMaterials();
        this.skyMaterial = new THREE.MultiMaterial(this.skyMaterials);
        this.skyGeometry = new THREE.BoxGeometry(SKYBOX_SIZE, SKYBOX_SIZE, SKYBOX_SIZE);
        this.skyMesh = new THREE.Mesh(this.skyGeometry, this.skyMaterial);
    }

    private initializeMaterials(): THREE.MeshBasicMaterial[] {

        return [
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(PATH + FRONT),
                side: THREE.DoubleSide
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(PATH + BACK),
                side: THREE.DoubleSide
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(PATH + TOP),
                side: THREE.DoubleSide
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(PATH + BOTTOM),
                side: THREE.DoubleSide
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(PATH + RIGHT),
                side: THREE.DoubleSide
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(PATH + LEFT),
                side: THREE.DoubleSide
            })];
    }

    public createSkybox(): THREE.Mesh {
        this.skyMesh.rotateZ(Math.PI / 2);
        this.skyMesh.rotateX(Math.PI / 2);
        this.skyMesh.translateOnAxis(new THREE.Vector3(0, 1, 0), SKYBOX_POSITION);

        return this.skyMesh;
    }
}
