import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AdminComponent } from "./admin.component";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ITrack } from "../../track";
import { RacingCommunicationService } from "../../communication.service/communicationRacing.service";
import { FormsModule } from "@angular/forms";
import * as THREE from "three";
import { EditorComponent } from "../editor/editor.component";
import { INewScores, IBestScores } from "../../../../../../common/communication/interfaces";

/* tslint:disable:no-magic-numbers*/
describe("AdminComponent", () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let router: Router;
  const track: ITrack = {
    name: "Laurence", description: "", startingZone: new THREE.Line3, points: new Array<THREE.Vector3>(), usesNumber: 0,
    INewScores: new Array<INewScores>(), IBestScores: new Array<IBestScores>()
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminComponent, EditorComponent],
      imports: [
        FormsModule,
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: "editor/:name", component: EditorComponent }])]
      ,
      providers: [RacingCommunicationService]
    })
      .compileComponents();
    fixture = TestBed.createComponent(AdminComponent);

  }));
  beforeEach(inject([Router], (_router: Router) => {
    router = _router;
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create admin component", () => {
    expect(component).toBeTruthy();
  });
  it("should containts a tracks's list", () => {
    expect(component.tracks).toBeDefined();
  });
  it("should select a track from track's list", () => {
    component.onSelect(track);
    expect(component.selectedTrack).toBe(track);
  });
  it("should edit a track from track's list when selected", () => {

    component.onSelect(track);
    component.editTrack();
    expect(component.editTrack()).toBe(track);
  });
  it("should delete a track from track's list when selected", () => {

    const tracks: ITrack[] = new Array<ITrack>();
    tracks.push(track);
    component.tracks = tracks;
    component.onSelect(track);
    component.deleteTrack();
    expect(component.deleteTrack()).toBe(track);
  });

  it('navigate to " "editor/:name"" takes you to  "editor/:name"', fakeAsync(() => {
    const name: string = "Laurence";
    router.navigateByUrl("/editor/" + name);
    tick(50);
    expect(router.url).toBe("/editor/" + name);
  }));
});
