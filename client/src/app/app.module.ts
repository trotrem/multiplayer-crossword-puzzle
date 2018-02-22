import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { GameComponent } from "./game-component/game.component";
import { RouterModule, Routes } from "@angular/router";
import { RenderService } from "./render-service/render.service";
import { BasicService } from "./basic.service";
import { EditeurComponent } from "./editeur/editeur.component";
import { AdminComponent } from "./admin/admin.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import {APP_BASE_HREF} from "@angular/common";
import { TrackServices } from "./editeur/track-services";
const appRoutes: Routes = [
  { path: "editeur", component: EditeurComponent },
  { path: "admin", component: AdminComponent },
  { path: "", redirectTo: "/editeur", pathMatch: "full"},
  { path: "**", component: PageNotFoundComponent }

];

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        EditeurComponent,
        AdminComponent,
        PageNotFoundComponent
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
