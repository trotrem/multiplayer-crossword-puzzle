import { TrackSavor } from "./track-savor";

import { TestBed, inject } from "@angular/core/testing";

import { TrackServices } from "./../track.services/track.service";
import { HttpClientModule, HttpClient  } from "@angular/common/http";

describe("TrackSavor", () => {
  // tslint:disable-next-line:prefer-const
  let http: HttpClient;
  const trackSavor: TrackSavor = new TrackSavor(http);
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [TrackServices]
    });
  });

  it("should be created", inject([TrackServices], (service: TrackServices) => {
    expect(trackSavor).toBeTruthy();
  }));
});
