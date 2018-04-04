import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ResultRaceComponent } from "./result-race.component";

describe("ResultRaceComponent", () => {
  let component: ResultRaceComponent;
  let fixture: ComponentFixture<ResultRaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultRaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultRaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
