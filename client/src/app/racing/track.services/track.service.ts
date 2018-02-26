import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Track } from "./../editeur/track";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import * as THREE from "three";
@Injectable()
export class TrackServices {

    public constructor(private http: HttpClient) {
    }

    public saveTrackService(track: Track): void {
        const headers: HttpHeaders = new HttpHeaders()
            .set("Authorization", "my-auth-token")
            .set("Content-Type", "application/json");

        this.http.delete("http://localhost:3000/racing/deleteTrack/" + track.name, {
            headers: headers
        })
            .subscribe((data: Response) => {
            });
        this.http.post("http://localhost:3000/racing/track", JSON.stringify(track), {
            headers: headers
        })
            .subscribe((data: Response) => {
            });
    }

    public getTrackService(name: string): Observable<Track[]> {
        return this.http.get<Track[]>("http://localhost:3000/racing/findOne/" + name);
    }
}
