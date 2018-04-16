import { Injectable, StaticInjector } from "@angular/core";
import { Response } from "@angular/http";

import { HttpHeaders, HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { ITrack } from "../track";

export const URL_SERVER: string = "http://localhost:3000/racing/";
const AUTHORIZATION: string = "Authorization";
const AUTH_TOKEN: string = "my-auth-token";
const CONTENT: string = "Content-Type";
const APP_JSON: string = "application/json";
const TRACK: string = "track";
const FIND: string = "findOne/";
const ADMIN: string = "admin";
const DELETE: string = "deleteTrack/";
const UPDATE_SCORE: string = "updateINewScores";
@Injectable()
export class RacingCommunicationService {

    public constructor(private http: HttpClient) {
    }

    public saveTrack(track: ITrack): void {
        const headers: HttpHeaders = new HttpHeaders()
            .set(AUTHORIZATION, AUTH_TOKEN)
            .set(CONTENT, APP_JSON);
        this.http.post(URL_SERVER + TRACK, JSON.stringify(track), {
            headers: headers
        })
            .subscribe((data: Response) => {
            });
    }

    public async getTrackByName(name: string): Promise<ITrack[]> {
        return this.http.get<ITrack[]>(URL_SERVER + FIND + name).toPromise();

    }

    public getTracks(): Observable<ITrack[]> {
        return this.http.get<ITrack[]>(URL_SERVER + ADMIN);
    }

    public async deleteTrack(track: ITrack): Promise<void> {
        const headers: HttpHeaders = new HttpHeaders()
            .set(AUTHORIZATION, AUTH_TOKEN)
            .set(CONTENT, APP_JSON);

        this.http.delete(URL_SERVER + DELETE + track.name, {
            headers: headers
        })
            .subscribe((data: Response) => {
            });
    }

    public updateScores(track: ITrack): void {
        const headers: HttpHeaders = new HttpHeaders()
            .set(AUTHORIZATION, AUTH_TOKEN)
            .set(CONTENT, APP_JSON);
        this.http.put(URL_SERVER + UPDATE_SCORE, JSON.stringify(track), {
            headers: headers
        })
            .subscribe((data: Response) => {
            });
    }

}
