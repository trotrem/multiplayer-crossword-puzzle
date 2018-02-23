import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { GameComponent } from "./racing/game-component/game.component";
import { RouterModule, Routes } from "@angular/router";
import { RenderService } from "./racing/render-service/render.service";
import { BasicService } from "./basic.service";
import { EditeurComponent } from "./racing/editeur/editeur.component";
import { AdminComponent } from "./racing/admin/admin.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { RacingGameComponent } from "./racing/racing-game/racing-game.component";
import { CrosswordGridComponent } from "./crossword/crossword-grid/crossword-grid.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import {APP_BASE_HREF} from "@angular/common";
import { TrackServices } from "./racing/editeur/track-services";
import { UserComponent } from "./racing/user/user.component";

const appRoutes: Routes = [
    { path: "editeur/:name", component: EditeurComponent },
    { path: "crossword", component: CrosswordGridComponent },
    { path: "editeur", component: EditeurComponent },
    { path: "admin", component: AdminComponent },
    { path: "user", component: UserComponent },
    { path: "racing", component: RacingGameComponent },
    { path: "", children: []},
    { path: "**", component: PageNotFoundComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        EditeurComponent,
        AdminComponent,
        PageNotFoundComponent,
        RacingGameComponent,
        CrosswordGridComponent,
        UserComponent,
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
        TrackServices,
        RenderService,
        BasicService,
        {provide: APP_BASE_HREF, useValue : "/" }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
