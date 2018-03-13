import { Track } from "./track";
import { HttpClient } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import * as THREE from "three";
import { CommunicationRacingService } from "../communication.service/communicationRacing.service";

export class TrackSavor {
    private track: Track;
    private communicationService: CommunicationRacingService;
    private submitValid: boolean;
    private startingZone: THREE.Line3;
    private points: THREE.Vector3[];
    public constructor(private http: HttpClient) {
        this.communicationService = new CommunicationRacingService(this.http);
        this.track = new Track();
        this.submitValid = false;
        this.points = new Array<THREE.Vector3>();
        this.startingZone = new THREE.Line3;
    }

    public setPoints(points: Array<THREE.Vector3>): void {
        this.points = points;
    }
    public getPoints(): Array<THREE.Vector3> {
        return this.points;
    }
    public setTrack(track: Track): void {
        this.track = track;
    }
    public getTrack(): Track {
        return this.track;
    }
    public setStartingZone(zone: THREE.Line3): void {
        this.startingZone = zone;
    }
    public getStartingZone(): THREE.Line3 {
        return this.startingZone;
    }
    public setSubmitvalue(value: boolean): void {
        this.submitValid = value;
    }
    public getSubmitvalue(): boolean {
        return this.submitValid;
    }
    public savetrack(): void {
        this.track.points = this.points;
        this.setStartingZone(new THREE.Line3(this.points[0], this.points[1]));
        this.track.startingZone = this.startingZone;
        this.communicationService.saveTrack(this.track);
    }
    public onSubmit(f: NgForm): void {
        this.track.description = f.value.description;
        this.track.name = f.value.name;
        this.submitValid = true;
    }
}
