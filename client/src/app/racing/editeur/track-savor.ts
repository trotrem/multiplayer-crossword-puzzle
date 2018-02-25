import { TrackServices } from "./../track.services/track.service";
import { Track } from "./track";
import { HttpClient } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import * as THREE from "three";
import { ActivatedRoute } from "@angular/router";

export class TrackSavor {
    private track: Track;
    private trackService: TrackServices;
    private submitValid: boolean;
    private startingZone: THREE.Line3;
    public constructor(private http: HttpClient, private points: THREE.Vector3[]) {
        this.trackService = new TrackServices(this.http);
        this.track = new Track();
        this.submitValid = false;
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
        this.track.setPoints(this.points);
        this.setStartingZone(new THREE.Line3(this.points[0], this.points[1]));
        this.track.setStartingZone(this.startingZone);
        this.trackService.saveTrackService(this.track);
    }
    public onSubmit(f: NgForm): void {
        this.track.setDescription(f.value.description);
        this.track.setName(f.value.name);
        this.submitValid = true;
    }
}
