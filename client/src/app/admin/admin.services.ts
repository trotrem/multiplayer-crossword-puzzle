import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";
import { Track } from "./../editeur/track";

@Injectable()
export class AdminServices {

    public constructor(private http: HttpClient) {

    }
    public getTracksService(): Observable<Track[]> {

        return this.http.get<Track[]>("http://localhost:3000/admin");
    }
}
