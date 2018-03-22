import * as THREE from "three";

const WIDTH_SPHERE: number = 8;
const WIDTH_PLANE: number = 16;
const WIDTH_START: number = 4;
const WIDTH_POINT: number = 0.5;
const WHITE: number = 0xFFFFFF;
const GRAY: number = 0x7B8284;
const RED: number = 0xFF0000;

export class TrackDisplay {

    private static setPointMeshPosition(point: THREE.Vector3, circle: THREE.CircleGeometry): THREE.Mesh {
        const pointMesh: THREE.Mesh = new THREE.Mesh(circle, new THREE.MeshBasicMaterial({ color: GRAY }));
        pointMesh.position.copy(point);

        return pointMesh;
    }

    private static setPlaneMesh(vector: THREE.Vector3, point: THREE.Vector3, scaleX: number, color: number): THREE.Mesh {
        const floor: THREE.Mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 0), new THREE.MeshBasicMaterial({ color: color }));
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
            // this.scene.add(this.setPointMeshPosition(this.SetPointFromMatrix(points[i]), new THREE.CircleGeometry(WIDTH_SPHERE)));
            addToScene.push(this.setPointMeshPosition(this.SetPointFromMatrix(points[i]), new THREE.CircleGeometry(WIDTH_SPHERE)));

            const vector: THREE.Vector3 =
                new THREE.Vector3().copy(this.SetPointFromMatrix(points[i])).sub(this.SetPointFromMatrix(points[i - 1]));
            const point: THREE.Vector3 =
                new THREE.Vector3().copy(vector).multiplyScalar(WIDTH_POINT).add(this.SetPointFromMatrix(points[i - 1]));

            // this.scene.add(this.setPlaneMesh(vector, point, vector.length(), GRAY));
            addToScene.push(this.setPlaneMesh(vector, point, vector.length(), GRAY));

            if (i === 1) {
                const floor: THREE.Mesh = this.setPlaneMesh(vector, point, WIDTH_START, RED);
                floor.translateX(-WIDTH_START);
                addToScene.push(floor);
                // this.scene.add(floor);
            }

        }

        return addToScene;
    }
}
