import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import { Message, Event } from "../../../../common/communication/types";
import * as socketIo from "socket.io-client";

const SERVER_URL = "http://localhost:3000";

@Injectable()
export class SocketsService {
    private socket: SocketIOClient.Socket;

    public initSocket(): void {
        this.socket = socketIo(SERVER_URL);
    }

    public sendMessage(message: Message): void {
        this.socket.emit("message", message);
    }

    public sendEvent(event: Event, payload: object = null): void {
        this.socket.emit(event, payload);
    }

    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>((observer) => {
            this.socket.on(event, (pd: any) => {
                observer.next(pd);
            });
        });
    }
}
