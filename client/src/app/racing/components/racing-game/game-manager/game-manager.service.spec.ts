import { TestBed, inject } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { GameManagerService } from "./game-manager.service";
import { RenderService } from "../render-service/render.service";
import { RouterTestingModule } from "@angular/router/testing";
import { RacingCommunicationService } from "../../../communication.service/communicationRacing.service";
import { RaceValidatorService } from "../race-validator/race-validator.service";
import { WallsCollisionsService } from "../walls-collisions-service/walls-collisions-service";

describe("GameManagerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameManagerService, RenderService, RacingCommunicationService, RaceValidatorService, WallsCollisionsService],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])]
    });
  });

  it("should be created", inject([GameManagerService], (service: GameManagerService) => {
    expect(service).toBeTruthy();
  }));
});
