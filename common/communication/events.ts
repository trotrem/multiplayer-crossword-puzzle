import { IPoint, IWordInfo, GameResult, Difficulty } from "./types";

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
    OpponentSelectedWord = "opponent-selected-word",
    GameEnded = "game-ended",
    RequestRematch = "request-rematch",
    RematchRequested = "rematch-requested"
}

export interface IEventPayload {
    gameId: string;
}

export interface IConnectionInfo extends IEventPayload {
    player: string;
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

export interface IGameResult extends IEventPayload {
    result: GameResult;
}

export interface IWordValidationPayload extends IEventPayload {
    word: string;
    wordIndex: number;
}

export interface ICrosswordSettings extends IEventPayload {
    difficulty: Difficulty;
    nbPlayers: number;
    playerName?: string;
}

export interface ILobbyGames extends IEventPayload {
    games: IConnectionInfo[];
}

export interface ILobbyRequest extends IEventPayload {
    difficulty: Difficulty;
}
