import { TestBed, inject } from "@angular/core/testing";
import { UserService } from "./user.service";
import { HttpClient, HttpClientModule  } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

describe("UserService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [UserService,
                  HttpClient]
    });
  });

  it("should be created", inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
