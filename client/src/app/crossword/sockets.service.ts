import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/first";
import { Observer } from "rxjs/Observer";
import { CrosswordEvents, IEventPayload } from "../../../../common/communication/events";
import * as socketIo from "socket.io-client";

const SERVER_URL: string = "http://localhost:3000";

@Injectable()
export class SocketsService {
    private socket: SocketIOClient.Socket;

    public constructor() {
        this.socket = socketIo(SERVER_URL);
    }

    public sendEvent(event: CrosswordEvents, payload: IEventPayload = {}): void {
        this.socket.emit(event, payload);
        console.log(this.socket.id);
    }

    public onEvent(event: CrosswordEvents): Observable<IEventPayload> {
        return new Observable<IEventPayload>((observer: Observer<IEventPayload>) => {
            this.socket.on(event, (pd: IEventPayload) => {
                observer.next(pd);
            });
        });
    }
}
