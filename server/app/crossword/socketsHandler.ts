import { injectable } from "inversify";
import * as socketIo from "socket.io";
import * as http from "http";
import { ICrosswordSettings, Difficulty } from "../../../common/communication/types";
import { GridFetcher } from "./gridFetcher";
import { GridCache } from "./cache/crosswordGridCache";
import { CrosswordEvents } from "../../../common/communication/events";
import { IGrid } from "./models/grid/dataStructures";

@injectable()
export class SocketsHandler {

    private io: SocketIO.Server;

    public constructor() { }

    public initialize(server: http.Server): void {
        this.io = socketIo(server);
        this.io.on("connection", (socket: SocketIO.Socket) => {
            socket.emit(CrosswordEvents.Connected);
            this.onCreateGame(socket);
            this.onGetGamesList(socket);
            this.onJoinGame(socket);
        });
    }

    public emitEvent(event: CrosswordEvents, payload: any): void {
        this.io.sockets.emit(event, payload);
    }

    private onCreateGame(socket: SocketIO.Socket): void {
        socket.on(CrosswordEvents.NewGame, async (creationParameters: ICrosswordSettings) => {
            const gameId: number = GridCache.Instance.createGame({ name: creationParameters.playerName, socket: socket, selectedWord: null }, creationParameters.difficulty);

            if (creationParameters.playerName === undefined) {
                GridFetcher.fetchGrid(creationParameters.difficulty, (grid: IGrid) => socket.emit(CrosswordEvents.GridFetched, GridCache.Instance.addGrid(grid, gameId)));
            }
        });
    }

    private onJoinGame(socket: SocketIO.Socket): void {
        socket.on(CrosswordEvents.JoinGame, (joinParameters: { name: string; gridId: number }) => {
            GridCache.Instance.joinGame(joinParameters.gridId,
                {
                    name: joinParameters.name,
                    socket: socket,
                    selectedWord: null
                });
        });
    }

    private onGetGamesList(socket: SocketIO.Socket): void {
        socket.on(CrosswordEvents.GetOpenGames, (difficulty: Difficulty) => {
            socket.emit(CrosswordEvents.FetchedOpenGames, GridCache.Instance.getOpenMultiplayerGames(difficulty));
        });
    }
}
