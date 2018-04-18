import { TestBed, inject } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { PlayManagerService } from "./play-manager.service";
import { CommunicationService } from "../communication.service";
import { SocketsService } from "./../sockets.service";

describe("PlayManagerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([]),
            ],
            providers: [PlayManagerService, CommunicationService, SocketsService]
        });
    });

    it("should be created", inject([PlayManagerService], (service: PlayManagerService) => {
        expect(service).toBeTruthy();
    }));
});
