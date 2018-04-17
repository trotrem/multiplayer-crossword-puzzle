import { TestBed, inject } from "@angular/core/testing";
import { GridEventService } from "./grid-event.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { CommunicationService } from "./communication.service";
import { Direction } from "../../../../common/communication/types";
import { Cell, WordDescription, AssociatedPlayers } from "./dataStructures";
import { SocketsService } from "./sockets.service";

/* tslint:disable:no-magic-numbers*/
describe("GridEventService", () => {
    let http: HttpClient;
    let router: Router;
    let sockets: SocketsService;
    const communicationService: CommunicationService = new CommunicationService(http, sockets);

    const service: GridEventService = new GridEventService(communicationService, router);
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([]),
            ],
            providers: [GridEventService, CommunicationService]
        });
    });

    beforeEach(inject([Router, HttpClient, SocketsService], (_router: Router, _http: HttpClient) => {
        router = _router;
        http = _http;
        sockets = new SocketsService();
    }));

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should only allow letter to be written on the grid", () => {
        spyOn(service, "write");
        const keyboardEvent: KeyboardEvent = new KeyboardEvent("keydown");
        service.setPlayerSelectedWord({ id: 1, direction: 0, cells: [], definition: "", found: AssociatedPlayers.NONE }, true);
        for (let keyCode: number = 0; keyCode <= 64; keyCode++) {
            Object.defineProperty(keyboardEvent, "keyCode", { value: keyCode });
            service.onKeyPress(keyboardEvent);
            expect(service.write).not.toHaveBeenCalled();
        }
        for (let keyCode: number = 91; keyCode <= 96; keyCode++) {
            Object.defineProperty(keyboardEvent, "keyCode", { value: keyCode });
            service.onKeyPress(keyboardEvent);
            expect(service.write).not.toHaveBeenCalled();
        }
        for (let keyCode: number = 123; keyCode <= 2000; keyCode++) {
            Object.defineProperty(keyboardEvent, "keyCode", { value: keyCode });
            service.onKeyPress(keyboardEvent);
            expect(service.write).not.toHaveBeenCalled();
        }
        for (let keyCode: number = 65; keyCode <= 90; keyCode++) {
            Object.defineProperty(keyboardEvent, "keyCode", { value: keyCode });
            service.onKeyPress(keyboardEvent);
            expect(service.write).toHaveBeenCalled();
        }
        for (let keyCode: number = 97; keyCode <= 122; keyCode++) {
            Object.defineProperty(keyboardEvent, "keyCode", { value: keyCode });
            service.onKeyPress(keyboardEvent);
            expect(service.write).toHaveBeenCalled();
        }
        expect(service.write).toHaveBeenCalledTimes(52);
    });

    it(" should validate a word automatically without entering a key", () => {
        spyOn(service, "validate");
        const cells: Cell[] =
            [{ isBlack: false, content: "H", selectedBy: AssociatedPlayers.NONE, letterFound: AssociatedPlayers.PLAYER },
             { isBlack: false, content: "A", selectedBy: AssociatedPlayers.NONE, letterFound: AssociatedPlayers.PLAYER },
             { isBlack: false, content: "L", selectedBy: AssociatedPlayers.NONE, letterFound: AssociatedPlayers.PLAYER },
             { isBlack: false, content: "", selectedBy: AssociatedPlayers.PLAYER, letterFound: AssociatedPlayers.NONE }];
        const word: WordDescription = { id: 0,
                                        direction: Direction.Vertical,
                                        cells: cells, definition: "entrance",
                                        found: AssociatedPlayers.NONE
                                      };
        const words: WordDescription[] = [word];
        service.initialize(words, 2, "");
        service.write("L", word);
        expect(service.validate).toHaveBeenCalled();
        expect(word.cells[3].content).toEqual("L");
    });

    // TEST 3: DEUX JOUEURS Les bonnes réponses sont visibles pour les DEUX joueurs

});
