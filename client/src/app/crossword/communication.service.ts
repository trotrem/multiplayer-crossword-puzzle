import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/first";
import { Difficulty, IWordValidationParameters } from "../../../../common/communication/types";
import { SocketsService } from "./sockets.service";
import { CrosswordEvents, IGridData } from "../../../../common/communication/events";

const SERVER_URL: string = "http://localhost:3000"

@Injectable()
export class CommunicationService {

    private _gridPromise: Promise<IGridData>;

    public get gridPromise(): Promise<IGridData> {
        return this._gridPromise;
    }

    public constructor(private http: HttpClient, private socketsService: SocketsService) {
        this._gridPromise = this.onGridFetched();
    }

    public fetchCheatModeWords(id: number): Observable<string[]> {
        return this.http.get<string[]>(SERVER_URL + "/crossword/cheatwords/" + id);
    }

    // TODO: type safety
    public createGame(difficulty: Difficulty, playerName: string, nbPlayers: number): void {
        this.socketsService.sendEvent(CrosswordEvents.NewGame, { difficulty: difficulty, playerName: playerName, nbPlayers: nbPlayers });
    }

    public onGridFetched(): Promise<IGridData> {
        return this.socketsService.onEvent(CrosswordEvents.GridFetched).first().toPromise() as Promise<IGridData>;
    }

    public validate(parameters: IWordValidationParameters): void {
        this.socketsService.sendEvent(CrosswordEvents.ValidateWord, parameters);
    }

    public onValidation(): Observable<IWordValidationParameters> {
        return this.socketsService.onEvent(CrosswordEvents.WordValidated) as Observable<IWordValidationParameters>;
    }

    public onOpponentFound(): Observable<null> {
        return this.socketsService.onEvent(CrosswordEvents.OpponentFound).first() as Observable<null>;
    }
}
