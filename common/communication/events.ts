import { IPoint, IWordInfo } from "./types";

export enum CrosswordEvents {
    Connected = "connection",
    Disconnected = "disconnect",
    NewGame = "new-game",
    JoinGame = "join-game",
    GridFetched = "grid-fetched",
    ValidateWord = "validate-word",
    WordValidated = "word-validated",
    GetOpenGames = "get-open-games",
    FetchedOpenGames = "fetched-open-games",
    OpponentFound = "opponent-found"
}

export interface IEventPayload {}

export interface CrosswordLobbyGame extends IEventPayload {
    creator: string;
    gameId: string;
}

export interface IGridData extends IEventPayload {
    id: number;
    blackCells: Array<IPoint>;
    wordInfos: Array<IWordInfo>;
}

export interface IValidationData {
    word: string;
    index: number;
    validatedByReceiver: boolean;
}
