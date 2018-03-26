import { async, ComponentFixture, TestBed, inject } from "@angular/core/testing";
import { Routes, Router, ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { GameResultsComponent } from "./game-results.component";
import { FormsModule} from "@angular/forms";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { Track } from "./../track";
import * as THREE from "three";
import { CommunicationRacingService } from "../communication.service/communicationRacing.service";
describe("GameResultsComponent", () => {
  let component: GameResultsComponent;
  let fixture: ComponentFixture<GameResultsComponent>;
  let http: HttpClient;
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
          { path: "gameResults/:CarIndex", component: GameResultsComponent}])],
      providers: [CommunicationRacingService]
    })
      .compileComponents();
    fixture = TestBed.createComponent(GameResultsComponent);

  }));

  beforeEach(inject([Router], (_http: HttpClient, _route: ActivatedRoute) => {
    http = _http;
    route = _route = new ActivatedRoute();
    fixture = TestBed.createComponent(GameResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should get a track by name", async() => {
    expect(component.getTrack(track.name)).toBeDefined();
  });
  it("should return the track's newScores  ", async() => {
    route.snapshot.params = {params: track.name};
    component.getTrack(track.name);
    expect(component.scores === track.newScores).toBe(true);
  });

});
