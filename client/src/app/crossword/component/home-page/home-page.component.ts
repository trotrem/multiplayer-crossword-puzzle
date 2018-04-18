import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SocketsService } from "../../sockets.service";
import { inject } from "inversify";
import { CrosswordEvents } from "../../../../../../common/communication/events";
import { Difficulty } from "../../../../../../common/communication/types";
import { CommunicationService } from "../../communication.service";
import { GameConfigurationService } from "../../game-configuration.service";

const GAME_URL: string = "/crossword/game";
const WAITING_ROOM_URL: string = "/crossword/waiting";
const LOBBY_URL: string = "/crossword/lobby";

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
        this.numberPlayers = 2;
        this.difficultyGrade = 0;
        this.playerName = "";
    }

    public ngOnInit(): void {
    }

    public disablePlayButton(): boolean {
        return this.numberPlayers === 2 && this.playerName.length === 0;
    }

    public disableJoinButton(): boolean {
        return this.numberPlayers === 1 || this.playerName.length === 0;
    }

    public play(): void {
        this.communicationService.intiateGame(this.difficultyGrade, this.playerName, this.numberPlayers);
        this.gameConfiguration.configureGame(this.difficultyGrade, this.playerName, this.numberPlayers);
        if (this.numberPlayers === 1) {
            this.router.navigate(["/crossword/game"]);
        } else {
            this.router.navigate([WAITING_ROOM_URL]);
        }
    }

    public joinGame(): void {
        this.gameConfiguration.configureGame(this.difficultyGrade, this.playerName, this.numberPlayers);
        this.router.navigate(["/crossword/lobby"]);
    }
}
