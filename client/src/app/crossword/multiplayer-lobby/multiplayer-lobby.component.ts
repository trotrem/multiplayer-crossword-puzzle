import { Component, OnInit } from "@angular/core";
import { SocketsService } from "../sockets.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CrosswordEvents, CrosswordLobbyGame } from "../../../../../common/communication/events";
import { GameConfigurationService } from "../game-configuration.service";

@Component({
    selector: "app-multiplayer-lobby",
    templateUrl: "./multiplayer-lobby.component.html",
    styleUrls: ["./multiplayer-lobby.component.css"]
})
export class MultiplayerLobbyComponent implements OnInit {

    public lobbyGames: CrosswordLobbyGame[];
    private _playerName: string;

    public constructor(private socketsService: SocketsService,
                       private gameConfiguration: GameConfigurationService,
                       private router: Router) {
        this.lobbyGames = [];
    }

    // TODO passr par le communication service
    public ngOnInit(): void {
        this.socketsService.onEvent(CrosswordEvents.FetchedOpenGames)
            .first()
            .subscribe((games: CrosswordLobbyGame[]) => { this.lobbyGames = games; });
        this.socketsService.sendEvent(CrosswordEvents.GetOpenGames, this.gameConfiguration.difficulty);
        this._playerName = this.gameConfiguration.playerName;
    }

    public joinGame(game: CrosswordLobbyGame): void {
        this.socketsService.sendEvent(CrosswordEvents.JoinGame, { name: this._playerName, gridId: game.gameId });
        this.router.navigate(["/crossword/game/"]);
    }
}
