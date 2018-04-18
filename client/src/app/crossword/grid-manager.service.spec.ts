import { TestBed, inject } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { GridManager } from "./grid-manager.service";
import { CommunicationService } from "./communication.service";
import { GridEventService } from "./grid-event.service/grid-event.service";
import { GameConfigurationService } from "./game-configuration.service";
import { SocketsService } from "./sockets.service";
import { PlayManagerService } from "./play-manager.service/play-manager.service";
import { WordStatusManagerService } from "./word-status-manager.service/word-status-manager.service";

describe("GridManager", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([]),
            ],
            providers: [GridManager, CommunicationService,
                        SocketsService, GameConfigurationService,
                        GridEventService, PlayManagerService,
                        WordStatusManagerService]
        });
    });

    it("should create an instance",  inject([GridManager], (service: GridManager) => {
        expect(service).toBeTruthy();
    }));
});
