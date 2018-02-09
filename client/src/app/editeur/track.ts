import * as THREE from "three";
export class Track  {
    private trackName: String;
    private trackDescription: String;
    private trackPoints: THREE.Vector3[];
    public track(): void {
        this.trackName = "";
        this.trackDescription = "";
        this.trackPoints = new Array();

    }
}
