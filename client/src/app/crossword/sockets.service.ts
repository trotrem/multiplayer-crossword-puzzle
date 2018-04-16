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

    // TODO: Changer les any pour des IEventPayload
    public sendEvent(event: CrosswordEvents, payload: any): void {
        this.socket.emit(event, payload);
    }

    public onEvent(event: CrosswordEvents): Observable<any> {
        return new Observable<IEventPayload>((observer: Observer<any>) => {
            this.socket.on(event, (pd: any) => {
                observer.next(pd);
            });
        });
    }
}
