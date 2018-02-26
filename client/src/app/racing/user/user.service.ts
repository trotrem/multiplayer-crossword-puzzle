import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";
import { Track } from "./../editeur/track";

@Injectable()
export class UserService {
    public constructor(private http: HttpClient) {

    }
    public getTracksService(): Observable<Track[]> {
        return this.http.get<Track[]>("http://localhost:3000/racing/user");
    }
    public getTrackServiceByName(name: string): Observable<Track[]> {
        return this.http.get<Track[]>("http://localhost:3000/racing/user/" + name);
    }
}
