import { async, ComponentFixture, TestBed, inject } from "@angular/core/testing";
import { Router, ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { GameResultsComponent } from "./game-results.component";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Track } from "./../../track";
import * as THREE from "three";
import { RacingCommunicationService } from "../../communication.service/communicationRacing.service";
describe("GameResultsComponent", () => {
  let component: GameResultsComponent;
  let fixture: ComponentFixture<GameResultsComponent>;
  let route: ActivatedRoute;
  const track: Track = {
    name: "Laurence", description: "", startingZone: new THREE.Line3, points: new Array<THREE.Vector3>(), usesNumber: 0,
    newScores: new Array<number>()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GameResultsComponent],
      imports: [
        FormsModule,
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: "gameResults/:CarIndex", component: GameResultsComponent }])],
      providers: [RacingCommunicationService]
    })
      .compileComponents();
    fixture = TestBed.createComponent(GameResultsComponent);

  }));

  beforeEach(inject([Router], (_route: ActivatedRoute) => {
    route = _route;
    fixture = TestBed.createComponent(GameResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should get a track by name", async () => {
    expect(component.getTrack(track.name)).toBeDefined();
  });
  it("should return the track's newScores  ", async () => {
    route.snapshot.params = { params: track.name };
    component.getTrack(track.name);
    expect(component.scores === track.newScores).toBe(true);
  });

});
