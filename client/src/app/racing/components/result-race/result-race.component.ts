import { Component, OnInit } from "@angular/core";
import { RacingCommunicationService } from "../../communication.service/communicationRacing.service";
import { inject } from "inversify";
import { Router } from "@angular/router";
@Component({
  selector: "app-result-race",
  templateUrl: "./result-race.component.html",
  styleUrls: ["./result-race.component.css"]
})
export class ResultRaceComponent implements OnInit {

public constructor(@inject(RacingCommunicationService) private communicationService: RacingCommunicationService, private router: Router) { }

public ngOnInit(): void {
  }
private navigateToGameResults(): void {
    this.router.navigateByUrl("/gameResults/" );
  }
}
