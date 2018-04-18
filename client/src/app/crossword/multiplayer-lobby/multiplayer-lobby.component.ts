import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ILobbyGames, IConnectionInfo, ILobbyRequest } from "../../../../../common/communication/events";
import { GameConfigurationService } from "../game-configuration.service";
import { CommunicationService } from "../communication.service";

@Component({
    selector: "app-multiplayer-lobby",
    templateUrl: "./multiplayer-lobby.component.html",
    styleUrls: ["./multiplayer-lobby.component.css"]
})
export class MultiplayerLobbyComponent implements OnInit {

    public lobbyGames: IConnectionInfo[];
    private _settings: IConnectionInfo;

    public constructor(private communicationService: CommunicationService,
                       private gameConfiguration: GameConfigurationService,
                       private router: Router) {
        this.lobbyGames = [];
        this._settings = { player: this.gameConfiguration.playerName, gameId: undefined };
    }

    public ngOnInit(): void {
        this.communicationService.sendEventOnGamesFetched()
            .subscribe((lobby: ILobbyGames) => {
                this.lobbyGames = lobby.games; });

        this.communicationService.fetchOpenGames({gameId: undefined, difficulty: this.gameConfiguration.difficulty} as ILobbyRequest);
    }

    public joinGame(game: IConnectionInfo): void {
        this._settings.gameId = game.gameId;
        this.communicationService.joinGame(this._settings);
        this.router.navigate(["/crossword/game/"]);
    }
}
