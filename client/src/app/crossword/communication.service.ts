import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/take";
import { Difficulty, IWordValidationParameters } from "../../../../common/communication/types";
import { SocketsService } from "./sockets.service";
import { CrosswordEvents, IGridData } from "../../../../common/communication/events";

const SERVER_URL: string = "http://localhost:3000"

@Injectable()
export class CommunicationService {

    public constructor(private http: HttpClient, private socketsService: SocketsService) {
    }

    public fetchCheatModeWords(id: number): Observable<string[]> {
        return this.http.get<string[]>(SERVER_URL + "/crossword/cheatwords/" + id);
    }

    public createGame(difficulty: Difficulty, playerName: string): Observable<IGridData> {
        const grid: Observable<IGridData> = this.socketsService.onEvent(CrosswordEvents.GridFetched).take(1) as Observable<IGridData>;
        this.socketsService.sendEvent(CrosswordEvents.NewGame, { difficulty: difficulty, playerName: playerName });

        return grid;
    }

    public validate(parameters: IWordValidationParameters): void {
        this.socketsService.sendEvent(CrosswordEvents.ValidateWord, parameters);
    }

    public onValidation(): Observable<IWordValidationParameters> {
        return this.socketsService.onEvent(CrosswordEvents.WordValidated) as Observable<IWordValidationParameters>;
    }

}
