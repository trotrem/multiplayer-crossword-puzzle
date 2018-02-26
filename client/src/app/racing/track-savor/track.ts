import * as THREE from "three";

export class Track {
    public name: string;
    public description: string;
    public startingZone: THREE.Line3;
    public points: THREE.Vector3[];
    public usesNumber: number;
    public bestScores: number[];

    public constructor() {

        this.name = "";
        this.description = "";
        this.startingZone = new THREE.Line3;
        this.points = new Array<THREE.Vector3>();
        this.usesNumber = 0;
        this.bestScores = new Array<number>();
    }

    public increaseUsesNumber(): void {
        this.usesNumber += 1;
    }
}
