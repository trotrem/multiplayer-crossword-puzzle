import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";
import { Track } from "./../editeur/track";

@Injectable()
export class AdminService {

    public constructor(private http: HttpClient) {

    }
    public getTracksService(): Observable<Track[]> {
        return this.http.get<Track[]>("http://localhost:3000/racing/admin");
    }

    public deleteTrack(track: Track): void {
        const headers: HttpHeaders = new HttpHeaders()
            .set("Authorization", "my-auth-token")
            .set("Content-Type", "application/json");

        this.http.delete("http://localhost:3000/racing/deleteTrack/" + track.name , {
            headers: headers
        })
            .subscribe((data: Response) => {
            });
    }
}
