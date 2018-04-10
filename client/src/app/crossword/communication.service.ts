import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { Difficulty, IWordValidationParameters } from "../../../../common/communication/types";
import { SocketsService } from "./sockets.service";
import { CrosswordEvents, IGridData } from "../../../../common/communication/events";

@Injectable()
export class CommunicationService {

    public constructor(private http: HttpClient, private socketsService: SocketsService) { }

    public fetchCheatModeWords(id: number): Observable<string[]> {
        return this.http.get<string[]>("http://localhost:3000/crossword/cheatwords/" + id);
    }

    public createGame(difficulty: Difficulty, playerName: string): Observable<IGridData> {
        const grid = this.socketsService.onEvent(CrosswordEvents.GridFetched) as Observable<IGridData>;
        this.socketsService.sendEvent(CrosswordEvents.NewGame, {difficulty: difficulty, playerName: playerName});

        return grid;
    }

    public validate(parameters: IWordValidationParameters): Observable<boolean> {
        const headers: HttpHeaders = new HttpHeaders()
            .set("Authorization", "my-auth-token")
            .set("Content-Type", "application/json");

        return this.http.post<boolean>(
            "http://localhost:3000/crossword/validate",
            JSON.stringify(parameters),
            { headers: headers });
    }

}
