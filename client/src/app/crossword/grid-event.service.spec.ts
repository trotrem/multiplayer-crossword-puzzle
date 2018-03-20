import { TestBed, inject } from "@angular/core/testing";

import { GridEventService } from "./grid-event.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";

describe("GridEventService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [GridEventService]
    });
  });

  it("should be created", inject([GridEventService], (service: GridEventService) => {
    expect(service).toBeTruthy();
  }));
});
