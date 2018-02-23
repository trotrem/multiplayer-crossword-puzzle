import * as THREE from "three";

export class Track {
    private name: string;
    private description: string;
    private startingZone: THREE.Line3;
    private points: THREE.Vector3[];
    private usesNumber: number;

    public constructor() {

        this.name = "";
        this.description = "";
        this.startingZone = new THREE.Line3;
        this.points = new Array<THREE.Vector3>();
        this.usesNumber = 0;
    }

    public getName(): string {
        return this.name;
    }
    public getDescription(): string {
        return this.description;
    }
    public getStartingZone(): THREE.Line3 {
        return this.startingZone;
    }
    public getPoints(): Array<THREE.Vector3> {
        return this.points;
    }
    public getusesNumber(): number {
        return this.usesNumber;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public setDescription(description: string): void {
        this.description = description;
    }
    public setStartingZone(startingZone: THREE.Line3): void {
        this.startingZone = startingZone;
    }
    public setPoints(points: Array<THREE.Vector3>): void {
        this.points = points;
    }
    public increaseUsesNumber(): void {
        this.usesNumber += 1;
    }
}
