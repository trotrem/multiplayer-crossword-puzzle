import { injectable } from "inversify";
import * as socketIo from "socket.io";
import * as http from "http";
import { Event, Message } from "../../../common/communication/types";
import { MultiplayerGamesCache } from "./cache/multiplayerGamesCache";

@injectable()
export class SocketsHandler {

    private io: SocketIO.Server;

    public constructor() { }

    public initialize(server: http.Server): void {
        this.io = socketIo(server);
        this.io.on("connection", (socket: SocketIO.Socket) => {
            this.onCreateGame(socket);
            this.onJoinGame(socket);
        });
    }

    public emitEvent(event: Event, payload: any): void {
        this.io.sockets.emit(event, payload);
    }

    private onCreateGame(socket: SocketIO.Socket): void {
        socket.on("new-game", (creationParameters) => {
            MultiplayerGamesCache.Instance.createGame(creationParameters.difficulty,
                {
                    name: creationParameters.name,
                    socket: socket
                })
        });
    }

    private onJoinGame(socket: SocketIO.Socket): void {
        socket.on("join-game", (joinParameters) => {
            MultiplayerGamesCache.Instance.joinGame(joinParameters.gridId,
                {
                    name: joinParameters.name,
                    socket: socket
            });
        });
    }
}
