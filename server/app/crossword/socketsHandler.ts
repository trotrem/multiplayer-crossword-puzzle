import { injectable } from "inversify";
import * as socketIo from "socket.io";
import * as http from "http";
import { ICrosswordSettings, Difficulty, IWordValidationParameters } from "../../../common/communication/types";
import { GridFetcher } from "./gridFetcher";
import { CrosswordGamesCache } from "./cache/crosswordGridCache";
import { CrosswordEvents, IEventPayload, IGridData, IValidationData } from "../../../common/communication/events";
import { IValidationWord, IGrid } from "./dataStructures";

@injectable()
export class SocketsHandler {

    private io: SocketIO.Server;

    public initialize(server: http.Server): void {
        this.io = socketIo(server);
        this.io.on(CrosswordEvents.Connected, (socket: SocketIO.Socket) => {
            socket.emit(CrosswordEvents.Connected);
            this.onCreateGame(socket);
            this.onGetGamesList(socket);
            this.onJoinGame(socket);
            this.onValidateWord(socket);
        });
    }

    // TODO: utiliser et passer socket
    public emitEvent(event: CrosswordEvents, payload: IEventPayload): void {
        this.io.sockets.emit(event, payload);
    }

    private onCreateGame(socket: SocketIO.Socket): void {
        socket.on(CrosswordEvents.NewGame, async (creationParameters: ICrosswordSettings) => {
            const gameId: number = CrosswordGamesCache.Instance.createGame(
                { name: creationParameters.playerName, socket: socket, selectedWord: null },
                creationParameters.difficulty,
                creationParameters.nbPlayers);

            if (creationParameters.nbPlayers === 1) {
                this.sendGridToPlayers(gameId);
            }
        });
    }

    private onJoinGame(socket: SocketIO.Socket): void {
        socket.on(CrosswordEvents.JoinGame, (joinParameters: { name: string; gridId: number }) => {
            CrosswordGamesCache.Instance.joinGame(joinParameters.gridId, {
                name: joinParameters.name,
                socket: socket,
                selectedWord: null
            });

            CrosswordGamesCache.Instance.getPlayersSockets(joinParameters.gridId)[0].emit(CrosswordEvents.OpponentFound);

            this.sendGridToPlayers(joinParameters.gridId);
        });
    }

    private sendGridToPlayers(gameId: number): void {
        GridFetcher.fetchGrid(CrosswordGamesCache.Instance.getDifficulty(gameId), (grid: IGrid) => {
            const gridData: IGridData = CrosswordGamesCache.Instance.addGrid(grid, gameId);
            this.emitToGamePlayers(gameId, CrosswordEvents.GridFetched, gridData);
        }).catch(() => console.warn("error in grid fetching"));
    }

    private emitToGamePlayers(gameId: number, event: CrosswordEvents, data: IEventPayload): void {
        CrosswordGamesCache.Instance.getPlayersSockets(gameId).map(
            (socket: SocketIO.Socket) => {
                socket.emit(event, data);
            });
    }

    private onGetGamesList(socket: SocketIO.Socket): void {
        socket.on(CrosswordEvents.GetOpenGames, (difficulty: Difficulty) => {
            socket.emit(CrosswordEvents.FetchedOpenGames, CrosswordGamesCache.Instance.getOpenMultiplayerGames(difficulty));
        });
    }

    private onValidateWord(socket: SocketIO.Socket): void {
        socket.on(CrosswordEvents.ValidateWord, (parameters: IWordValidationParameters) => {
            const validationWords: IValidationWord[] = CrosswordGamesCache.Instance.getWords(parameters.gridId);

            if (validationWords.length > parameters.wordIndex &&
                validationWords[parameters.wordIndex].validatedBy === undefined &&
                validationWords[parameters.wordIndex].word === parameters.word) {
                CrosswordGamesCache.Instance.validateWord(parameters.gridId, parameters.wordIndex, socket.id);

                const validationPayload: IValidationData = {
                    word: parameters.word,
                    index: parameters.wordIndex,
                    validatedByReceiver: true
                };

                socket.emit(CrosswordEvents.WordValidated, validationPayload);
                if (CrosswordGamesCache.Instance.getGameNumberOfPlayers(parameters.gridId) === 2) {
                    validationPayload.validatedByReceiver = false;
                    CrosswordGamesCache.Instance.getOpponentSocket(parameters.gridId, socket)
                        .emit(CrosswordEvents.WordValidated, validationPayload);
                }
            }
        });
    }

}
