import { TestBed, inject } from "@angular/core/testing";
import { SceneServices } from "./scene.service";

describe("SceneService", () => {
  let service: SceneServices;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SceneServices]
    });
    service = TestBed.get(SceneServices);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
