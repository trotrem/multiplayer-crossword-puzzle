import { TestBed, inject } from "@angular/core/testing";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { CommunicationService } from "../communication.service";
import { WordStatusManagerService } from "./word-status-manager.service";
import { SocketsService } from "./../sockets.service";

describe("WordStatusManagerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([]),
            ],
            providers: [WordStatusManagerService, CommunicationService, SocketsService]
        });
    });

    it("should be created", inject([WordStatusManagerService], (service: WordStatusManagerService) => {
        expect(service).toBeTruthy();
    }));
});
