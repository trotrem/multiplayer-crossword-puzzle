import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Track } from "./track";
import { HttpHeaders, HttpClient } from "@angular/common/http";

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
}
