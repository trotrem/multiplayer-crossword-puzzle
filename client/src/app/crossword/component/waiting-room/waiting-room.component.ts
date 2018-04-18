import { Component, OnInit } from "@angular/core";
import { CommunicationService } from "../../communication.service";
import { Router } from "@angular/router";

const GAME_URL: string = "/crossword/game";

@Component({
  selector: "app-waiting-room",
  templateUrl: "./waiting-room.component.html",
  styleUrls: ["./waiting-room.component.css"]
})
export class WaitingRoomComponent implements OnInit {

    public constructor(private router: Router, private communicationService: CommunicationService) { }

    public ngOnInit(): void {
        this.communicationService.sendEventOnOpponentFound().subscribe(() => this.router.navigate(["/crossword/game"]));
    }
}
