import { Component, OnInit } from "@angular/core";
import { CommunicationService } from "../communication.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-waiting-room",
  templateUrl: "./waiting-room.component.html",
  styleUrls: ["./waiting-room.component.css"]
})
export class WaitingRoomComponent implements OnInit {

    public constructor(private router: Router, private communicationService: CommunicationService) { }

    public ngOnInit(): void {
        this.communicationService.onOpponentFound().subscribe(() => this.router.navigate(["/crossword/game"]));
    }
}
