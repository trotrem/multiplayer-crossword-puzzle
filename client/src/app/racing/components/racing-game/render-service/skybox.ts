import * as THREE from "three";

const SKYBOX_POSITION: number = 800;
const SKYBOX_SIZE: number = 5000;

export class Skybox {
    private skyMaterials: THREE.MeshBasicMaterial[] = [
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load("./../../assets/models/front.JPG"),
            side: THREE.DoubleSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load("./../../assets/models/back.JPG"),
            side: THREE.DoubleSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load("./../../assets/models/top.JPG"),
            side: THREE.DoubleSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load("./../../assets/models/bottom.JPG"),
            side: THREE.DoubleSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load("./../../assets/models/right.JPG"),
            side: THREE.DoubleSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load("./../../assets/models/left.JPG"),
            side: THREE.DoubleSide
        })];
    private skyMesh: THREE.Mesh = null;
    private skyMaterial: THREE.MeshFaceMaterial = null;
    private skyGeometry: THREE.BoxGeometry = null;

    public constructor() {
        this.skyMaterial = new THREE.MeshFaceMaterial(this.skyMaterials);
        this.skyGeometry = new THREE.BoxGeometry(SKYBOX_SIZE, SKYBOX_SIZE, SKYBOX_SIZE);
        this.skyMesh = new THREE.Mesh(this.skyGeometry, this.skyMaterial);
    }
    public createSkybox(): THREE.Mesh {
        this.skyMesh.rotateZ(Math.PI / 2);
        this.skyMesh.rotateX(Math.PI / 2);
        this.skyMesh.translate(SKYBOX_POSITION, new THREE.Vector3(0, 1, 0));

        return this.skyMesh;
    }
}
