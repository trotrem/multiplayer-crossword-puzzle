import { TestBed, inject } from "@angular/core/testing";
import { RenderEditorService } from "./render-editor.service";
import * as THREE from "three";

describe("RenderEditorService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RenderEditorService]
    });
  });

  it("should be created", inject([RenderEditorService], (service: RenderEditorService) => {
    expect(service).toBeTruthy();
  }));

});
