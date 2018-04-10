import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import { Observer } from "rxjs/Observer";
import { CrosswordEvents } from "../../../../common/communication/events"
import * as socketIo from "socket.io-client";

const SERVER_URL = "http://localhost:3000";

@Injectable()
export class SocketsService {
    private socket: SocketIOClient.Socket;

    public constructor() {
        this.socket = socketIo(SERVER_URL);
    }

    public sendEvent(event: CrosswordEvents, payload: object = null): void {
        this.socket.emit(event, payload);
    }

    public onEvent(event: CrosswordEvents): Observable<any> {
        return new Observable<any>((observer) => {
            this.socket.on(event, (pd: any) => {
                observer.next(pd);
            });
        })
    }
}
