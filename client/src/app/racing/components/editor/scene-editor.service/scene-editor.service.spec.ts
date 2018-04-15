import { TestBed, inject } from "@angular/core/testing";
import { SceneEditorService } from "./scene-editor.service";
import { RenderEditorService } from "../render-editor.service/render-editor.service";
//TODO : Sarah check les disable
describe("SceneEditorService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SceneEditorService, RenderEditorService]
    });
  });

  it("should be created", inject([SceneEditorService], (service: SceneEditorService) => {
    expect(service).toBeTruthy();
  }));

  it("should create a point when leftClick ", inject([SceneEditorService], (service: SceneEditorService) => {
    spyOn(service, "onLeftClick");
    const event: MouseEvent = new MouseEvent("click");
    // tslint:disable-next-line:no-magic-numbers
    event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 2, false, false, false, false, 0, null);
    service.onLeftClick(event);
    expect(service.scene.children).toBeTruthy();
  }));

  it("should delete a point when rightClick ", inject([SceneEditorService], (service: SceneEditorService) => {
    spyOn(service, "onRightClick");
    spyOn(service, "onLeftClick");
    const event: MouseEvent = new MouseEvent("click");
    // tslint:disable-next-line:no-magic-numbers
    event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 2, false, false, false, false, 0, null);
    service.onLeftClick(event);
    service.onRightClick(event);
    expect(service.scene.children.length).toBe(0);
  }));

  it("should drag a point when Drag ", inject([SceneEditorService], (service: SceneEditorService) => {
    spyOn(service, "onDrag");
    spyOn(service, "redrawTrack");
    spyOn(service, "onLeftClick");
    const event1: MouseEvent = new MouseEvent("click");
    // tslint:disable-next-line:no-magic-numbers
    event1.initMouseEvent("click", true, true, window, 0, 0, 0, 0.5, 0, false, false, false, false, 0, null);
    const event2: MouseEvent = new MouseEvent("drag");
    // tslint:disable-next-line:no-magic-numbers
    event2.initMouseEvent("drag", true, true, window, 0, 0, 0, 2, 2, false, false, false, false, 0, null);
    service.onLeftClick(event1);
    service.onDrag(event2, true);
    expect(service.redrawTrack).toBeTruthy();
  }));
});
