import { async, ComponentFixture, inject, TestBed, tick, fakeAsync } from "@angular/core/testing";
import { Router } from "@angular/router";
import { MultiplayerLobbyComponent } from "./multiplayer-lobby.component";
import { CommunicationService } from "../../communication.service";
import { SocketsService } from "../../sockets.service";
import { HttpClientModule } from "@angular/common/http";
import { GameConfigurationService } from "../../game-configuration.service";
import { RouterTestingModule } from "@angular/router/testing";
import { CrosswordGridComponent } from "../crossword-grid/crossword-grid.component";
import { IConnectionInfo } from "../../../../../../common/communication/events";

describe("MultiplayerLobbyComponent", () => {
    let component: MultiplayerLobbyComponent;
    let fixture: ComponentFixture<MultiplayerLobbyComponent>;
    let router: Router;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MultiplayerLobbyComponent, CrosswordGridComponent],
            imports: [HttpClientModule, RouterTestingModule, RouterTestingModule.withRoutes([
            { path: "crossword/game", component: CrosswordGridComponent }])],
            providers: [CommunicationService, SocketsService, GameConfigurationService]
        })
            .compileComponents();
    }));

    beforeEach(inject([Router], (_router: Router) => {
        router = _router;
        fixture = TestBed.createComponent(MultiplayerLobbyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("When a player tries to join a game, it should put him in a game with the other player", fakeAsync(() => {
        const game: IConnectionInfo = {gameId: "50", player: "Marc-Antoine"} // Game to join
        component.joinGame(game);
        tick(100);
        expect(router.url).toBe("/crossword/game");
    }));

});