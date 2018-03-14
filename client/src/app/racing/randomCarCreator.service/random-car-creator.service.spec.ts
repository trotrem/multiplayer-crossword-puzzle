import { TestBed, inject } from "@angular/core/testing";
import * as THREE from "three";

import { RandomCarCreatorService } from "./random-car-creator.service";

describe("RandomCarCreatorService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RandomCarCreatorService]
    });
  });
});
