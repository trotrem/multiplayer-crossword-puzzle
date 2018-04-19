import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ILobbyGames, IConnectionInfo, ILobbyRequest } from "../../../../../../common/communication/events-crossword";
import { GameConfigurationService } from "../../services/game-configuration/game-configuration.service";
import { CommunicationService } from "../../services/communication/communication.service";
import { Difficulty } from "../../../../../../common/communication/types-crossword";

const GAME_URL: string = "/crossword/game";

@Component({
    selector: "app-multiplayer-lobby",
    templateUrl: "./multiplayer-lobby.component.html",
    styleUrls: ["./multiplayer-lobby.component.css"]
})
export class MultiplayerLobbyComponent implements OnInit {

    public lobbyGames: IConnectionInfo[];

    public get difficulty(): string {
        return Difficulty[this.gameConfiguration.difficulty];
    }

    public constructor( private communicationService: CommunicationService,
                        private gameConfiguration: GameConfigurationService,
                        private router: Router) {

        this.lobbyGames = [];
    }

    public ngOnInit(): void {
        this.communicationService.sendEventOnGamesFetched()
            .subscribe((lobby: ILobbyGames) => {
                this.lobbyGames = lobby.games;
            });

        this.communicationService.fetchOpenGames({ gameId: undefined, difficulty: this.gameConfiguration.difficulty } as ILobbyRequest);
    }

    public joinGame(game: IConnectionInfo): void {
        this.gameConfiguration.opponentName = game.player;
        this.communicationService.joinGame({ player: this.gameConfiguration.playerName, gameId: game.gameId });
        this.router.navigate([GAME_URL]);
    }
}
