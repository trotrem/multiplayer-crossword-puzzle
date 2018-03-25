import { TestBed, inject } from "@angular/core/testing";

import { RaceValidatorService } from "./race-validator.service";

describe("RaceValidatorService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RaceValidatorService]
    });
  });

  it("should be created", inject([RaceValidatorService], (service: RaceValidatorService) => {
    expect(service).toBeTruthy();
  }));
});
