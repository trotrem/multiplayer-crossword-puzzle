import { TestBed, inject } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
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
