import { async, TestBed, inject, fakeAsync, tick } from "@angular/core/testing";
import { HomePageComponent } from "./home-page.component";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { Difficulty } from "../../../../../../common/communication/types";
import { CrosswordGridComponent } from "../crossword-grid/crossword-grid.component";
import { CommunicationService } from "../../communication.service";
import { GameConfigurationService } from "../../game-configuration.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { SocketsService } from "../../sockets.service";
import { WaitingRoomComponent } from "../waiting-room/waiting-room.component";
import { MultiplayerLobbyComponent } from "../multiplayer-lobby/multiplayer-lobby.component";

/* tslint:disable:no-magic-numbers*/
describe("HomePageComponent", () => {
    let component: HomePageComponent;
    let router: Router;

    beforeEach(async(() => {
        void TestBed.configureTestingModule({
            declarations: [HomePageComponent, CrosswordGridComponent, WaitingRoomComponent, MultiplayerLobbyComponent],
            imports: [FormsModule, HttpClientTestingModule,
                      RouterTestingModule.withRoutes([
                        { path: "crossword/game", component: CrosswordGridComponent },
                        { path: "crossword/waiting", component: WaitingRoomComponent },
                        { path: "crossword/lobby", component: MultiplayerLobbyComponent }])],
            providers: [CommunicationService, GameConfigurationService, SocketsService]
        })
            .compileComponents();
    }));

    beforeEach(inject([Router], (_router: Router) => {
        router = _router;
        component = TestBed.createComponent(HomePageComponent).componentInstance;
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("play with 1 player takes you to /crossword/game", fakeAsync(() => {
        component.difficultyGrade = Difficulty.Easy;
        component.numberPlayers = 1;
        component.play();
        tick(100);
        expect(router.url).toBe("/crossword/game");
    }));

    it("play with 2 player takes you to a waiting room on '/crossword/waiting'.", fakeAsync(() => {
        component.difficultyGrade = Difficulty.Easy;
        component.numberPlayers = 2;
        component.play();
        tick(100);
        expect(router.url).toBe("/crossword/waiting");
    }));

    it("A player who wants to join a game will be redirect to a lobby on '/crossword/lobby'.", fakeAsync(() => {
        component.difficultyGrade = Difficulty.Easy;
        component.numberPlayers = 2;
        component.joinGame();
        tick(100);
        expect(router.url).toBe("/crossword/lobby");
    }));
});
