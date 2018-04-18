import { TestBed, inject } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CommunicationService } from "./communication.service";
import { SocketsService } from "./sockets.service";
import { Difficulty } from "../../../../common/communication/types-crossword";
import { IWordSelection, IConnectionInfo, ILobbyRequest } from "../../../../common/communication/events-crossword";

describe("CommunicationService", () => {

    let service: CommunicationService;
    let socketsService: SocketsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [CommunicationService, SocketsService]
        });
    });

    beforeEach(inject([CommunicationService, SocketsService], (_service: CommunicationService, _socketsService: SocketsService) => {
        service = _service;
        socketsService = _socketsService;
    }));

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should send an event of a new game when initiate is called: ", () => {
        spyOn(socketsService, "sendEvent");
        const difficulty: Difficulty = Difficulty.Easy;
        const player: string = "Marc-Antoine";
        const nbPlayers: number = 2;

        service.initiateGame(difficulty, player, nbPlayers);
        expect(socketsService.sendEvent).toHaveBeenCalled();
    });

    it("should send an event after a word is validated: ", () => {
        spyOn(socketsService, "sendEvent");
        const word: string = "cat";
        const wordIndex: number = 2;

        service.sendEventOnValidatedWord({ gameId: "3", word: word, wordIndex: wordIndex });
        expect(socketsService.sendEvent).toHaveBeenCalled();
    });

    it("should return Validation data when a onWordValidation is called: ", () => {
        spyOn(socketsService, "onEvent");

        service.returnDataOnWordValidation();
        expect(socketsService.onEvent).toHaveBeenCalled();
    });

    it("should send an event after a word is selected by a player: ", () => {
        spyOn(socketsService, "sendEvent");
        const selectedWord: IWordSelection = { gameId: "8", wordId: 3 };

        service.sendSelectionStatus(selectedWord);
        expect(socketsService.sendEvent).toHaveBeenCalled();
    });

    it("should send an event after someone join a game: ", () => {
        spyOn(socketsService, "sendEvent");
        const connectionInfo: IConnectionInfo = { gameId: "10", player: "Sarah" };

        service.joinGame(connectionInfo);
        expect(socketsService.sendEvent).toHaveBeenCalled();
    });

    it("should send an event after a fetching game request has been made ", () => {
        spyOn(socketsService, "sendEvent");
        const lobby: ILobbyRequest = { gameId: "15", difficulty: 1 };

        service.fetchOpenGames(lobby);
        expect(socketsService.sendEvent).toHaveBeenCalled();
    });
});
