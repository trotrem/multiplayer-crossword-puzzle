import { injectable } from "inversify";
import * as socketIo from "socket.io";
import * as http from "http";
import { GameResult } from "../../../common/communication/types";
import { GridFetcher } from "./gridFetcher";
import { CrosswordGamesCache } from "./cache/crosswordGamesCache";
import * as events from "../../../common/communication/events";
import { IValidationWord, IGrid } from "./dataStructures";
import { CacheUtils } from "./cache/cacheUtils";
@injectable()
export class SocketsHandler {

    private io: SocketIO.Server;

    public initialize(server: http.Server): void {
        this.io = socketIo(server);
        this.io.on(events.CrosswordEvents.Connected, (socket: SocketIO.Socket) => {
            socket.emit(events.CrosswordEvents.Connected);
            this.onCreateGame(socket);
            this.onGetGamesList(socket);
            this.onJoinGame(socket);
            this.onValidateWord(socket);
            this.onSelectedWord(socket);
        });
    }

    private onCreateGame(socket: SocketIO.Socket): void {
        socket.on(events.CrosswordEvents.NewGame, async (creationParameters: events.ICrosswordSettings) => {
            const gameId: string = CacheUtils.createGame(
                { name: creationParameters.playerName, socket: socket, selectedWord: null },
                creationParameters.difficulty,
                creationParameters.nbPlayers);

            if (creationParameters.nbPlayers === 1) {
                this.sendGridToPlayers(gameId);
            }
        });
    }

    private onJoinGame(socket: SocketIO.Socket): void {
        socket.on(events.CrosswordEvents.JoinGame, (joinParameters: events.IConnectionInfo) => {
            CacheUtils.joinGame(joinParameters.gameId, {
                name: joinParameters.player,
                socket: socket,
                selectedWord: null
            });

            CrosswordGamesCache.Instance.getPlayersSockets(joinParameters.gameId)[0].emit(  events.CrosswordEvents.OpponentFound,
                                                                                            joinParameters);

            this.sendGridToPlayers(joinParameters.gameId);
        });
    }

    private sendGridToPlayers(gameId: string): void {
        GridFetcher.fetchGrid(CrosswordGamesCache.Instance.getDifficulty(gameId), (grid: IGrid) => {
            const gridData: events.IGridData = CacheUtils.addGrid(grid, gameId);
            this.emitToGamePlayers(gameId, events.CrosswordEvents.GridFetched, gridData);
        }).catch(() => console.warn("error in grid fetching"));
    }

    private emitToGamePlayers(gameId: string, event: events.CrosswordEvents, data: events.IEventPayload): void {
        CrosswordGamesCache.Instance.getPlayersSockets(gameId).map(
            (socket: SocketIO.Socket) => {
                socket.emit(event, data);
            });
    }

    private onGetGamesList(socket: SocketIO.Socket): void {
        socket.on(events.CrosswordEvents.GetOpenGames, (request: events.ILobbyRequest) => {
            socket.emit(events.CrosswordEvents.FetchedOpenGames, CrosswordGamesCache.Instance.getOpenMultiplayerGames(request.difficulty));
        });
    }

    private onValidateWord(socket: SocketIO.Socket): void {
        socket.on(events.CrosswordEvents.ValidateWord, (parameters: events.IWordValidationPayload) => {
            const validationWords: IValidationWord[] = CrosswordGamesCache.Instance.getWords(parameters.gameId);

            if (validationWords.length > parameters.wordIndex &&
                validationWords[parameters.wordIndex].validatedBy === undefined &&
                validationWords[parameters.wordIndex].word === parameters.word) {
                CacheUtils.validateWord(parameters.gameId, parameters.wordIndex, socket.id);

                const validationPayload: events.IValidationData = {
                    word: parameters.word,
                    index: parameters.wordIndex,
                    validatedByReceiver: true,
                    gameId: parameters.gameId
                };

                socket.emit(events.CrosswordEvents.WordValidated, validationPayload);
                if (CrosswordGamesCache.Instance.getGameNumberOfPlayers(parameters.gameId) === 2) {
                    validationPayload.validatedByReceiver = false;
                    CrosswordGamesCache.Instance.getOpponentSocket(parameters.gameId, socket)
                        .emit(events.CrosswordEvents.WordValidated, validationPayload);
                }
                this.checkForEndGame(parameters.gameId);
            }
        });
    }

    private onSelectedWord(socket: SocketIO.Socket): void {
        socket.on(events.CrosswordEvents.SelectedWord, (selectedWord: events.IWordSelection) => {
            CrosswordGamesCache.Instance.getOpponentSocket(selectedWord.gameId, socket)
                .emit(events.CrosswordEvents.OpponentSelectedWord, selectedWord);
        });
    }

    private checkForEndGame(gameId: string): void {
        const winner: SocketIO.Socket = CrosswordGamesCache.Instance.getGameWinner(gameId);

        // The game is not won yet
        if (winner === null) {
            return;
        }

        this.onRematch(gameId);

        // The game is a tie
        if (winner !== undefined) {
            winner.emit(events.CrosswordEvents.GameEnded, { gameId: gameId, result: GameResult.Victory } as events.IGameResult);
            if (CrosswordGamesCache.Instance.getGameNumberOfPlayers(gameId) === 2) {
                CrosswordGamesCache.Instance.getOpponentSocket(gameId, winner)
                    .emit(events.CrosswordEvents.GameEnded, { gameId: gameId, result: GameResult.Defeat } as events.IGameResult);
            }

            return;
        }

        // A player won the game
        this.emitToGamePlayers(gameId, events.CrosswordEvents.GameEnded, { gameId: gameId, result: GameResult.Tie } as events.IGameResult);
    }

    private onRematch(gameId: string): void {
        const incrementRequestCount: () => number = this.rematchRequestClosure();
        const sockets: SocketIO.Socket[] = CrosswordGamesCache.Instance.getPlayersSockets(gameId);
        for (const socket of sockets) {
            socket.once(events.CrosswordEvents.RequestRematch, (payload: events.IEventPayload) => {
                if (incrementRequestCount() === CrosswordGamesCache.Instance.getGameNumberOfPlayers(gameId)) {
                    this.sendGridToPlayers(gameId);
                    this.emitToGamePlayers(gameId, events.CrosswordEvents.OpponentFound, null);
                } else {
                    CrosswordGamesCache.Instance.getOpponentSocket(gameId, socket)
                        .emit(events.CrosswordEvents.RematchRequested, null);

                }
            });
        }
    }

    private rematchRequestClosure(): () => number {
        let requestCount: number = 0;

        return () => {
            requestCount++;

            return requestCount;
        };
    }
}
