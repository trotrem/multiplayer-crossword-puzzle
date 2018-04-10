import { Component, OnInit } from '@angular/core';
import { SocketsService } from "../sockets.service";
import { ActivatedRoute } from "@angular/router";
import { CrosswordEvents, CrosswordLobbyGame } from "../../../../../common/communication/events";

@Component({
    selector: 'app-multiplayer-lobby',
    templateUrl: './multiplayer-lobby.component.html',
    styleUrls: ['./multiplayer-lobby.component.css']
})
export class MultiplayerLobbyComponent implements OnInit {

    public lobbyGames: CrosswordLobbyGame[];

    constructor(private socketsService: SocketsService, private route: ActivatedRoute) {
        this.lobbyGames = [];
    }

    ngOnInit() {
        this.socketsService.onEvent(CrosswordEvents.FetchedOpenGames).first().subscribe((games: CrosswordLobbyGame[]) => { this.lobbyGames = games; });
        this.route.params.subscribe((params) => { this.socketsService.sendEvent(CrosswordEvents.GetOpenGames, params["Difficulty"]); });
    }

}
