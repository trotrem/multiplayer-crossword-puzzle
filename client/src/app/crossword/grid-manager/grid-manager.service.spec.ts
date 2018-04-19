import { TestBed, inject } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { GridManager } from "./grid-manager.service";
import { CommunicationService } from "../communication-service/communication.service";
import { GridEventService } from "../grid-event.service/grid-event.service";
import { GameConfigurationService } from "../game-configuration/game-configuration.service";
import { SocketsService } from "../sockets/sockets.service";
import { PlayManagerService } from "../play-manager.service/play-manager.service";
import { WordStatusManagerService } from "../word-status-manager.service/word-status-manager.service";

let communicationService: CommunicationService;
describe("GridManager", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([]),
            ],
            providers: [
                GridManager, CommunicationService,
                SocketsService, GameConfigurationService,
                GridEventService, PlayManagerService,
                WordStatusManagerService]
        });
    });

    beforeEach(inject([CommunicationService], (_communicationService: CommunicationService) => {
        communicationService = _communicationService;
        communicationService.initialize();

    }));

    it("should create an instance", inject([GridManager], (service: GridManager) => {
        expect(service).toBeTruthy();
    }));
});
