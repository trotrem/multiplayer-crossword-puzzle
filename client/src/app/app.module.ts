import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { GameComponent } from "./racing/components/racing-game/game-component/game.component";
import { RouterModule, Routes } from "@angular/router";
import { RenderService } from "./racing/components/render.service/render.service";
import { EditorComponent } from "./racing/components/editor/editor.component";
import { AdminComponent } from "./racing/components/admin/admin.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { RacingGameComponent } from "./racing/components/racing-game/racing-game.component";
import { CrosswordGridComponent } from "./crossword/crossword-grid/crossword-grid.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { APP_BASE_HREF } from "@angular/common";
import { UserComponent } from "./racing/components/user/user.component";
import { RacingCommunicationService } from "./racing/communication.service/communicationRacing.service";
import { HomePageComponent } from "./crossword/home-page/home-page.component";
import { EndGameComponent } from "./crossword/end-game/end-game.component";
import { GameResultsComponent } from "./racing/components/game-results/game-results.component";
import { GameManagerService } from "./racing/components/racing-game/game-manager/game-manager.service";
import { WallsCollisionsService } from "./racing/components/racing-game/walls-collisions-service/walls-collisions-service";
import { MultiplayerLobbyComponent } from "./crossword/multiplayer-lobby/multiplayer-lobby.component";
import { SocketsService } from "./crossword/sockets.service";
import { WaitingRoomComponent } from "./crossword/waiting-room/waiting-room.component";
import { CommunicationService } from "./crossword/communication.service";
import { GameConfigurationService } from "./crossword/game-configuration.service";
import { RenderGameService } from "./racing/components/racing-game/render-game-service/render-game.service";
import { SceneGameService } from "./racing/components/racing-game/scene-game-service/scene-game-service.service";
import { GridService } from "./crossword/grid-service";
import { SceneEditorService } from "./racing/components/editor/scene-editor.service/scene-editor.service";
import { KeyboardEventService } from "./racing/components/racing-game/commands/keyboard-event.service";
import { WallService } from "./racing/components/racing-game/walls-collisions-service/walls";
import { CarsCollisionService } from "./racing/components/racing-game/car/cars-collision/cars-collision.service";

const appRoutes: Routes = [
    { path: "gameResults", component: GameResultsComponent },
    { path: "gameResults/:name", component: GameResultsComponent },
    { path: "editor/:name", component: EditorComponent },
    { path: "crossword/endGame/:result", component: EndGameComponent },
    { path: "crossword/homePage", component: HomePageComponent },
    { path: "crossword/lobby", component: MultiplayerLobbyComponent },
    { path: "crossword/game", component: CrosswordGridComponent },
    { path: "crossword/waiting", component: WaitingRoomComponent },
    { path: "editor", component: EditorComponent },
    { path: "admin", component: AdminComponent },
    { path: "user", component: UserComponent },
    { path: "race/:name", component: GameComponent },
    { path: "race", component: GameComponent },
    { path: "racing", component: RacingGameComponent },
    { path: "", children: [] },
    { path: "**", component: PageNotFoundComponent },
];

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        EditorComponent,
        AdminComponent,
        PageNotFoundComponent,
        RacingGameComponent,
        CrosswordGridComponent,
        UserComponent,
        HomePageComponent,
        EndGameComponent,
        GameResultsComponent,
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
        RacingCommunicationService,
        RenderService,
        GameManagerService,
        WallsCollisionsService,
        SocketsService,
        CommunicationService,
        GameConfigurationService,
        RenderGameService,
        SceneGameService,
        GridService,
        SceneEditorService,
        KeyboardEventService,
        CarsCollisionService,
        WallService,
        { provide: APP_BASE_HREF, useValue: "/" }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
