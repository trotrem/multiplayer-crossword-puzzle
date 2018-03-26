import { async, ComponentFixture, TestBed, inject } from "@angular/core/testing";

import { GameResultsComponent } from "./game-results.component";
import { ActivatedRoute } from "@angular/router";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

describe("GameResultsComponent", () => {
  let route: ActivatedRoute;
  let http: HttpClient;
  let component: GameResultsComponent = new GameResultsComponent(route, http);
  let fixture: ComponentFixture<GameResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, FormsModule],
      declarations: [GameResultsComponent]
    })
      .compileComponents();
  }));

  beforeEach(inject([ ActivatedRoute, HttpClient], ( _route: ActivatedRoute, _http: HttpClient) => {
    route = _route;
    http = _http;
    fixture = TestBed.createComponent(GameResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
