import { TrackSavor } from "./track-savor";

import { TestBed, inject } from "@angular/core/testing";

import { HttpClientModule, HttpClient  } from "@angular/common/http";
import { CommunicationRacingService } from "../communication.service/communicationRacing.service";

describe("TrackSavor", () => {
  // tslint:disable-next-line:prefer-const
  let http: HttpClient;
  const trackSavor: TrackSavor = new TrackSavor(http);
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [CommunicationRacingService]
    });
  });

  it("should be created", inject([CommunicationRacingService], (service: CommunicationRacingService) => {
    expect(trackSavor).toBeTruthy();
  }));
});
