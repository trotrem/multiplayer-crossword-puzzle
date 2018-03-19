import { async, ComponentFixture, TestBed, inject } from "@angular/core/testing";

import { HomePageComponent } from "./home-page.component";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";

describe("HomePageComponent", () => {
  let router: Router;
  let component: HomePageComponent = new HomePageComponent(router);
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomePageComponent],
      imports: [FormsModule, RouterTestingModule.withRoutes([])]
    })
      .compileComponents();
  }));

  beforeEach(inject([Router], (_router: Router) => {
    router = _router;
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
