import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { Difficulty, GridData, WordValidationParameters } from "../../../../common/communication/types";

@Injectable()
export class CommunicationService {

  public constructor(private http: HttpClient) { }

  public fetchCheatModeWords(id: number): Observable<string[]> {
    return this.http.get<string[]>("http://localhost:3000/crossword/cheatwords/" + id);
  }

  public fetchGrid(difficulty: Difficulty): Observable<GridData> {
    return this.http.get<GridData>("http://localhost:3000/crossword/grid/" + difficulty.valueOf());

  }

  public validate(parameters: WordValidationParameters): void {
    const headers: HttpHeaders = new HttpHeaders()
      .set("Authorization", "my-auth-token")
      .set("Content-Type", "application/json");

    this.http.post(
      "http://localhost:3000/crossword/validate",
      JSON.stringify(parameters),
      { headers: headers }).subscribe((data) => { });
  }

}
