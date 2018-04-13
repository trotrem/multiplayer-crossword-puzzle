import * as THREE from "three";

const WIDTH_SPHERE: number = 8;
const WIDTH_PLANE: number = 16;
const WIDTH_START: number = 4;
const WIDTH_POINT: number = 0.5;
const WIDTH_SCENE: number = 1000;
const HEIGHT_SCENE: number = 1000;
const SCENE: number = -0.5;
const START_LINE: number = 0.05;
const TRACK: THREE.Texture = new THREE.TextureLoader().load("../../assets/models/asphalte.png");
const START: THREE.Texture = new THREE.TextureLoader().load("../../assets/models/start.png");
const GRASS: THREE.Texture = new THREE.TextureLoader().load("../../assets/models/bottom.JPG");

export class TrackDisplay {

    private static setPointMeshPosition(point: THREE.Vector3, circle: THREE.CircleGeometry): THREE.Mesh {
        const pointMesh: THREE.Mesh = new THREE.Mesh(circle, new THREE.MeshBasicMaterial({ map: TRACK }));
        pointMesh.position.copy(point);

        return pointMesh;
    }

    private static setPlaneMesh(
        vector: THREE.Vector3, point: THREE.Vector3, scaleX: number, texture: THREE.MeshBasicMaterial["map"]): THREE.Mesh {
        const floor: THREE.Mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 0), new THREE.MeshBasicMaterial({ map: texture }));
        floor.position.copy(point);
        floor.scale.x = scaleX;
        floor.scale.y = WIDTH_PLANE;
        floor.rotateZ(Math.atan2(vector.y, vector.x));

        return floor;
    }

    private static SetPointFromMatrix(point: THREE.Vector3): THREE.Vector3 {

        return new THREE.Vector3().applyMatrix4(new THREE.Matrix4().makeTranslation(point.x, point.y, 0));
    }

    public static drawTrack(points: THREE.Vector3[]): THREE.Mesh[] {
        const addToScene: THREE.Mesh[] = new Array<THREE.Mesh>();
        for (let i: number = 1; i < points.length; i++) {

            addToScene.push(this.setPointMeshPosition(this.SetPointFromMatrix(points[i]), new THREE.CircleGeometry(WIDTH_SPHERE)));

            const vector: THREE.Vector3 =
                new THREE.Vector3().copy(this.SetPointFromMatrix(points[i])).sub(this.SetPointFromMatrix(points[i - 1]));
            const point: THREE.Vector3 =
                new THREE.Vector3().copy(vector).multiplyScalar(WIDTH_POINT).add(this.SetPointFromMatrix(points[i - 1]));

            addToScene.push(this.setPlaneMesh(vector, point, vector.length(), TRACK));

        }
        addToScene.push(this.drawBackground());
        addToScene.push(this.drawStartLine(points));

        return addToScene;
    }

    public static drawBackground(): THREE.Mesh {
        const floor: THREE.Mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 0), new THREE.MeshBasicMaterial({ map: GRASS }));
        floor.position.set(0, 0, SCENE);
        floor.scale.x = WIDTH_SCENE;
        floor.scale.y = HEIGHT_SCENE;

        return floor;
    }

    private static drawStartLine(points: THREE.Vector3[]): THREE.Mesh {
        const floor: THREE.Mesh = this.setPlaneMesh(
            new THREE.Vector3().copy(this.SetPointFromMatrix(points[1])).sub(this.SetPointFromMatrix(points[0])),
            new THREE.Vector3().copy(new THREE.Vector3().copy(this.SetPointFromMatrix(points[1])).
                sub(this.SetPointFromMatrix(points[0]))).
                multiplyScalar(WIDTH_POINT).add(this.SetPointFromMatrix(points[0])),
            WIDTH_START, START);
        floor.translateX(-WIDTH_START);
        floor.translateZ(START_LINE);

        return floor;
    }
}
