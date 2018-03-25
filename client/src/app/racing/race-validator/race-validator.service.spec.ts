import { TestBed, inject, fakeAsync, tick } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RaceValidatorService } from "./race-validator.service";
import { RouterTestingModule } from "@angular/router/testing";
import { GameResultsComponent } from "../game-results/game-results.component";
import { FormsModule } from "@angular/forms";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpClientModule, HttpClient } from "@angular/common/http";
// "magic numbers" utilisés pour les tests
/* tslint:disable:no-magic-numbers */

describe("RaceValidatorService", () => {
  let router: Router;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameResultsComponent],
      providers: [RaceValidatorService],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule.withRoutes([{ path: "gameResults/:CarIndex", component: GameResultsComponent }])]
    });
  });

  beforeEach(inject([Router], (_router: Router) => {
    router = _router;
  }));

  it("should be created", inject([RaceValidatorService], (service: RaceValidatorService) => {
    expect(service).toBeTruthy();
  }));

  it('navigate to "gameResults/:CarIndex" takes you to  ""gameResults/:CarIndex"', fakeAsync(() => {
    const carIndex: number = 0;
    router.navigateByUrl("/gameResults/" + carIndex);
    tick(50);
    expect(router.url).toBe("/gameResults/" + carIndex);
  }));
});
