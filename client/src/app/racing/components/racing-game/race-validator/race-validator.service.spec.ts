import { TestBed, inject, fakeAsync, tick } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RaceValidatorService } from "./race-validator.service";
import { RouterTestingModule } from "@angular/router/testing";
import { GameResultsComponent } from "../../game-results/game-results.component";
import { FormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import * as THREE from "three";
import { RacingCommunicationService } from "../../../communication.service/communicationRacing.service";
// "magic numbers" utilisés pour les tests
/* tslint:disable:no-magic-numbers */

describe("RaceValidatorService", () => {
  let router: Router;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameResultsComponent],
      providers: [RaceValidatorService, RacingCommunicationService],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule.withRoutes([{ path: "gameResults/:CarIndex", component: GameResultsComponent }])]
    });
  });

  beforeEach(inject([Router, HttpClient], (_router: Router, _http: HttpClient) => {
    router = _router;
    http = _http;
  }));

  it("should be created", inject([RaceValidatorService], (service: RaceValidatorService) => {
    expect(service).toBeTruthy();
  }));
  it("should return true when a car passed by a Lap Verifier", inject([RaceValidatorService], (service: RaceValidatorService) => {
    expect(service.getLapSectionValidator(new THREE.Vector3(1, 2, 0), new THREE.Vector3(1, 2, 0))).toBeTruthy();
  }));

  it("should return false when a car is far from a Lap Verifier", inject([RaceValidatorService], (service: RaceValidatorService) => {
    expect(service.getLapSectionValidator(new THREE.Vector3(1, 0, 0), new THREE.Vector3(100, 20, 0))).toBe(false);
  }));

  it('navigate to "gameResults/:CarIndex" takes you to  ""gameResults/:CarIndex"', fakeAsync(() => {
    const carIndex: number = 0;
    router.navigateByUrl("/gameResults/" + carIndex);
    tick(50);
    expect(router.url).toBe("/gameResults/" + carIndex);
  }));

  it("shouldn't validate a race when a less than 3 lap ", inject([RaceValidatorService], async (service: RaceValidatorService) => {
    service.counter[0] = 2;
    await service.validateRace(0, 0, 0);
    expect(service.router.navigated).toBe(false);
  }));
});
