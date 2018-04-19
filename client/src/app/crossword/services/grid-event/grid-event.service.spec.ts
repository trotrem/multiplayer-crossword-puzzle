import { TestBed, inject } from "@angular/core/testing";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import { GridEventService } from "./grid-event.service";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { CommunicationService } from "./../communication/communication.service";
import { Direction } from "../../../../../../common/communication/types-crossword";
import { Cell, WordDescription, AssociatedPlayers } from "./../../dataStructures";
import { SocketsService } from "./../sockets/sockets.service";
import { PlayManagerService } from "../play-manager/play-manager.service";
import { WordStatusManagerService } from "../word-status-manager/word-status-manager.service";
import { GameConfigurationService } from "../game-configuration/game-configuration.service";
import { CrosswordGridComponent } from "../../component/crossword-grid/crossword-grid.component";
import { IValidationData, IGameResult, IWordSelection } from "../../../../../../common/communication/events-crossword";

/* tslint:disable:no-magic-numbers*/
describe("GridEventService", () => {

    let component: CrosswordGridComponent;
    let service: GridEventService;
    let playManagerService: PlayManagerService;
    let communicationService: CommunicationService;
    let wordStatusManagerService: WordStatusManagerService;
    let gameConfigurationService: GameConfigurationService;

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

    beforeEach(inject([GridEventService, PlayManagerService,
                       CommunicationService, WordStatusManagerService, GameConfigurationService],
                      (_service: GridEventService,
                       _playManagerService: PlayManagerService,
                       _communicationService: CommunicationService,
                       _wordStatusManagerService: WordStatusManagerService,
                       _gameConfigurationService: GameConfigurationService) => {
            service = _service;
            gameConfigurationService = _gameConfigurationService;
            playManagerService = _playManagerService;
            communicationService = _communicationService;
            wordStatusManagerService = _wordStatusManagerService;
            communicationService.initialize();
            component = TestBed.createComponent(CrosswordGridComponent).componentInstance;
        }));

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should initialize: id and words, subscription on game ended and opponent found word", () => {
        gameConfigurationService.configureGame(0, "Marc", 2);
        wordStatusManagerService.initialize(gameConfigurationService);
        const gameResultMock: IGameResult = {gameId: "4", result: 0};
        const selectionMock: IWordSelection = {gameId: "4", wordId: 0};
        spyOn(wordStatusManagerService, "initialize");
        spyOn(communicationService, "sendEventOnGameEnded").and.returnValue(Observable.of(gameResultMock));
        spyOn(communicationService, "sendEventOnOpponentSelectedWord").and.returnValue(Observable.of(selectionMock));
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
        const id: string = "4";
        service.initialize(words, id);
        expect(service.id).toEqual(id);
        expect(service.words).toEqual(words);
        expect(gameConfigurationService.nbPlayers).toEqual(2);
        expect(wordStatusManagerService.initialize).toHaveBeenCalled();
        expect(communicationService.sendEventOnGameEnded).toHaveBeenCalled();
        expect(communicationService.sendEventOnOpponentSelectedWord).toHaveBeenCalled();
    });

    it("should only allow letter to be written on the grid", () => {
        spyOn(playManagerService, "write"); const keyboardEvent: KeyboardEvent = new KeyboardEvent("keydown");
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

    it("should validate a word automatically without entering a key", () => {
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

    it("should show opponent validated word to the other player: ", () => {
        const cells: Cell[] =
            [{ isBlack: false, content: "H", selectedBy: AssociatedPlayers.NONE, letterFound: AssociatedPlayers.PLAYER },
             { isBlack: false, content: "A", selectedBy: AssociatedPlayers.NONE, letterFound: AssociatedPlayers.PLAYER },
             { isBlack: false, content: "L", selectedBy: AssociatedPlayers.NONE, letterFound: AssociatedPlayers.PLAYER },
             { isBlack: false, content: "L", selectedBy: AssociatedPlayers.PLAYER, letterFound: AssociatedPlayers.NONE }];
        const word: WordDescription = {
            id: 0,
            direction: Direction.Vertical,
            cells: cells,
            definition: "entrance",
            found: AssociatedPlayers.NONE
        };
        const words: WordDescription[] = [word];

        service.initialize(words, "42");

        const data: IValidationData = { gameId: "42", word: "hall", index: 0, validatedByReceiver: false };
        service.onWordValidated(data);
        expect(service.words[0].found).toEqual(AssociatedPlayers.OPPONENT);
    });
});
