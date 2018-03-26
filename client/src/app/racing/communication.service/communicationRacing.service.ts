import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Track } from "./../track";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";

export const URL_SERVER: string = "http://localhost:3000/racing/";
@Injectable()
export class CommunicationRacingService {

    public constructor(private http: HttpClient) {
    }

    public saveTrack(track: Track): void {
        const headers: HttpHeaders = new HttpHeaders()
            .set("Authorization", "my-auth-token")
            .set("Content-Type", "application/json");
        this.http.post(URL_SERVER + "track", JSON.stringify(track), {
            headers: headers
        })
            .subscribe((data: Response) => {
            });
    }

    public getTrackByName(name: string): Observable<Track[]> {
        return this.http.get<Track[]>(URL_SERVER + "findOne/" + name);

    }

    public getTracks(): Observable<Track[]> {
        return this.http.get<Track[]>(URL_SERVER + "admin");
    }

    public deleteTrack(track: Track): void {
        const headers: HttpHeaders = new HttpHeaders()
            .set("Authorization", "my-auth-token")
            .set("Content-Type", "application/json");

        this.http.delete(URL_SERVER + "deleteTrack/" + track.name, {
            headers: headers
        })
            .subscribe((data: Response) => {
            });
    }

    public updateNewScore(track: Track): void {
        const headers: HttpHeaders = new HttpHeaders()
            .set("Authorization", "my-auth-token")
            .set("Content-Type", "application/json");
        this.http.put(URL_SERVER + "updateNewScores", JSON.stringify(track), {
            headers: headers
        })
            .subscribe((data: Response) => {
            });
    }

}
