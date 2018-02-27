import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CrosswordGridComponent } from "./crossword-grid.component";
import { HttpClientModule } from "@angular/common/http";

describe("CrosswordGridComponent", () => {
  let component: CrosswordGridComponent;
  let fixture: ComponentFixture<CrosswordGridComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [CrosswordGridComponent],
      imports: [ HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrosswordGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeDefined();
  });
});
