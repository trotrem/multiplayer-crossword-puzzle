import { TestBed, inject } from "@angular/core/testing";

import { TrackServices } from "./track.service";

describe("TrackService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrackServices]
    });
  });

  it("should be created", inject([TrackServices], (service: TrackServices) => {
    expect(service).toBeTruthy();
  }));
});
