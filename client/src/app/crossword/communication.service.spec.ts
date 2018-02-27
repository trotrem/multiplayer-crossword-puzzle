import { TestBed, inject, async } from "@angular/core/testing";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { Difficulty, IWordValidationParameters } from "../../../../common/communication/types";

import { CommunicationService } from "./communication.service";

describe("CommunicationService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        CommunicationService]
    });
  });

  it("should be created", inject([CommunicationService], (service: CommunicationService) => {
    expect(service).toBeTruthy();
  }));

  it("should issue a GET request when difficulty selected", async(
    inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {
      const _difficulty: Difficulty = "easy";
      http.get("http://localhost:3000/crossword/grid/" + _difficulty.valueOf()).subscribe() ;
      backend.expectOne({
        url: "http://localhost:3000/crossword/grid/" + _difficulty.valueOf(),
        method: "GET"
      });
    })
  )
  );

  it("should issue a GET request when id selected", async(
    inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {
      const id: number = 1;
      http.get("http://localhost:3000/crossword/grid/" + id).subscribe() ;
      backend.expectOne({
        url: "http://localhost:3000/crossword/grid/" + id,
        method: "GET"
      });
    })
  )
  );
  it("should issue a post request", async(
    inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {
      const parameters: IWordValidationParameters = {
        gridId: 1 ,
        word: "word",
        wordIndex: 2
    };
      http.post("http://localhost:3000/crossword/validate", JSON.stringify(parameters)).subscribe();
      backend.expectOne({
        url: "http://localhost:3000/crossword/validate",
        method: "POST"
      });
    })
  )
  );
});
