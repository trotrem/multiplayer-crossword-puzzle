import { Component, OnInit } from "@angular/core";
import { CommunicationService } from "../../communication.service";
import { Router } from "@angular/router";
import { GameConfigurationService } from "../../game-configuration.service";
import { IConnectionInfo } from "../../../../../../common/communication/events";

const GAME_URL: string = "/crossword/game";

@Component({
  selector: "app-waiting-room",
  templateUrl: "./waiting-room.component.html",
  styleUrls: ["./waiting-room.component.css"]
})
export class WaitingRoomComponent implements OnInit {

    public constructor(private router: Router,
                       private communicationService: CommunicationService,
                       private gameConfig: GameConfigurationService) { }

    public ngOnInit(): void {
        this.communicationService.sendEventOnOpponentFound().subscribe((opponent: IConnectionInfo) => {
            if (opponent !== undefined) {
                this.gameConfig.opponentName = opponent.player;
            }
            this.router.navigate([GAME_URL]);
        });
    }
}
