import { TestBed, inject, async } from "@angular/core/testing";
import { UserService } from "./user.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

describe("UserService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [UserService]
    });
  });

  it("should be created", inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));

  it("should issue a GET request all tracks", async(
    inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {
      http.get("http://localhost:3000/racing/user").subscribe();
      backend.expectOne({
        url: "http://localhost:3000/racing/user",
        method: "GET"
      });
    })
  )
  );
  it("should issue a GET request one track", async(
    inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {
      const name: string = "Amal";
      http.get("http://localhost:3000/racing/user/" + name).subscribe();
      backend.expectOne({
        url: "http://localhost:3000/racing/user/" + name,
        method: "GET"
      });
    })
  )
  );
});
