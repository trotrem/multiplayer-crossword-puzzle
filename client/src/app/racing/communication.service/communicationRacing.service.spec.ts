import { TestBed, inject, async } from "@angular/core/testing";

import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { Track } from "../track-savor/track";
import { CommunicationRacingService } from "./communicationRacing.service";

describe("CommunicationRacingService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [CommunicationRacingService]
    });
  });

  it("should be created", inject([CommunicationRacingService], (service: CommunicationRacingService) => {
    expect(service).toBeTruthy();
  }));

  it("should issue a DELETE request", async(
    inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {
      const track: Track = new Track();
      track.name = "Laurence";
      http.delete("http://localhost:3000/racing/deleteTrack/" + track.name).subscribe();
      backend.expectOne({
        url: "http://localhost:3000/racing/deleteTrack/" + track.name,
        method: "DELETE"
      });
    })
  )
  );

  it("should issue a POST request", async(
    inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {
      const track: Track = new Track();
      http.post("http://localhost:3000/racing/track", JSON.stringify(track)).subscribe();
      backend.expectOne({
        url: "http://localhost:3000/racing/track" + track.name,
        method: "POST"
      });
    })
  )
  );

  it("should issue a GET request findByName", async(
    inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {
      const name: string = "Amal";
      http.get("http://localhost:3000/racing/findOne/" + name).subscribe();
      backend.expectOne({
        url: "http://localhost:3000/racing/findOne/" + name,
        method: "GET"
      });
    })
  )
  );

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

});
