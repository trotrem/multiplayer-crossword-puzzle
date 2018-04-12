import { TestBed, inject } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { GameManagerService } from "./game-manager.service";
import { RenderGameService } from "../render-game-service/render-game.service";
import { RouterTestingModule } from "@angular/router/testing";
import { RacingCommunicationService } from "../../../communication.service/communicationRacing.service";
// import { RaceValidatorService } from "../race-validator/race-validator.service";
import { WallsCollisionsService } from "../walls-collisions-service/walls-collisions-service";
import { KeyboardService } from "../commands/keyboard.service";
import { SceneGameService } from "../scene-game-service/scene-game-service.service";

describe("GameManagerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GameManagerService, RenderGameService, RacingCommunicationService,
        WallsCollisionsService, KeyboardService, SceneGameService],
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
