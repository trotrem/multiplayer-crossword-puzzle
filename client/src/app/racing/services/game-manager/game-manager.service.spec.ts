import { TestBed, inject } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { GameManagerService } from "./game-manager.service";
import { RenderGameService } from "../render-game/render-game.service";
import { RouterTestingModule } from "@angular/router/testing";
import { RacingCommunicationService } from "../communication/communicationRacing.service";
import { WallsCollisionsService } from "../walls-collisions/walls-collisions-service";
import { KeyboardEventService } from "../../commands/keyboard-event.service";
import { SceneGameService } from "../scene-game/scene-game-service.service";
import { WallService } from "../walls-collisions/walls";
import { CarsCollisionService } from "../../components/racing-game/car/cars-collision/cars-collision.service";

describe("GameManagerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                GameManagerService, WallService, RenderGameService, RacingCommunicationService,
                WallsCollisionsService, KeyboardEventService, SceneGameService, CarsCollisionService],
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
