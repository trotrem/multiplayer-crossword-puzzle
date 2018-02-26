import { TestBed, inject } from "@angular/core/testing";

import { TrackServices } from "./track.service";
import { HttpClient, HttpClientModule  } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

describe("TrackService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [TrackServices,
                  HttpClient]
    });
  });

  it("should be created", inject([TrackServices], (service: TrackServices) => {
    expect(service).toBeTruthy();
  }));
});
