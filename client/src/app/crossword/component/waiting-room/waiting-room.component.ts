import { Component, OnInit } from "@angular/core";
import { CommunicationService } from "../../services/communication/communication.service";
import { Router } from "@angular/router";
import { GameConfigurationService } from "../../services/game-configuration/game-configuration.service";
import { IConnectionInfo } from "../../../../../../common/communication/events-crossword";

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
            if (opponent !== undefined && opponent !== null) {
                this.gameConfig.opponentName = opponent.player;
            }
            this.router.navigate([GAME_URL]);
        });
    }
}
