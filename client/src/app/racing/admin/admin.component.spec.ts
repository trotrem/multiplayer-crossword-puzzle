import { async, ComponentFixture, TestBed, inject, fakeAsync, tick} from "@angular/core/testing";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AdminComponent } from "./admin.component";
import { Routes, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { Track } from "../track-savor/track";
import { AdminService } from "./../admin.service/admin.service";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { EditorComponent } from "../editor/editor.component";

describe("AdminComponent", () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminComponent ],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [AdminService]
    })
    .compileComponents();
    fixture = TestBed.createComponent(AdminComponent);
    debugElement = fixture.debugElement;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create admin component", () => {
    expect(component).toBeTruthy();
  });
  it("should containts a tracks's list", () => {
    expect(component.getTracksList()).toBeDefined();
  });
  it("should select a track from track's list", () => {
    const track: Track = new Track();
    component.onSelect(track);
    expect(component.getisSelected()).toBe(true);
    expect(component.getSelectedTrack()).toBe(track);
  });
  it("should edit a track from track's list when selected", () => {
    const track: Track = new Track();
    component.onSelect(track);
    component.editTrack();
    expect(component.editTrack()).toBe(track);
  });
  it("should delete a track from track's list when selected", () => {

    const track: Track = new Track();
    const tracks: Track[] = new Array<Track>();
    tracks.push(track);
    component.setTracks(tracks);
    component.onSelect(track);
    component.deleteTrack();
    expect(component.deleteTrack()).toBe(track);
  });
});
