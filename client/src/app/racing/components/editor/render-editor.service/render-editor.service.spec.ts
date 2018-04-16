import { TestBed, inject } from "@angular/core/testing";
import { RenderEditorService } from "./render-editor.service";

describe("RenderEditorService", () => {
//TODO : Laurence
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RenderEditorService]
    });
  });

  it("should be created", inject([RenderEditorService], (service: RenderEditorService) => {
    expect(service).toBeTruthy();
  }));
});
