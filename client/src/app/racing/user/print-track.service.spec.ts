import { TestBed, inject } from "@angular/core/testing";

import { PrintTrackService } from "./print-track.service";

describe("PrintTrackService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrintTrackService]
    });
  });

  it("should be created", inject([PrintTrackService], (service: PrintTrackService) => {
    expect(service).toBeTruthy();
  }));
});
