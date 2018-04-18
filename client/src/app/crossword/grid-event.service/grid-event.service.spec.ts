import { TestBed, inject } from "@angular/core/testing";
import { GridEventService } from "./grid-event.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { CommunicationService } from "./../communication.service";
import { Direction } from "../../../../../common/communication/types";
import { Cell, WordDescription, AssociatedPlayers, SelectedWord } from "./../dataStructures";
import { SocketsService } from "./../sockets.service";
import { PlayManagerService } from "../play-manager.service/play-manager.service";
import { WordStatusManagerService } from "../word-status-manager.service/word-status-manager.service";
import { GameConfigurationService } from "../game-configuration.service";
import { CrosswordGridComponent } from "../component/crossword-grid/crossword-grid.component";

/* tslint:disable:no-magic-numbers*/
describe("GridEventService", () => {

    let component: CrosswordGridComponent;
    let service: GridEventService;
    let playManagerService: PlayManagerService;
    let communicationService: CommunicationService;
    let wordStatusManagerService: WordStatusManagerService

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CrosswordGridComponent],
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([]),
            ],
            providers: [GridEventService, CommunicationService,
                SocketsService, PlayManagerService,
                WordStatusManagerService, GameConfigurationService]
        });
    });

    beforeEach(inject([GridEventService, PlayManagerService, CommunicationService, WordStatusManagerService],
        (_service: GridEventService,
            _playManagerService: PlayManagerService,
            _communicationService: CommunicationService,
            _wordStatusManagerService: WordStatusManagerService) => {
            service = _service;
            playManagerService = _playManagerService;
            communicationService = _communicationService;
            wordStatusManagerService = _wordStatusManagerService;
            component = TestBed.createComponent(CrosswordGridComponent).componentInstance;
        }));

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should only allow letter to be written on the grid", () => {
        spyOn(playManagerService, "write");
        const keyboardEvent: KeyboardEvent = new KeyboardEvent("keydown");
        for (let keyCode: number = 0; keyCode <= 64; keyCode++) {
            if (keyCode !== 8 && keyCode !== 46) {
                Object.defineProperty(keyboardEvent, "keyCode", { value: keyCode });
                service.onKeyPress(keyboardEvent);
                expect(playManagerService.write).not.toHaveBeenCalled();
            }
        }
        for (let keyCode: number = 91; keyCode <= 96; keyCode++) {
            Object.defineProperty(keyboardEvent, "keyCode", { value: keyCode });
            service.onKeyPress(keyboardEvent);
            expect(playManagerService.write).not.toHaveBeenCalled();
        }
        for (let keyCode: number = 123; keyCode <= 2000; keyCode++) {
            Object.defineProperty(keyboardEvent, "keyCode", { value: keyCode });
            service.onKeyPress(keyboardEvent);
            expect(playManagerService.write).not.toHaveBeenCalled();
        }
        for (let keyCode: number = 65; keyCode <= 90; keyCode++) {
            Object.defineProperty(keyboardEvent, "keyCode", { value: keyCode });
            service.onKeyPress(keyboardEvent);
            expect(playManagerService.write).toHaveBeenCalled();
        }
        for (let keyCode: number = 97; keyCode <= 122; keyCode++) {
            Object.defineProperty(keyboardEvent, "keyCode", { value: keyCode });
            service.onKeyPress(keyboardEvent);
            expect(playManagerService.write).toHaveBeenCalled();
        }
        expect(playManagerService.write).toHaveBeenCalledTimes(52);
    });

    it(" should validate a word automatically without entering a key", () => {
        spyOn(communicationService, "sendEventOnValidatedWord");
        const cells: Cell[] =
            [{ isBlack: false, content: "H", selectedBy: AssociatedPlayers.NONE, letterFound: AssociatedPlayers.PLAYER },
            { isBlack: false, content: "A", selectedBy: AssociatedPlayers.NONE, letterFound: AssociatedPlayers.PLAYER },
            { isBlack: false, content: "L", selectedBy: AssociatedPlayers.NONE, letterFound: AssociatedPlayers.PLAYER },
            { isBlack: false, content: "", selectedBy: AssociatedPlayers.PLAYER, letterFound: AssociatedPlayers.NONE }];
        const word: WordDescription = {
            id: 0,
            direction: Direction.Vertical,
            cells: cells, definition: "entrance",
            found: AssociatedPlayers.NONE
        };
        const words: WordDescription[] = [word];
        service.initialize(words, "");
        playManagerService.write("L", word, words, "");
        expect(communicationService.sendEventOnValidatedWord).toHaveBeenCalled();
        expect(word.cells[3].content).toEqual("L");
    });

    // TEST 3: DEUX JOUEURS Les bonnes réponses sont visibles pour les DEUX joueurs

});
