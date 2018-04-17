import { TestBed, inject, async } from "@angular/core/testing";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { Difficulty } from "../../../../common/communication/types";

import { CommunicationService } from "./communication.service";
import { SocketsService } from "./sockets.service";

describe("CommunicationService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [CommunicationService, SocketsService]
        });
    });

    it("should be created", inject([CommunicationService], (service: CommunicationService) => {
        expect(service).toBeTruthy();
    }));
});
