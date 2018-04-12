import { TestBed, inject } from "@angular/core/testing";
import { RenderEditorService } from "./render-editor.service";

describe("RenderEditorService", () => {
  // const canvas
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RenderEditorService]
    });
  });

  it("should be created", inject([RenderEditorService], (service: RenderEditorService) => {
    // service.initialize();
    expect(service).toBeTruthy();
  }));
});
