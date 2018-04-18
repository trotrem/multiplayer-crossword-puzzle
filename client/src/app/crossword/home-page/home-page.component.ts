import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { SocketsService } from "../sockets.service";
import { inject } from "inversify";
import { CrosswordEvents } from "../../../../../common/communication/events";
import { Difficulty } from "../../../../../common/communication/types";
import { CommunicationService } from "../communication.service";
import { GameConfigurationService } from "../game-configuration.service";

@Component({
    selector: "app-home-page",
    templateUrl: "./home-page.component.html",
    styleUrls: ["./home-page.component.css"],
})
export class HomePageComponent implements OnInit {

    // TODO changer les noms osti
    public playersNumber: number;
    public difficultyGrade: number;
    public playerName: string;

    public constructor(private router: Router,
                       private communicationService: CommunicationService,
                       private gameConfiguration: GameConfigurationService) {
        this.playersNumber = 2;
        this.difficultyGrade = 0;
        this.playerName = "";
    }

    public ngOnInit(): void {
    }

    public disablePlayButton(): boolean {
        return this.playersNumber === 2 && this.playerName.length === 0;
    }

    public disableJoinButton(): boolean {
        return this.playersNumber === 1 || this.playerName.length === 0;
    }

    public play(): void {
        this.communicationService.intiateGame(this.difficultyGrade, this.playerName, this.playersNumber);
        this.gameConfiguration.configureGame(this.difficultyGrade, this.playerName, this.playersNumber);
        if (this.playersNumber === 1) {
            this.router.navigate(["/crossword/game"]);
        } else {
            this.router.navigate(["/crossword/waiting"]);
        }
    }

    // todo rename
    public joinExisting(): void {
        this.gameConfiguration.configureGame(this.difficultyGrade, this.playerName, this.playersNumber);
        this.router.navigate(["/crossword/lobby"]);
    }
}
