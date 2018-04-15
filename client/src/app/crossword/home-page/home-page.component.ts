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

    // todo changer les noms osti
    public oneTwo: number;
    public EasyMediumHard: number;
    public playerName: string;

    public constructor(private router: Router,
                       private communicationService: CommunicationService,
                       private gameConfiguration: GameConfigurationService) {
        this.oneTwo = 2;
        this.EasyMediumHard = 0;
        this.playerName = "";
    }

    public ngOnInit(): void {
    }

    public disablePlayButton(): boolean {
        return this.oneTwo === 2 && this.playerName.length === 0;
    }

    public disableJoinButton(): boolean {
        return this.oneTwo === 1 || this.playerName.length === 0;
    }

    public play(form: NgForm): void {
        this.communicationService.createGame(this.EasyMediumHard, this.playerName, this.oneTwo);
        this.gameConfiguration.configureGame(this.EasyMediumHard, this.playerName, this.oneTwo);
        if (this.oneTwo === 1) {
            this.router.navigate(["/crossword/game/"]);
        } else {
            this.router.navigate(["/crossword/waiting"]);
        }
    }

    // todo rename
    public joinExisting(form: NgForm): void {
        this.gameConfiguration.configureGame(this.EasyMediumHard, this.playerName, this.oneTwo);
        this.router.navigate(["/crossword/lobby/"]);
    }
}
