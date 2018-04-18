import { TestBed, inject } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { CommunicationService } from "../communication.service";
import { WordStatusManagerService } from "./word-status-manager.service";
import { SocketsService } from "./../sockets.service";
import { SelectedWord, AssociatedPlayers, WordDescription, Cell } from "../dataStructures";
import { Direction } from "../../../../../common/communication/types";
import { GameConfigurationService } from "../game-configuration.service";

/* tslint:disable:no-magic-numbers*/
describe("WordStatusManagerService", () => {

    let service: WordStatusManagerService;
    let communicationService: CommunicationService;
    let socketsService: SocketsService;

    beforeEach(() => {
        void TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([]),
            ],
            providers: [WordStatusManagerService, CommunicationService, SocketsService]
        });
    });

    beforeEach(inject([WordStatusManagerService, SocketsService, CommunicationService],
                      (_service: WordStatusManagerService, _socketsService: SocketsService,
                       _communicationService: CommunicationService) => {
                       service = _service;
                       socketsService = _socketsService;
                       communicationService = _communicationService;
        }));

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should detect the selection, but do nothing as the target word equal the word", () => {

        const config: GameConfigurationService = new GameConfigurationService;
        config.configureGame(0, "Marc", 2);
        service.initialize(config);

        const cells: Cell[] =
            [{ isBlack: false, content: "H", selectedBy: AssociatedPlayers.NONE, letterFound: AssociatedPlayers.PLAYER },
             { isBlack: false, content: "A", selectedBy: AssociatedPlayers.NONE, letterFound: AssociatedPlayers.PLAYER },
             { isBlack: false, content: "L", selectedBy: AssociatedPlayers.NONE, letterFound: AssociatedPlayers.PLAYER },
             { isBlack: false, content: "", selectedBy: AssociatedPlayers.PLAYER, letterFound: AssociatedPlayers.NONE }];
        const word: WordDescription = {
            id: 0,
            direction: Direction.Vertical,
            cells: cells, definition: "entrance",
            found: AssociatedPlayers.OPPONENT
        };

        const target: SelectedWord = { player: AssociatedPlayers.OPPONENT, word: word};
        const word2: WordDescription = word;
        const selected: boolean = false;
        const id: string = "42";
        const value: WordDescription = service.setSelectedWord(target, word2, selected, id);

        expect(value).toEqual(null);
    });

    it("should detect the selection and send event, but return null as the target word isn't null", () => {
        spyOn(communicationService, "sendSelectionStatus");
        const config: GameConfigurationService = new GameConfigurationService;
        config.configureGame(0, "Marc", 2);
        service.initialize(config);
        const cells: Cell[] =
            [{ isBlack: false, content: "H", selectedBy: AssociatedPlayers.NONE, letterFound: AssociatedPlayers.PLAYER },
             { isBlack: false, content: "A", selectedBy: AssociatedPlayers.NONE, letterFound: AssociatedPlayers.PLAYER },
             { isBlack: false, content: "L", selectedBy: AssociatedPlayers.NONE, letterFound: AssociatedPlayers.PLAYER },
             { isBlack: false, content: "", selectedBy: AssociatedPlayers.PLAYER, letterFound: AssociatedPlayers.NONE }];
        const word: WordDescription = {
            id: 0, direction: Direction.Vertical, cells: cells, definition: "entrance", found: AssociatedPlayers.NONE};
        const cells2: Cell[] =
            [{ isBlack: false, content: "H", selectedBy: AssociatedPlayers.NONE, letterFound: AssociatedPlayers.PLAYER },
             { isBlack: false, content: "U", selectedBy: AssociatedPlayers.NONE, letterFound: AssociatedPlayers.PLAYER },
             { isBlack: false, content: "L", selectedBy: AssociatedPlayers.NONE, letterFound: AssociatedPlayers.PLAYER },
             { isBlack: false, content: "", selectedBy: AssociatedPlayers.PLAYER, letterFound: AssociatedPlayers.NONE }];
        const word2: WordDescription = {
            id: 1, direction: Direction.Horizontal, cells: cells2, definition: "something precise", found: AssociatedPlayers.PLAYER};
        const target: SelectedWord = { player: AssociatedPlayers.PLAYER, word: word2};
        const selected: boolean = true;
        const id: string = "42";
        const value: WordDescription = service.setSelectedWord(target, word, selected, id);
        expect(communicationService.sendSelectionStatus).toHaveBeenCalled();
        expect(value).toEqual(target.word);
    });
});
