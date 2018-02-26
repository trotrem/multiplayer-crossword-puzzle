import { TestBed, inject } from "@angular/core/testing";

import { EventHandlerRenderService } from "./event-handler-render.service";

describe("EventHandlerRenderService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventHandlerRenderService]
    });
  });

  it("should be created", inject([EventHandlerRenderService], (service: EventHandlerRenderService) => {
    expect(service).toBeTruthy();
  }));
});
