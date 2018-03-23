import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { GameComponent } from "./racing/game-component/game.component";
import { RouterModule, Routes } from "@angular/router";
import { RenderService } from "./racing/render-service/render.service";
import { EditorComponent } from "./racing/editor/editor.component";
import { AdminComponent } from "./racing/admin/admin.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { RacingGameComponent } from "./racing/racing-game/racing-game.component";
import { CrosswordGridComponent } from "./crossword/crossword-grid/crossword-grid.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import {APP_BASE_HREF} from "@angular/common";
import { UserComponent } from "./racing/user/user.component";
import {SceneServices} from "./racing/scene.services/scene.service";
import { CommunicationRacingService } from "./racing/communication.service/communicationRacing.service";
import { HomePageComponent } from "./crossword/home-page/home-page.component";
import { EndGameComponent } from "./crossword/end-game/end-game.component";
import { GameResultsComponent } from "./racing/game-results/game-results.component";

const appRoutes: Routes = [
    { path: "gameResults", component: GameResultsComponent },
    { path: "gameResults/:CarIndex", component: GameResultsComponent },
    { path: "editor/:name", component: EditorComponent },
    { path: "endGame", component: EndGameComponent},
    { path: "endGame/:nbPlayers", component: EndGameComponent},
    { path: "endGame/:nbPlayers/:Difficulty", component: EndGameComponent},
    { path: "homePage", component: HomePageComponent },
    { path: "crossword", component: CrosswordGridComponent },
    { path: "crossword/:nbPlayers", component: CrosswordGridComponent },
    { path: "crossword/:nbPlayers/:Difficulty", component: CrosswordGridComponent },
    { path: "editor", component: EditorComponent },
    { path: "admin", component: AdminComponent },
    { path: "user", component: UserComponent },
    { path: "race/:name", component: GameComponent },
    { path: "race", component: GameComponent },
    { path: "racing", component: RacingGameComponent },
    { path: "", children: []},
    { path: "**", component: PageNotFoundComponent }
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
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        RouterModule.forRoot(
            appRoutes
          )
    ],
    providers: [
        SceneServices,
        CommunicationRacingService,
        RenderService,
        {provide: APP_BASE_HREF, useValue : "/" }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
