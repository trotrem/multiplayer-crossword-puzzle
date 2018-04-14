import * as THREE from "three";

const SKYBOX_POSITION: number = 800;
const SKYBOX_SIZE: number = 5000;

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
                map: new THREE.TextureLoader().load("./../../assets/models/Skybox/front.JPG"),
                side: THREE.DoubleSide
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./../../assets/models/Skybox/back.JPG"),
                side: THREE.DoubleSide
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./../../assets/models/Skybox/top.JPG"),
                side: THREE.DoubleSide
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./../../assets/models/Skybox/bottom.JPG"),
                side: THREE.DoubleSide
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./../../assets/models/Skybox/right.JPG"),
                side: THREE.DoubleSide
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./../../assets/models/Skybox/left.JPG"),
                side: THREE.DoubleSide
            })];
    }

    public createSkybox(): THREE.Mesh {
        this.skyMesh.rotateZ(Math.PI / 2);
        this.skyMesh.rotateX(Math.PI / 2);
        this.skyMesh.translate(SKYBOX_POSITION, new THREE.Vector3(0, 1, 0));

        return this.skyMesh;
    }
}
