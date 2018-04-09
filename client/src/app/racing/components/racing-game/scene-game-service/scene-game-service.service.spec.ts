import { TestBed, inject } from "@angular/core/testing";

import { SceneGameService } from "./scene-game-service.service";

describe("SceneGameServiceService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SceneGameService]
    });
  });

  it("should be created", inject([SceneGameService], (service: SceneGameService) => {
    expect(service).toBeTruthy();
  }));
});
