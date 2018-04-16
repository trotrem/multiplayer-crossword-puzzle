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
    OpponentFound = "opponent-found",
    SelectedWord = "selected-word",
    OpponentSelectedWord = "opponent-selected-word"
}

export interface IEventPayload {
    gameId: string;
}

export interface CrosswordLobbyGame extends IEventPayload {
    creator: string;
}

export interface IGridData extends IEventPayload {
    blackCells: Array<IPoint>;
    wordInfos: Array<IWordInfo>;
}

export interface IValidationData extends IEventPayload {
    word: string;
    index: number;
    validatedByReceiver: boolean;
}

export interface IWordSelection extends IEventPayload {
    wordId: number;
}
