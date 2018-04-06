import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AdminComponent } from "./admin.component";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { Track } from "../../track";
import { RacingCommunicationService } from "../../communication.service/communicationRacing.service";
import { FormsModule } from "@angular/forms";

import * as THREE from "three";
import { EditorComponent } from "../editor/editor.component";
import { NewScores, BestScores } from "../../../../../../common/communication/interfaces";

/* tslint:disable:no-magic-numbers no-floating-promises */

describe("AdminComponent", () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let router: Router;
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
    expect(component.getTracksList()).toBeDefined();
  });
  it("should select a track from track's list", () => {
    // tslint:disable-next-line:prefer-const
    let track: Track;
    component.onSelect(track);
    expect(component.getisSelected()).toBe(true);
    expect(component.getSelectedTrack()).toBe(track);
  });
  it("should edit a track from track's list when selected", () => {
    // tslint:disable-next-line:prefer-const
    const track: Track = {
      name: "Laurence", description: "", startingZone: new THREE.Line3, points: new Array<THREE.Vector3>(), usesNumber: 0,
      newScores: new Array<NewScores>(), bestScores: new Array<BestScores>()
    };
    component.onSelect(track);
    component.editTrack();
    expect(component.editTrack()).toBe(track);
  });
  it("should delete a track from track's list when selected", () => {

    // tslint:disable-next-line:prefer-const
    const track: Track = {
      name: "Laurence", description: "", startingZone: new THREE.Line3, points: new Array<THREE.Vector3>(), usesNumber: 0,
      newScores: new Array<NewScores>(), bestScores: new Array<BestScores>()
    };
    const tracks: Track[] = new Array<Track>();
    tracks.push(track);
    component.setTracks(tracks);
    component.onSelect(track);
    component.deleteTrack();
    expect(component.deleteTrack()).toBe(track);
  });

  it('navigate to " "editor/:name"" takes you to  "editor/:name"', fakeAsync(() => {
    const name: string = "Laurence";
    router.navigateByUrl("/editor/" + name);
    /* tslint:disable */
    tick(50);
    expect(router.url).toBe("/editor/" + name);
  }));
});
