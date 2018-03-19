import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { GameComponent } from "./racing/game-component/game.component";
import { RouterModule, Routes } from "@angular/router";
import { RenderService } from "./racing/render-service/render.service";
import { BasicService } from "./basic.service";
import { EditorComponent } from "./racing/editor/editor.component";
import { AdminComponent } from "./racing/admin/admin.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { RacingGameComponent } from "./racing/racing-game/racing-game.component";
import { CrosswordGridComponent } from "./crossword/crossword-grid/crossword-grid.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import {APP_BASE_HREF} from "@angular/common";
import { TrackServices } from "./racing/track.services/track.service";
import { UserComponent } from "./racing/user/user.component";
import {SceneServices} from "./racing/scene.services/scene.service";
import { RaceComponent } from "./racing/race/race.component";

const appRoutes: Routes = [
    { path: "editor/:name", component: EditorComponent },
    { path: "crossword", component: CrosswordGridComponent },
    { path: "crossword/easy", component: CrosswordGridComponent },
    { path: "crossword/medium", component: CrosswordGridComponent},
    { path: "crossword/hard", component: CrosswordGridComponent},
    { path: "editor", component: EditorComponent },
    { path: "admin", component: AdminComponent },
    { path: "user", component: UserComponent },
    { path: "race/:name", component: RaceComponent },
    { path: "race/:name/play/", component: GameComponent },
    { path: "race", component: RaceComponent },
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
        RaceComponent
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
        TrackServices,
        RenderService,
        BasicService,
        {provide: APP_BASE_HREF, useValue : "/" }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
