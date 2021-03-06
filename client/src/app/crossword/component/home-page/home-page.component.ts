import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommunicationService } from "../../services/communication/communication.service";
import { GameConfigurationService } from "../../services/game-configuration/game-configuration.service";

const GAME_URL: string = "/game";
const WAITING_ROOM_URL: string = "/waiting";
const LOBBY_URL: string = "/lobby";

@Component({
    selector: "app-home-page",
    templateUrl: "./home-page.component.html",
    styleUrls: ["./home-page.component.css"],
})
export class HomePageComponent implements OnInit {

    public numberPlayers: number;
    public difficultyGrade: number;
    public playerName: string;

    public constructor(private router: Router,
                       private communicationService: CommunicationService,
                       private gameConfiguration: GameConfigurationService) {
        this.numberPlayers = 1;
        this.difficultyGrade = 0;
        this.playerName = "";
    }

    public ngOnInit(): void {
        this.communicationService.initialize();
    }

    public disablePlayButton(): boolean {
        return this.numberPlayers === 2 && this.playerName.length === 0;
    }

    public disableJoinButton(): boolean {
        return this.numberPlayers === 1 || this.playerName.length === 0;
    }

    public play(): void {
        this.communicationService.initiateGame(this.difficultyGrade, this.playerName, this.numberPlayers);
        this.gameConfiguration.configureGame(this.difficultyGrade, this.playerName, this.numberPlayers);
        if (this.numberPlayers === 1) {
            this.router.navigate([GAME_URL]);
        } else {
            this.router.navigate([WAITING_ROOM_URL]);
        }
    }

    public joinGame(): void {
        this.gameConfiguration.configureGame(this.difficultyGrade, this.playerName, this.numberPlayers);
        this.router.navigate([LOBBY_URL]);
    }
}
