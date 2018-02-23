import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Track } from "./track";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";

@Injectable()
export class TrackServices {
    public constructor(private http: HttpClient) {
    }
    public saveTrackService(track: Track): void {
        const headers: HttpHeaders = new HttpHeaders()
            .set("Authorization", "my-auth-token")
            .set("Content-Type", "application/json");

        this.http.post("http://localhost:3000/track", JSON.stringify(track), {
            headers: headers
        })
            .subscribe((data: Response) => {
            });
    }

    public getTrackService(name: string): Observable<Track[]> {
        return this.http.get<Track[]>("http://localhost:3000/" + name);
    }
}
