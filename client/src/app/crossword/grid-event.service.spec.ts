import { TestBed, inject } from "@angular/core/testing";
import { GridEventService } from "./grid-event.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { CommunicationService } from "./communication.service";
import { WordDescription } from "./wordDescription";
import { Direction } from "../../../../common/communication/types";
import { Cell } from "./cell";

/* tslint:disable:no-magic-numbers*/
describe("GridEventService", () => {
    let http: HttpClient;
    let router: Router;
    const communicationService: CommunicationService = new CommunicationService(http);

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

    beforeEach(inject([Router, HttpClient], (_router: Router, _http: HttpClient) => {
        router = _router;
        http = _http;

    }));

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should only allow letter to be written on the grid", () => {
        spyOn(service, "write");
        const keyboardEvent: KeyboardEvent = new KeyboardEvent("keydown");
        service.setSelectedWord({ id: 1, direction: 0, cells: [], definition: "", found: false }, true);
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
        const _cells: Cell[] =
            [{ isBlack: false, content: "H", selected: false, letterFound: true },
             { isBlack: false, content: "A", selected: false, letterFound: true },
             { isBlack: false, content: "L", selected: false, letterFound: true },
             { isBlack: false, content: "", selected: true, letterFound: false }];
        const word: WordDescription = { id: 0, direction: Direction.Vertical, cells: _cells, definition: "entrance", found: false };
        const words: WordDescription[] = [word];
        service.initialize(words);
        service.write("L", word);
        expect(service.validate).toHaveBeenCalled();
        expect(word.cells[3].content).toEqual("L");
    });

    // TEST 3: DEUX JOUEURS Les bonnes réponses sont visibles pour les DEUX joueurs

});
