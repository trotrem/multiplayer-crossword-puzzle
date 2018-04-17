import { TestBed, inject } from "@angular/core/testing";
import { GridEventService } from "./grid-event.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { CommunicationService } from "./communication.service";

describe("GridEventService", () => {
  let http: HttpClient;
  let router: Router;
  const communicationService: CommunicationService = new CommunicationService(http);

  const service: GridEventService = new GridEventService( communicationService, router);
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [GridEventService]
    });
  });

  beforeEach(inject([Router, HttpClient], (_router: Router, _http: HttpClient) => {
    router = _router;
    http = _http;

  }));

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
