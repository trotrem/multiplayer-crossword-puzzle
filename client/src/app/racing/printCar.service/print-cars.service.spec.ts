import { TestBed, inject } from "@angular/core/testing";

import { PrintCarsService } from "./print-cars.service";

describe("PrintCarsService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrintCarsService]
    });
  });

  it("should be created", inject([PrintCarsService], (service: PrintCarsService) => {
    expect(service).toBeTruthy();
  }));
});
