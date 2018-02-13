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
import { CrosswordViewComponent } from './crossword/crossword-view/crossword-view.component';
import { RacingGameComponent } from './racing/racing-game/racing-game.component';
const appRoutes: Routes = [
    { path: "crossword", component: CrosswordViewComponent },
    { path: "editeur", component: EditeurComponent },
    { path: "admin", component: AdminComponent },
    { path: "racing", component: RacingGameComponent },
    { path: "", children:[]},
    { path: "**", component: PageNotFoundComponent }

];

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        EditeurComponent,
        AdminComponent,
        PageNotFoundComponent,
        CrosswordViewComponent,
        RacingGameComponent
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
