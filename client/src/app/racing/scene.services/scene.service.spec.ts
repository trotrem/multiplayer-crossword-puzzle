import { TestBed, inject } from "@angular/core/testing";
import { SceneServices } from "./scene.service";
import * as THREE from "three";

describe("SceneService", () => {
  // tslint:disable-next-line:prefer-const
  let canvas: HTMLCanvasElement ;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SceneServices, HTMLCanvasElement]
    });
  });

  it("should be created", inject([SceneServices], (service: SceneServices) => {
    service.initialize(canvas);
    expect(service).toBeDefined();
  }));

  it("should create a point when leftClick ", inject([SceneServices], (service: SceneServices) => {
    spyOn(service, "onLeftClick");
    const event: MouseEvent = new MouseEvent("click");
    // tslint:disable-next-line:no-magic-numbers
    event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 2, false, false, false, false, 0, null);
    service.initialize(canvas);
    service.onLeftClick(event);
    expect(service.getScene().children).toBeTruthy();
  }));
  it("should delete a point when rightClick ", inject([SceneServices], (service: SceneServices) => {
    spyOn(service, "onRightClick");
    spyOn(service, "onLeftClick");
    const event: MouseEvent = new MouseEvent("click");
    // tslint:disable-next-line:no-magic-numbers
    event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 2, false, false, false, false, 0, null);
    service.initialize(canvas);
    service.onLeftClick(event);
    service.onRightClick(event);
    expect(service.getScene().children.length).toBe(0);
  }));
  it("should drag a point when Drag ", inject([SceneServices], (service: SceneServices) => {
    spyOn(service, "onDrag");
    spyOn(service, "redrawTrack");
    spyOn(service, "onLeftClick");
    const event1: MouseEvent = new MouseEvent("click");
    // tslint:disable-next-line:no-magic-numbers
    event1.initMouseEvent("click", true, true, window, 0, 0, 0, 0.5, 0, false, false, false, false, 0, null);
    const event2: MouseEvent = new MouseEvent("drag");
    // tslint:disable-next-line:no-magic-numbers
    event2.initMouseEvent("drag", true, true, window, 0, 0, 0, 2, 2, false, false, false, false, 0, null);
    service.initialize(canvas);
    service.onLeftClick(event1);
    service.onDrag(event2, true);
    expect(service.redrawTrack).toBeTruthy();
  }));

});
