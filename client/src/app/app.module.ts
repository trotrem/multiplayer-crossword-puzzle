import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { GameComponent } from "./racing/game-component/game.component";
import { RouterModule, Routes } from "@angular/router";
import { RenderService } from "./racing/render-service/render.service";
import { BasicService } from "./basic.service";
import { EditeurComponent } from "./crossword/editeur/editeur.component";
import { AdminComponent } from "./racing/admin/admin.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { RacingGameComponent } from "./racing/racing-game/racing-game.component";
import { CrosswordGridComponent } from "./crossword/crossword-grid/crossword-grid.component";

const appRoutes: Routes = [
    { path: "crossword", component: CrosswordGridComponent },
    { path: "editeur", component: EditeurComponent },
    { path: "admin", component: AdminComponent },
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
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(
            appRoutes
          )
    ],
    providers: [
        RenderService,
        BasicService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
