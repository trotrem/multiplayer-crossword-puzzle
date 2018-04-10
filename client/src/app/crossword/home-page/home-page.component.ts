import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { SocketsService } from "../sockets.service";
import { inject } from "inversify";
import { CrosswordEvents } from "../../../../../common/communication/events";
import { Difficulty } from "../../../../../common/communication/types";

@Component({
    selector: "app-home-page",
    templateUrl: "./home-page.component.html",
    styleUrls: ["./home-page.component.css"]
})
export class HomePageComponent implements OnInit {

    public oneTwo: number;
    public EasyMediumHard: Difficulty;
    public playerName: string;

    public constructor(private router: Router) {
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
        this.router.navigate(["/crossword/" + form.value.Difficulty + "/", { playerName: form.value.playerName }]);
    }

    public joinExisting(form: NgForm): void {
        this.router.navigate(["/crossword/lobby/" + form.value.EasyMediumHard, { playerName: form.value.playerName }]);
    }
}
