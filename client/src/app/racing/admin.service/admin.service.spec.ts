import { TestBed, inject, async } from "@angular/core/testing";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

import { AdminService } from "./admin.service";
import { Track } from "../editeur/track";

describe("AdminService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        AdminService]
    });
  });

  it("should be created", inject([AdminService], (service: AdminService) => {
    expect(service).toBeTruthy();
  }));

  it("should issue a GET request", async(
    inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {
      http.get("http://localhost:3000/racing/admin").subscribe();
      backend.expectOne({
        url: "http://localhost:3000/racing/admin",
        method: "GET"
      });
    })
  )
  );

  it("should issue a DELETE request", async(
    inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {
      const track: Track = new Track();
      track.name = "Laurence";
      http.get("http://localhost:3000/racing/deleteTrack/" + track.name).subscribe();
      backend.expectOne({
        url: "http://localhost:3000/racing/deleteTrack/" + track.name,
        method: "GET"
      });
    })
  )
  );

});
