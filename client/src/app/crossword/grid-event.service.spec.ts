import { TestBed, inject } from "@angular/core/testing";
import { WordDescription } from "./wordDescription";
import { GridEventService } from "./grid-event.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";

describe("GridEventService", () => {
  const words: WordDescription[] = new Array<WordDescription>();
  let http: HttpClient;
  let router: Router;
  const service: GridEventService = new GridEventService(words, http, router);
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        words
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
