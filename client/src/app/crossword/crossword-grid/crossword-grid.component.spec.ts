import { async, ComponentFixture, TestBed, inject } from "@angular/core/testing";
import { Router, ActivatedRoute } from "@angular/router";
import { CrosswordGridComponent } from "./crossword-grid.component";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";

describe("CrosswordGridComponent", () => {
  let router: Router;
  let route: ActivatedRoute;
  let http: HttpClient;
  let component: CrosswordGridComponent = new CrosswordGridComponent(http, route, router);
  let fixture: ComponentFixture<CrosswordGridComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [CrosswordGridComponent],
      imports: [HttpClientModule, RouterTestingModule.withRoutes([])]
    })
      .compileComponents();
  }));

  beforeEach(inject([Router, ActivatedRoute, HttpClient], (_router: Router, _route: ActivatedRoute, _http: HttpClient) => {
    router = _router;
    route = _route;
    http = _http;
    fixture = TestBed.createComponent(CrosswordGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeDefined();
  });
});
