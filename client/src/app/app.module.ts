import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { RouterModule, Routes } from "@angular/router";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { CrosswordGridComponent } from "./crossword/component/crossword-grid/crossword-grid.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { APP_BASE_HREF } from "@angular/common";
import { HomePageComponent } from "./crossword/component/home-page/home-page.component";
import { EndGameComponent } from "./crossword/component/end-game/end-game.component";
import { MultiplayerLobbyComponent } from "./crossword/component/multiplayer-lobby/multiplayer-lobby.component";
import { SocketsService } from "./crossword/services/sockets/sockets.service";
import { WaitingRoomComponent } from "./crossword/component/waiting-room/waiting-room.component";
import { CommunicationService } from "./crossword/services/communication/communication.service";
import { GameConfigurationService } from "./crossword/services/game-configuration/game-configuration.service";
import { GridManager } from "./crossword/services/grid-manager/grid-manager.service";

const appRoutes: Routes = [
    { path: "endGame/:result", component: EndGameComponent },
    { path: "", component: HomePageComponent },
    { path: "lobby", component: MultiplayerLobbyComponent },
    { path: "game", component: CrosswordGridComponent },
    { path: "waiting", component: WaitingRoomComponent },
    { path: "**", component: PageNotFoundComponent },
];

@NgModule({
    declarations: [
        AppComponent,
        PageNotFoundComponent,
        CrosswordGridComponent,
        HomePageComponent,
        EndGameComponent,
        MultiplayerLobbyComponent,
        WaitingRoomComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        RouterModule.forRoot(
            appRoutes
        )],
    providers: [
        SocketsService,
        CommunicationService,
        GameConfigurationService,
        GridManager,
        { provide: APP_BASE_HREF, useValue: "/" }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
