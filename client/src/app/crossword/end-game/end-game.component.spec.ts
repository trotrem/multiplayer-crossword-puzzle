import { async, ComponentFixture, TestBed, fakeAsync, tick, inject } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Location } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { EndGameComponent } from "./end-game.component";
import { HomePageComponent } from "../home-page/home-page.component";
import { Router, ActivatedRoute } from "@angular/router";

describe("EndGameComponent", () => {
  let router: Router;
  let route: ActivatedRoute;
  let component: EndGameComponent = new EndGameComponent(route, router);
  let fixture: ComponentFixture<EndGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule.withRoutes([{ path: "homePage", component: HomePageComponent }])],
      declarations: [EndGameComponent, HomePageComponent]
    })
      .compileComponents();
  }));

  beforeEach(inject([Router, ActivatedRoute], (_router: Router, _route: ActivatedRoute) => {
    route = _route;
    router = _router;
    fixture = TestBed.createComponent(EndGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  /* it('navigate to "homePage" takes you to /homePage', fakeAsync(
     inject([Router], (router: Router) => {
       router.navigate(["homePage"]);
       // tick(50);
       expect(router.url).toBe("/homePage");
     })));*/
});
