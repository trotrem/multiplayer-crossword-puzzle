import { TestBed, inject, async } from "@angular/core/testing";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { GridManager } from "./grid-manager.service";
import { CommunicationService } from "./communication.service";
import { GridEventService } from "./grid-event.service/grid-event.service";
import { GameConfigurationService } from "./game-configuration.service";
import { SocketsService } from "./sockets.service";
import { PlayManagerService } from "./play-manager.service/play-manager.service";
import { WordStatusManagerService } from "./word-status-manager.service/word-status-manager.service";
import { RouterConfigLoader } from "@angular/router/src/router_config_loader";
import { Router } from "@angular/router";

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
