import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RacePlayComponent } from "./race-play.component";

describe("RacePlayComponent", () => {
  let component: RacePlayComponent;
  let fixture: ComponentFixture<RacePlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RacePlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RacePlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
