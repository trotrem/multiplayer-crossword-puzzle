import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/first";
import { Difficulty } from "../../../../common/communication/types";
import { SocketsService } from "./sockets.service";
import { CrosswordEvents, IGridData, IValidationData, IWordSelection, IGameResult, ICrosswordSettings, IWordValidationPayload, IConnectionInfo, ILobbyGames, ILobbyRequest } from "../../../../common/communication/events";

const SERVER_URL: string = "http://localhost:3000";

@Injectable()
export class CommunicationService {

    private _gridPromise: Promise<IGridData>;

    public get gridPromise(): Promise<IGridData> {
        return this._gridPromise;
    }

    public constructor(private http: HttpClient, private socketsService: SocketsService) {
        this._gridPromise = this.onGridFetched();
    }

    public fetchCheatModeWords(id: string): Observable<string[]> {
        return this.http.get<string[]>(SERVER_URL + "/crossword/cheatwords/" + id);
    }

    // TODO: type safety
    public createGame(difficulty: Difficulty, playerName: string, nbPlayers: number): void {
        this.socketsService.sendEvent(CrosswordEvents.NewGame, { gameId: undefined, difficulty: difficulty, playerName: playerName, nbPlayers: nbPlayers } as ICrosswordSettings);
    }

    public onGridFetched(): Promise<IGridData> {
        return this.socketsService.onEvent(CrosswordEvents.GridFetched).first().toPromise() as Promise<IGridData>;
    }

    public validate(parameters: IWordValidationPayload): void {
        this.socketsService.sendEvent(CrosswordEvents.ValidateWord, parameters);
    }

    public onValidation(): Observable<IValidationData> {
        return this.socketsService.onEvent(CrosswordEvents.WordValidated) as Observable<IValidationData>;
    }

    public onOpponentFound(): Observable<null> {
        return this.socketsService.onEvent(CrosswordEvents.OpponentFound).first() as Observable<null>;
    }

    public sendSelectionStatus(selectedWord: IWordSelection): void {
        this.socketsService.sendEvent(CrosswordEvents.SelectedWord, selectedWord);
    }

    public onOpponentSelectedWord(): Observable<IWordSelection> {
        return this.socketsService.onEvent(CrosswordEvents.OpponentSelectedWord) as Observable<IWordSelection>;
    }

    public onGameEnded(): Observable<IGameResult> {
        return this.socketsService.onEvent(CrosswordEvents.GameEnded).first() as Observable<IGameResult>;
    }

    public joinGame(connectionInfo: IConnectionInfo): void {
        this.socketsService.sendEvent(CrosswordEvents.JoinGame, connectionInfo);
    }

    public fetchOpenGames(settings: ILobbyRequest): void {
        this.socketsService.sendEvent(CrosswordEvents.GetOpenGames, settings);
    }

    public onGamesFetched(): Observable<ILobbyGames> {
        return this.socketsService.onEvent(CrosswordEvents.FetchedOpenGames).first() as Observable<ILobbyGames>;
    }
}
