import { TestBed, inject, async } from "@angular/core/testing";
import * as THREE from "three";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { Track } from "../track";
import { RacingCommunicationService } from "./communicationRacing.service";

describe("RacingCommunicationService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [RacingCommunicationService]
    });
  });

  it("should be created", inject([RacingCommunicationService], (service: RacingCommunicationService) => {
    expect(service).toBeTruthy();
  }));

  it("should issue a DELETE request", async(
    inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {
      const name: String = "Laurence";
      http.delete("http://localhost:3000/racing/deleteTrack/" + name).subscribe();
      backend.expectOne({
        url: "http://localhost:3000/racing/deleteTrack/" + name,
        method: "DELETE"
      });
    })
  )
  );

  it("should issue a POST request", async(
    inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {
      const track: Track = {
        name: "Laurence", description: "", startingZone: new THREE.Line3, points: new Array<THREE.Vector3>(), usesNumber: 0,
        newScores: new Array<number>()
    };
      http.post("http://localhost:3000/racing/track", JSON.stringify(track)).subscribe();
      backend.expectOne({
        url: "http://localhost:3000/racing/track" + name,
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

  it("should issue a GET request find all", async(
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
