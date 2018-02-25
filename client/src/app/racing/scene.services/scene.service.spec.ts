import { TestBed, inject } from "@angular/core/testing";

import { SceneServices } from "./scene.service";

describe("SceneService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SceneServices]
    });
  });

  it("should be created", inject([SceneServices], (service: SceneServices) => {
    expect(service).toBeTruthy();
  }));
});
